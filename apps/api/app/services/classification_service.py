import logging
import time

from app.ai.classifier import Prediction, classifier
from app.ai.preprocessing import prepare_image
from app.ai.remote import classify_with_remote_service
from app.core.cache import cache
from app.core.config import settings
from app.utils.image_hash import image_content_hash

logger = logging.getLogger(__name__)


async def classify_image(content: bytes, filename: str = "waste-image.jpg") -> Prediction:
    started = time.perf_counter()
    cache_key = f"classification:{image_content_hash(content)}"
    cached = cache.get_json(cache_key)
    if isinstance(cached, dict):
        logger.info(
            "classification_completed source=cache duration_ms=%.2f",
            (time.perf_counter() - started) * 1000,
        )
        return Prediction(**cached)

    if settings.ai_provider == "remote":
        prediction = await classify_with_remote_service(content, filename)
    else:
        prediction = classifier.predict(prepare_image(content))
    cache.set_json(cache_key, prediction.__dict__, ttl_seconds=86_400)
    logger.info(
        "classification_completed source=%s status=%s confidence=%.4f duration_ms=%.2f",
        settings.ai_provider,
        "review_required" if prediction.requires_review else "accepted",
        prediction.confidence,
        (time.perf_counter() - started) * 1000,
    )
    return prediction
