import uuid
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import delete, select

from app.api.dependencies import CurrentUser, DatabaseSession
from app.models.waste_report import WasteReport
from app.schemas.common import Message
from app.schemas.waste import WasteReportCreate, WasteReportPage, WasteReportRead, WasteReportUpdate
from app.services.waste_service import create_report, list_reports
from app.storage.images import image_storage
from app.utils.pagination import pagination_offset

router = APIRouter(prefix="/waste", tags=["waste reports"])


@router.post("", response_model=WasteReportRead, status_code=status.HTTP_201_CREATED)
async def create(
    payload: WasteReportCreate, session: DatabaseSession, user: CurrentUser
) -> WasteReportRead:
    try:
        report = await create_report(session, user.id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return WasteReportRead.model_validate(report)


@router.post("/with-image", response_model=WasteReportRead, status_code=status.HTTP_201_CREATED)
async def create_with_image(
    session: DatabaseSession,
    user: CurrentUser,
    category_id: Annotated[uuid.UUID, Form(...)],
    quantity_kg: Annotated[float, Form(gt=0)],
    location: Annotated[str, Form(...)],
    image: Annotated[UploadFile, File(...)],
    description: Annotated[str | None, Form()] = None,
) -> WasteReportRead:
    content = await image.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Image is too large."
        )
    try:
        extension = (
            image.filename.rsplit(".", 1)[-1] if image.filename and "." in image.filename else "jpg"
        )
        image_url = image_storage.save(content, extension)
        report = await create_report(
            session,
            user.id,
            WasteReportCreate(
                category_id=category_id,
                quantity_kg=quantity_kg,
                location=location,
                description=description,
                image_url=image_url,
            ),
        )
    except (ValueError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from exc
    return WasteReportRead.model_validate(report)


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
