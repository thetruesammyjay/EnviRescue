import os
import uuid

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select

if os.getenv("TEST_DATABASE_URL"):
    os.environ["DATABASE_URL"] = os.environ["TEST_DATABASE_URL"]

from app.core.database import SessionLocal
from app.main import app
from app.models.category import WasteCategory
from app.models.user import User, UserRole

pytestmark = pytest.mark.skipif(
    not os.getenv("TEST_DATABASE_URL"),
    reason="Set TEST_DATABASE_URL to run PostgreSQL integration tests.",
)


@pytest.mark.asyncio
async def test_dashboard_and_admin_review_workflow() -> None:
    email = f"admin-{uuid.uuid4()}@envirescue.test"
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        registration = await client.post(
            "/api/v1/auth/register",
            json={"email": email, "full_name": "Admin Tester", "password": "password-123"},
        )
        assert registration.status_code == 201
        user_id = registration.json()["id"]
        async with SessionLocal() as session:
            user = await session.get(User, user_id)
            assert user is not None
            user.role = UserRole.ADMIN
            category = await session.scalar(
                select(WasteCategory).where(WasteCategory.is_active.is_(True))
            )
            assert category is not None
            await session.commit()

        login = await client.post(
            "/api/v1/auth/login", json={"email": email, "password": "password-123"}
        )
        headers = {"Authorization": f"Bearer {login.json()['access_token']}"}
        report = await client.post(
            "/api/v1/waste",
            headers=headers,
            json={"category_id": str(category.id), "quantity_kg": 2, "location": "Test zone"},
        )
        assert report.status_code == 201

        dashboard = await client.get("/api/v1/dashboard/summary", headers=headers)
        assert dashboard.status_code == 200
        assert dashboard.json()["report_count"] >= 1

        admin_status = await client.get("/api/v1/admin/status", headers=headers)
        assert admin_status.status_code == 200
        review = await client.get("/api/v1/admin/classifications/review", headers=headers)
        assert review.status_code == 200
