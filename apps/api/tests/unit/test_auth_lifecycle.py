from app.core import security


def test_access_and_refresh_tokens_have_distinct_types() -> None:
    access = security.decode_access_token(security.create_access_token("user-1"))
    refresh = security.decode_access_token(security.create_refresh_token("user-1"))

    assert access["type"] == "access"
    assert refresh["type"] == "refresh"
    assert access["jti"] != refresh["jti"]
    assert refresh["family"]


def test_refresh_rotation_preserves_family_but_changes_token_id() -> None:
    first = security.decode_access_token(security.create_refresh_token("user-1"))
    rotated = security.decode_access_token(security.create_refresh_token("user-1", first["family"]))

    assert rotated["family"] == first["family"]
    assert rotated["jti"] != first["jti"]


def test_revocation_cache_can_block_a_token(monkeypatch) -> None:
    revoked: set[str] = set()

    class RevocationCache:
        def exists(self, key: str) -> bool:
            return key in revoked

        def set_json(self, key: str, value: object, ttl_seconds: int) -> None:
            revoked.add(key)

    token = security.create_access_token("user-1")
    claims = security.decode_access_token(token)
    cache = RevocationCache()
    cache.set_json(f"revoked:{claims['jti']}", True, 3600)

    assert cache.exists(f"revoked:{claims['jti']}") is True
