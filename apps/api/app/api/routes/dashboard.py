from fastapi import APIRouter

from app.api.dependencies import CurrentUser, DatabaseSession
from app.schemas.report import DashboardSummary
from app.services.report_service import build_summary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def summary(session: DatabaseSession, user: CurrentUser) -> DashboardSummary:
    return await build_summary(session, user.id)
