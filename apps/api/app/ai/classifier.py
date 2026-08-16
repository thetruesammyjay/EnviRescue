from dataclasses import dataclass

from PIL import Image

from app.ai.confidence import requires_manual_review
from app.core.config import settings


@dataclass(frozen=True)
class Prediction:
    category: str
    detected_type: str | None
    classification_group: str | None
    confidence: float
    requires_review: bool
    model_name: str | None


class WasteClassifier:
    """Model adapter. Replace the fallback in `predict` when a trained model is selected."""

    def predict(self, _: Image.Image) -> Prediction:
        confidence = 0.0
        return Prediction(
            category="General or mixed waste",
            detected_type=None,
            classification_group=None,
            confidence=confidence,
            requires_review=requires_manual_review(confidence, settings.ai_confidence_threshold),
            model_name=settings.ai_model_name,
        )


classifier = WasteClassifier()
