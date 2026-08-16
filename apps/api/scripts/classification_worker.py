"""Run the Redis classification worker as a separate process."""

import asyncio
import time

import httpx
from sqlalchemy import select

from app.ai.classifier import Prediction
from app.core.cache import cache
from app.core.database import SessionLocal
from app.models.category import WasteCategory
from app.models.classification import Classification
from app.models.waste_report import WasteReport
from app.services.classification_jobs import QUEUE_KEY, update_job
from app.services.classification_service import classify_image

MAX_ATTEMPTS = 3


async def process_job(job: dict) -> None:
    report_id = job["report_id"]
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(job["image_url"])
            response.raise_for_status()
        prediction: Prediction = await classify_image(response.content, "waste-image.jpg")
        async with SessionLocal() as session:
            report = await session.get(WasteReport, report_id)
            if report is None:
                raise RuntimeError("Waste report no longer exists.")
            category = await session.scalar(
                select(WasteCategory).where(WasteCategory.name == prediction.category)
            )
            if category is None:
                raise RuntimeError("Predicted category is not seeded.")
            report.category_id = category.id
            classification = await session.scalar(
                select(Classification).where(Classification.waste_report_id == report.id)
            )
            if classification is None:
                classification = Classification(waste_report_id=report.id)
                session.add(classification)
            classification.predicted_category = prediction.category
            classification.confidence = prediction.confidence
            classification.model_name = prediction.model_name
            classification.requires_review = prediction.requires_review
            classification.classification_status = (
                "review_required" if prediction.requires_review else "accepted"
            )
            classification.classification_source = "ai"
            classification.error_message = None
            await session.commit()
        job["status"] = "completed"
        update_job(job)
    except Exception as exc:
        job["error"] = str(exc)[:500]
        if job["attempts"] < MAX_ATTEMPTS:
            job["status"] = "retrying"
            update_job(job)
            time.sleep(2 ** job["attempts"])
            cache.push(QUEUE_KEY, job)
        else:
            job["status"] = "failed"
            update_job(job)


def run() -> None:
    while True:
        job = cache.pop(QUEUE_KEY)
        if not isinstance(job, dict):
            time.sleep(1)
            continue
        job["status"] = "processing"
        job["attempts"] = int(job.get("attempts", 0)) + 1
        update_job(job)
        asyncio.run(process_job(job))


if __name__ == "__main__":
    run()
