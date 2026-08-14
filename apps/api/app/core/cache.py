import json
from typing import Any

from upstash_redis import Redis

from app.core.config import settings


class Cache:
    def __init__(self) -> None:
        self._client = (
            Redis(url=settings.upstash_redis_rest_url, token=settings.upstash_redis_rest_token)
            if settings.upstash_redis_rest_url and settings.upstash_redis_rest_token
            else None
        )

    def get_json(self, key: str) -> Any | None:
        if self._client is None:
            return None
        value = self._client.get(key)
        return json.loads(value) if isinstance(value, str) else value

    def set_json(self, key: str, value: Any, ttl_seconds: int) -> None:
        if self._client is not None:
            self._client.set(key, json.dumps(value), ex=ttl_seconds)

    def delete(self, key: str) -> None:
        if self._client is not None:
            self._client.delete(key)


cache = Cache()
