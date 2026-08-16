from fastapi.testclient import TestClient

from app.main import app


def test_liveness_does_not_require_external_services() -> None:
    response = TestClient(app).get("/health/live")

    assert response.status_code == 200
    assert response.json()["status"] == "alive"
    assert response.headers.get("x-request-id")
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"


def test_ai_health_is_dependency_free() -> None:
    response = TestClient(app).get("/health/ai")

    assert response.status_code == 200
    assert response.json()["provider"] in {"fallback", "remote"}
