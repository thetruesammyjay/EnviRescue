from fastapi import APIRouter

from app.api.dependencies import CurrentUser
from app.schemas.report import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def summary(_: CurrentUser) -> DashboardSummary:
    # Replace with aggregate queries in report_service.py.
    return DashboardSummary()
