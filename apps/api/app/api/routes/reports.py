from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query

from app.api.dependencies import CurrentUser
from app.schemas.report import WasteActivityReport

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=WasteActivityReport)
async def activity_report(
    _: CurrentUser,
    start_date: Annotated[date | None, Query()] = None,
    end_date: Annotated[date | None, Query()] = None,
) -> WasteActivityReport:
    # Replace with aggregate queries in report_service.py.
    return WasteActivityReport(start_date=start_date, end_date=end_date)
