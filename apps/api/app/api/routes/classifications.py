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
from app.schemas.classification import ClassificationResult
from app.services.classification_service import classify_image

router = APIRouter(prefix="/classifications", tags=["classification"])


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
        prediction = await classify_image(content, image.filename or "waste-image.jpg")
    except (ValueError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from exc
    except (httpx.HTTPError, RuntimeError) as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The classifier service is unavailable.",
        ) from exc
    if report_id is not None:
        report = await session.scalar(
            select(WasteReport).where(WasteReport.id == report_id, WasteReport.user_id == user.id)
        )
        if report is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Waste report not found."
            )
        category = await session.scalar(
            select(WasteCategory).where(WasteCategory.name == prediction.category)
        )
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Predicted category is not seeded.",
            )
        report.category_id = category.id
        classification = await session.scalar(
            select(Classification).where(Classification.waste_report_id == report.id)
        )
        if classification is None:
            classification = Classification(waste_report_id=report.id)
            session.add(classification)
        classification.predicted_category = prediction.category
        classification.confidence = prediction.confidence
        classification.model_name = prediction.model_name
        classification.requires_review = prediction.requires_review
        await session.commit()
    return ClassificationResult(waste_report_id=report_id, **prediction.__dict__)
