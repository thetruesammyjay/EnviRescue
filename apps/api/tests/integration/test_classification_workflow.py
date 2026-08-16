import os
import uuid
from io import BytesIO

import pytest
from httpx import ASGITransport, AsyncClient
from PIL import Image
from sqlalchemy import select

if os.getenv("TEST_DATABASE_URL"):
    os.environ["DATABASE_URL"] = os.environ["TEST_DATABASE_URL"]

from app.api.routes import classifications
from app.core.database import SessionLocal
from app.main import app
from app.models.category import WasteCategory

pytestmark = pytest.mark.skipif(
    not os.getenv("TEST_DATABASE_URL"),
    reason="Set TEST_DATABASE_URL to run PostgreSQL integration tests.",
)


@pytest.mark.asyncio
async def test_classifier_failure_can_be_completed_manually(monkeypatch) -> None:
    async def unavailable(*args, **kwargs):
        raise RuntimeError("classifier unavailable")

    monkeypatch.setattr(classifications, "classify_image", unavailable)
    image_buffer = BytesIO()
    Image.new("RGB", (2, 2), "white").save(image_buffer, format="PNG")
    email = f"classification-{uuid.uuid4()}@envirescue.test"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        registration = await client.post(
            "/api/v1/auth/register",
            json={"email": email, "full_name": "Classification Tester", "password": "password-123"},
        )
        assert registration.status_code == 201
        login = await client.post(
            "/api/v1/auth/login", json={"email": email, "password": "password-123"}
        )
        token = login.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        async with SessionLocal() as session:
            category = await session.scalar(
                select(WasteCategory).where(WasteCategory.is_active.is_(True))
            )
        assert category is not None

        report = await client.post(
            "/api/v1/waste",
            headers=headers,
            json={
                "category_id": str(category.id),
                "quantity_kg": 1,
                "location": "Integration test",
            },
        )
        assert report.status_code == 201
        report_id = report.json()["id"]

        failure = await client.post(
            "/api/v1/classifications/image",
            headers=headers,
            files={"image": ("waste.png", image_buffer.getvalue(), "image/png")},
            data={"report_id": report_id},
        )
        assert failure.status_code == 200
        assert failure.json()["status"] == "failed"

        manual = await client.post(
            f"/api/v1/classifications/{report_id}/manual",
            headers=headers,
            json={"category_id": str(category.id)},
        )
        assert manual.status_code == 200
        assert manual.json()["source"] == "manual"
