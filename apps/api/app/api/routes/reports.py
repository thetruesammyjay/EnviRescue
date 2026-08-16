from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query

from app.api.dependencies import CurrentUser, DatabaseSession
from app.schemas.report import WasteActivityReport
from app.services.report_service import build_activity_report

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=WasteActivityReport)
async def activity_report(
    session: DatabaseSession,
    user: CurrentUser,
    start_date: Annotated[date | None, Query()] = None,
    end_date: Annotated[date | None, Query()] = None,
) -> WasteActivityReport:
    return await build_activity_report(session, user.id, start_date, end_date)
