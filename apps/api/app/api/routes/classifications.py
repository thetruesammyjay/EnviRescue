from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.api.dependencies import CurrentUser
from app.core.config import settings
from app.schemas.classification import ClassificationResult
from app.services.classification_service import classify_image

router = APIRouter(prefix="/classifications", tags=["classification"])


@router.post("/image", response_model=ClassificationResult)
async def classify_upload(
    _: CurrentUser,
    image: Annotated[UploadFile, File(description="JPEG, PNG, or WebP waste image")],
) -> ClassificationResult:
    content = await image.read()
    if len(content) > settings.max_image_size_mb * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Image is too large."
        )
    try:
        prediction = classify_image(content)
    except (ValueError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from exc
    return ClassificationResult(**prediction.__dict__)
