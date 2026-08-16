import uuid
from typing import Annotated

import httpx
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select

from app.api.dependencies import CurrentUser, DatabaseSession
from app.core.config import settings
from app.models.category import WasteCategory
from app.models.classification import Classification
from app.models.waste_report import WasteReport
from app.schemas.classification import ClassificationCorrection, ClassificationResult
from app.services.classification_service import classify_image
from app.utils.image_validation import validate_image_bytes

router = APIRouter(prefix="/classifications", tags=["classification"])


async def _classification_for_report(
    session: DatabaseSession, report_id: uuid.UUID
) -> Classification:
    classification = await session.scalar(
        select(Classification).where(Classification.waste_report_id == report_id)
    )
    if classification is None:
        classification = Classification(waste_report_id=report_id)
        session.add(classification)
    return classification


@router.post("/image", response_model=ClassificationResult)
async def classify_upload(
    session: DatabaseSession,
    user: CurrentUser,
    image: Annotated[UploadFile, File(description="JPEG, PNG, or WebP waste image")],
    report_id: Annotated[uuid.UUID | None, Form()] = None,
) -> ClassificationResult:
    content = await image.read()
    if len(content) > settings.max_image_size_mb * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Image is too large."
        )
    try:
        validate_image_bytes(content)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from exc
    report = None
    if report_id is not None:
        report = await session.scalar(
            select(WasteReport).where(WasteReport.id == report_id, WasteReport.user_id == user.id)
        )
        if report is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Waste report not found."
            )
    try:
        prediction = await classify_image(content, image.filename or "waste-image.jpg")
    except (ValueError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from exc
    except (httpx.HTTPError, RuntimeError):
        if report is not None:
            classification = await _classification_for_report(session, report.id)
            classification.classification_status = "failed"
            classification.classification_source = "ai"
            classification.requires_review = True
            classification.error_message = (
                "AI classification is unavailable; choose a category manually."
            )
            await session.commit()
        return ClassificationResult(
            waste_report_id=report_id,
            requires_review=True,
            status="failed",
            source="ai",
            error_message="AI classification is unavailable; choose a category manually.",
        )
    if report is not None:
        category = await session.scalar(
            select(WasteCategory).where(WasteCategory.name == prediction.category)
        )
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Predicted category is not seeded.",
            )
        report.category_id = category.id
        classification = await _classification_for_report(session, report.id)
        classification.predicted_category = prediction.category
        classification.confidence = prediction.confidence
        classification.model_name = prediction.model_name
        classification.requires_review = prediction.requires_review
        classification.classification_status = (
            "review_required" if prediction.requires_review else "accepted"
        )
        classification.classification_source = "ai"
        classification.error_message = None
        await session.commit()
    return ClassificationResult(
        waste_report_id=report_id,
        status="review_required" if prediction.requires_review else "accepted",
        source="ai",
        **prediction.__dict__,
    )


@router.post("/{report_id}/manual", response_model=ClassificationResult)
async def manually_classify(
    report_id: uuid.UUID,
    payload: ClassificationCorrection,
    session: DatabaseSession,
    user: CurrentUser,
) -> ClassificationResult:
    report = await session.scalar(
        select(WasteReport).where(WasteReport.id == report_id, WasteReport.user_id == user.id)
    )
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Waste report not found.")
    category = await session.get(WasteCategory, payload.category_id)
    if category is None or not category.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Waste category not found."
        )
    report.category_id = category.id
    classification = await _classification_for_report(session, report.id)
    classification.predicted_category = category.name
    classification.confidence = 1
    classification.model_name = None
    classification.requires_review = False
    classification.manually_corrected = True
    classification.classification_status = "accepted"
    classification.classification_source = "manual"
    classification.error_message = None
    await session.commit()
    return ClassificationResult(
        waste_report_id=report.id,
        category=category.name,
        confidence=1,
        requires_review=False,
        status="accepted",
        source="manual",
    )
