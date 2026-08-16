from typing import Any

import httpx

from app.ai.classifier import Prediction
from app.ai.confidence import requires_manual_review
from app.core.config import settings

MODEL_CATEGORY_MAP = {
    "battery": "Electronic waste",
    "biological": "Organic",
    "cardboard": "Paper",
    "clothes": "General or mixed waste",
    "glass": "Glass",
    "metal": "Metal",
    "paper": "Paper",
    "plastic": "Plastic",
    "shoes": "General or mixed waste",
    "trash": "General or mixed waste",
}


def _prediction_from_payload(payload: dict[str, Any]) -> Prediction:
    detected_type = str(payload.get("detected_type") or payload.get("label") or "unknown")
    raw_category = str(payload.get("classification") or payload.get("category") or detected_type)
    category = MODEL_CATEGORY_MAP.get(
        raw_category.lower(), MODEL_CATEGORY_MAP.get(detected_type.lower(), raw_category)
    )
    confidence = float(payload.get("confidence") or payload.get("score") or 0)
    confidence = min(max(confidence, 0), 1)
    return Prediction(
        category=category,
        detected_type=detected_type,
        classification_group=raw_category,
        confidence=confidence,
        requires_review=requires_manual_review(confidence, settings.ai_confidence_threshold),
        model_name=settings.ai_model_name,
    )


async def classify_with_remote_service(
    content: bytes, filename: str = "waste-image.jpg"
) -> Prediction:
    if settings.ai_classifier_url is None:
        raise RuntimeError("AI_CLASSIFIER_URL must be configured when AI_PROVIDER=remote.")
    headers = {"Authorization": f"Bearer {settings.hf_api_token}"} if settings.hf_api_token else {}
    files = {"file": (filename, content, "image/jpeg")}
    async with httpx.AsyncClient(timeout=settings.ai_request_timeout_seconds) as client:
        response = await client.post(
            str(settings.ai_classifier_url).rstrip("/"), files=files, headers=headers
        )
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, dict):
        raise RuntimeError("The classifier returned an invalid response.")
    return _prediction_from_payload(payload)
