import asyncio
import time
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


class _ClassifierCircuit:
    def __init__(self) -> None:
        self.failures = 0
        self.opened_at: float | None = None

    def allow_request(self) -> bool:
        if self.opened_at is None:
            return True
        if time.monotonic() - self.opened_at >= settings.ai_circuit_recovery_seconds:
            self.opened_at = None
            self.failures = 0
            return True
        return False

    def success(self) -> None:
        self.failures = 0
        self.opened_at = None

    def failure(self) -> None:
        self.failures += 1
        if self.failures >= settings.ai_circuit_failure_threshold:
            self.opened_at = time.monotonic()


_circuit = _ClassifierCircuit()


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
    if not _circuit.allow_request():
        raise RuntimeError("AI classifier circuit is open; retry later or classify manually.")
    headers = {"Authorization": f"Bearer {settings.hf_api_token}"} if settings.hf_api_token else {}
    files = {"file": (filename, content, "image/jpeg")}
    attempts = settings.ai_max_retries + 1
    for attempt in range(attempts):
        try:
            async with httpx.AsyncClient(timeout=settings.ai_request_timeout_seconds) as client:
                response = await client.post(
                    str(settings.ai_classifier_url).rstrip("/"), files=files, headers=headers
                )
            if response.status_code >= 500:
                response.raise_for_status()
            response.raise_for_status()
            payload = response.json()
            if not isinstance(payload, dict):
                raise RuntimeError("The classifier returned an invalid response.")
            _circuit.success()
            return _prediction_from_payload(payload)
        except (httpx.TimeoutException, httpx.NetworkError, httpx.RemoteProtocolError) as exc:
            _circuit.failure()
            if attempt == attempts - 1:
                raise RuntimeError("AI classifier request failed after retries.") from exc
        except httpx.HTTPStatusError as exc:
            _circuit.failure()
            if exc.response.status_code < 500 or attempt == attempts - 1:
                raise
        if settings.ai_retry_backoff_seconds:
            await asyncio.sleep(settings.ai_retry_backoff_seconds * (2**attempt))
    raise RuntimeError("AI classifier request failed.")
