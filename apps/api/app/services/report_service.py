import uuid
from datetime import UTC, date, datetime, time

from sqlalchemy import case, func, select
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
    filters = []
    if user_id is not None:
        filters.append(WasteReport.user_id == user_id)
    start = _boundary(start_date)
    end = _boundary(end_date, end=True)
    if start is not None:
        filters.append(WasteReport.created_at >= start)
    if end is not None:
        filters.append(WasteReport.created_at <= end)

    totals = await session.execute(
        select(
            func.coalesce(func.sum(WasteReport.quantity_kg), 0),
            func.count(WasteReport.id),
            func.coalesce(
                func.sum(
                    case((WasteCategory.recyclable.is_(True), WasteReport.quantity_kg), else_=0)
                ),
                0,
            ),
        )
        .join(WasteCategory, WasteReport.category_id == WasteCategory.id)
        .where(*filters)
    )
    total, report_count, recyclable = totals.one()
    categories = await session.execute(
        select(WasteCategory.name, func.sum(WasteReport.quantity_kg))
        .join(WasteCategory, WasteReport.category_id == WasteCategory.id)
        .where(*filters)
        .group_by(WasteCategory.name)
        .order_by(WasteCategory.name)
    )
    return DashboardSummary(
        total_quantity_kg=round(float(total), 2),
        report_count=int(report_count),
        recyclable_percentage=round((float(recyclable) / float(total)) * 100, 2) if total else 0,
        categories=[
            CategoryTotal(category=name, quantity_kg=round(float(value), 2))
            for name, value in categories.all()
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
