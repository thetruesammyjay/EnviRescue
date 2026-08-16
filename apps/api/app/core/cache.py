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
        try:
            value = self._client.get(key)
        except Exception:
            return None
        return json.loads(value) if isinstance(value, str) else value

    def set_json(self, key: str, value: Any, ttl_seconds: int) -> None:
        if self._client is not None:
            try:
                self._client.set(key, json.dumps(value), ex=ttl_seconds)
            except Exception:
                return

    def delete(self, key: str) -> None:
        if self._client is not None:
            try:
                self._client.delete(key)
            except Exception:
                return

    def increment_with_window(self, key: str, window_seconds: int) -> int | None:
        """Increment a counter and set its expiry when Redis is configured."""
        if self._client is None:
            return None
        try:
            count = int(self._client.incr(key))
            if count == 1:
                self._client.expire(key, window_seconds)
            return count
        except Exception:
            return None

    def push(self, key: str, value: Any) -> bool:
        if self._client is None:
            return False
        try:
            self._client.rpush(key, json.dumps(value))
            return True
        except Exception:
            return False

    def pop(self, key: str) -> Any | None:
        if self._client is None:
            return None
        try:
            value = self._client.lpop(key)
            return json.loads(value) if isinstance(value, str) else value
        except Exception:
            return None

    def exists(self, key: str) -> bool:
        if self._client is None:
            return False
        try:
            return bool(self._client.exists(key))
        except Exception:
            return False


cache = Cache()
