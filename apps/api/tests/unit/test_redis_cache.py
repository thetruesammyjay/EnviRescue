from app.core.cache import Cache


class FakeRedis:
    def __init__(self) -> None:
        self.values = {}
        self.expiries = {}

    def get(self, key):
        return self.values.get(key)

    def set(self, key, value, ex=None):
        self.values[key] = value
        self.expiries[key] = ex

    def delete(self, key):
        self.values.pop(key, None)

    def incr(self, key):
        self.values[key] = int(self.values.get(key, 0)) + 1
        return self.values[key]

    def expire(self, key, seconds):
        self.expiries[key] = seconds

    def rpush(self, key, value):
        self.values.setdefault(key, []).append(value)

    def lpop(self, key):
        values = self.values.get(key, [])
        return values.pop(0) if values else None


def test_cache_round_trip_and_queue_operations() -> None:
    cache = Cache()
    cache._client = FakeRedis()

    cache.set_json("key", {"value": 1}, 60)
    assert cache.get_json("key") == {"value": 1}
    assert cache.push("queue", {"job": "1"}) is True
    assert cache.pop("queue") == {"job": "1"}


def test_cache_rate_limit_counter_sets_window() -> None:
    cache = Cache()
    cache._client = FakeRedis()

    assert cache.increment_with_window("limit", 60) == 1
    assert cache.increment_with_window("limit", 60) == 2
    assert cache._client.expiries["limit"] == 60
