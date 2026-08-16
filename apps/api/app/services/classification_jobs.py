import uuid
from datetime import UTC, datetime
from typing import Any

from app.core.cache import cache

QUEUE_KEY = "envirescue:classification:queue"
JOB_PREFIX = "envirescue:classification:job:"
JOB_TTL_SECONDS = 86_400


def enqueue_classification(
    report_id: uuid.UUID, image_url: str | None, user_id: uuid.UUID
) -> dict[str, Any] | None:
    job = {
        "job_id": str(uuid.uuid4()),
        "report_id": str(report_id),
        "user_id": str(user_id),
        "image_url": image_url,
        "status": "pending",
        "attempts": 0,
        "created_at": datetime.now(UTC).isoformat(),
    }
    if not cache.push(QUEUE_KEY, job):
        return None
    cache.set_json(f"{JOB_PREFIX}{job['job_id']}", job, JOB_TTL_SECONDS)
    return job


def get_job(job_id: str) -> dict[str, Any] | None:
    value = cache.get_json(f"{JOB_PREFIX}{job_id}")
    return value if isinstance(value, dict) else None


def update_job(job: dict[str, Any]) -> None:
    cache.set_json(f"{JOB_PREFIX}{job['job_id']}", job, JOB_TTL_SECONDS)
