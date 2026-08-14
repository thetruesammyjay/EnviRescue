from app.ai.classifier import Prediction, classifier
from app.ai.preprocessing import prepare_image
from app.core.cache import cache
from app.utils.image_hash import image_content_hash


def classify_image(content: bytes) -> Prediction:
    cache_key = f"classification:{image_content_hash(content)}"
    cached = cache.get_json(cache_key)
    if isinstance(cached, dict):
        return Prediction(**cached)

    prediction = classifier.predict(prepare_image(content))
    cache.set_json(cache_key, prediction.__dict__, ttl_seconds=86_400)
    return prediction
