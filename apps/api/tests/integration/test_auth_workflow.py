import os

import pytest
from httpx import ASGITransport, AsyncClient

# Keep integration tests isolated from the developer's normal DATABASE_URL.
if os.getenv("TEST_DATABASE_URL"):
    os.environ["DATABASE_URL"] = os.environ["TEST_DATABASE_URL"]

from app.main import app

pytestmark = pytest.mark.skipif(
    not os.getenv("TEST_DATABASE_URL"),
    reason="Set TEST_DATABASE_URL to run PostgreSQL integration tests.",
)


@pytest.mark.asyncio
async def test_register_login_and_current_user() -> None:
    """Smoke-test the authenticated API contract against an isolated test database.

    Database schema setup is intentionally delegated to the test environment's
    migration step (`uv run alembic upgrade head`). This test never uses the
    configured production DATABASE_URL.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        email = "integration-user@envirescue.test"
        registration = await client.post(
            "/api/v1/auth/register",
            json={
                "email": email,
                "full_name": "Integration User",
                "password": "integration-password",
            },
        )
        assert registration.status_code == 201

        login = await client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": "integration-password"},
        )
        assert login.status_code == 200
        token = login.json()["access_token"]

        current_user = await client.get(
            "/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}
        )
        assert current_user.status_code == 200
        assert current_user.json()["email"] == email
