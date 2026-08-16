from app.ai.classifier import Prediction, classifier
from app.ai.preprocessing import prepare_image
from app.ai.remote import classify_with_remote_service
from app.core.cache import cache
from app.core.config import settings
from app.utils.image_hash import image_content_hash


async def classify_image(content: bytes, filename: str = "waste-image.jpg") -> Prediction:
    cache_key = f"classification:{image_content_hash(content)}"
    cached = cache.get_json(cache_key)
    if isinstance(cached, dict):
        return Prediction(**cached)

    if settings.ai_provider == "remote":
        prediction = await classify_with_remote_service(content, filename)
    else:
        prediction = classifier.predict(prepare_image(content))
    cache.set_json(cache_key, prediction.__dict__, ttl_seconds=86_400)
    return prediction
