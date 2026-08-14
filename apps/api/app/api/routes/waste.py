import uuid
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import delete, select

from app.api.dependencies import CurrentUser, DatabaseSession
from app.models.waste_report import WasteReport
from app.schemas.common import Message
from app.schemas.waste import WasteReportCreate, WasteReportPage, WasteReportRead, WasteReportUpdate
from app.services.waste_service import create_report, list_reports
from app.utils.pagination import pagination_offset

router = APIRouter(prefix="/waste", tags=["waste reports"])


@router.post("", response_model=WasteReportRead, status_code=status.HTTP_201_CREATED)
async def create(
    payload: WasteReportCreate, session: DatabaseSession, user: CurrentUser
) -> WasteReportRead:
    return WasteReportRead.model_validate(await create_report(session, user.id, payload))


@router.get("", response_model=WasteReportPage)
async def list_user_reports(
    session: DatabaseSession,
    user: CurrentUser,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> WasteReportPage:
    items, total = await list_reports(
        session, user.id, pagination_offset(page, page_size), page_size
    )
    return WasteReportPage(items=items, page=page, page_size=page_size, total=total)


async def owned_report(
    session: DatabaseSession, user: CurrentUser, report_id: uuid.UUID
) -> WasteReport:
    report = await session.scalar(
        select(WasteReport).where(WasteReport.id == report_id, WasteReport.user_id == user.id)
    )
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Waste report not found.")
    return report


@router.get("/{report_id}", response_model=WasteReportRead)
async def get_report(
    report_id: uuid.UUID, session: DatabaseSession, user: CurrentUser
) -> WasteReportRead:
    return WasteReportRead.model_validate(await owned_report(session, user, report_id))


@router.patch("/{report_id}", response_model=WasteReportRead)
async def update_report(
    report_id: uuid.UUID, payload: WasteReportUpdate, session: DatabaseSession, user: CurrentUser
) -> WasteReportRead:
    report = await owned_report(session, user, report_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(report, field, value)
    await session.commit()
    await session.refresh(report)
    return WasteReportRead.model_validate(report)


@router.delete("/{report_id}", response_model=Message)
async def delete_report(
    report_id: uuid.UUID, session: DatabaseSession, user: CurrentUser
) -> Message:
    await owned_report(session, user, report_id)
    await session.execute(delete(WasteReport).where(WasteReport.id == report_id))
    await session.commit()
    return Message(message="Waste report deleted.")
