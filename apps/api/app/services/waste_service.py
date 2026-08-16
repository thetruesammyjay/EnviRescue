import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import WasteCategory
from app.models.waste_report import WasteReport
from app.schemas.waste import WasteReportCreate


async def create_report(
    session: AsyncSession, user_id: uuid.UUID, payload: WasteReportCreate
) -> WasteReport:
    if await session.get(WasteCategory, payload.category_id) is None:
        raise ValueError("Waste category not found.")
    report = WasteReport(user_id=user_id, **payload.model_dump())
    session.add(report)
    await session.commit()
    await session.refresh(report)
    return report


async def list_reports(
    session: AsyncSession, user_id: uuid.UUID, offset: int, limit: int
) -> tuple[list[WasteReport], int]:
    query = (
        select(WasteReport)
        .where(WasteReport.user_id == user_id)
        .order_by(WasteReport.created_at.desc())
    )
    items = list((await session.scalars(query.offset(offset).limit(limit))).all())
    total = await session.scalar(
        select(func.count()).select_from(WasteReport).where(WasteReport.user_id == user_id)
    )
    return items, total or 0
