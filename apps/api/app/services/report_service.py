import uuid
from datetime import UTC, date, datetime, time

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import WasteCategory
from app.models.waste_report import WasteReport
from app.schemas.report import CategoryTotal, DashboardSummary, WasteActivityReport


def _boundary(value: date | None, end: bool = False) -> datetime | None:
    if value is None:
        return None
    return datetime.combine(value, time.max if end else time.min, tzinfo=UTC)


async def build_summary(
    session: AsyncSession,
    user_id: uuid.UUID | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
) -> DashboardSummary:
    query = select(WasteReport, WasteCategory).join(
        WasteCategory, WasteReport.category_id == WasteCategory.id
    )
    if user_id is not None:
        query = query.where(WasteReport.user_id == user_id)
    start = _boundary(start_date)
    end = _boundary(end_date, end=True)
    if start is not None:
        query = query.where(WasteReport.created_at >= start)
    if end is not None:
        query = query.where(WasteReport.created_at <= end)

    rows = (await session.execute(query)).all()
    total = sum(float(report.quantity_kg) for report, _ in rows)
    recyclable = sum(float(report.quantity_kg) for report, category in rows if category.recyclable)
    category_totals: dict[str, float] = {}
    for report, category in rows:
        category_totals[category.name] = category_totals.get(category.name, 0) + float(
            report.quantity_kg
        )
    return DashboardSummary(
        total_quantity_kg=round(total, 2),
        report_count=len(rows),
        recyclable_percentage=round((recyclable / total) * 100, 2) if total else 0,
        categories=[
            CategoryTotal(category=name, quantity_kg=round(value, 2))
            for name, value in sorted(category_totals.items())
        ],
    )


async def build_activity_report(
    session: AsyncSession,
    user_id: uuid.UUID,
    start_date: date | None = None,
    end_date: date | None = None,
) -> WasteActivityReport:
    summary = await build_summary(session, user_id, start_date, end_date)
    return WasteActivityReport(**summary.model_dump(), start_date=start_date, end_date=end_date)
