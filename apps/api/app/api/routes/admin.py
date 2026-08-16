import uuid
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, select

from app.api.dependencies import CurrentAdmin, DatabaseSession
from app.core.cache import cache
from app.models.category import RecyclingTip, WasteCategory
from app.models.classification import Classification
from app.models.collection import CollectionSchedule, CollectionZone
from app.models.user import User
from app.schemas.collection import (
    CollectionScheduleCreate,
    CollectionScheduleRead,
    CollectionScheduleUpdate,
    CollectionZoneCreate,
    CollectionZoneRead,
)
from app.schemas.common import Message
from app.schemas.recycling import (
    CategoryCreate,
    CategoryRead,
    CategoryUpdate,
    RecyclingTipCreate,
    RecyclingTipRead,
)
from app.schemas.user import UserPage, UserRead, UserRoleUpdate

router = APIRouter(prefix="/admin", tags=["administration"])


@router.get("/status", response_model=Message)
async def admin_status(_: CurrentAdmin) -> Message:
    return Message(message="Administrator access confirmed.")


@router.get("/users", response_model=UserPage)
async def list_users(
    session: DatabaseSession,
    _: CurrentAdmin,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> UserPage:
    total = await session.scalar(select(func.count()).select_from(User)) or 0
    items = list(
        (
            await session.scalars(
                select(User)
                .order_by(User.created_at.desc())
                .offset((page - 1) * page_size)
                .limit(page_size)
            )
        ).all()
    )
    return UserPage(items=items, page=page, page_size=page_size, total=total)


@router.patch("/users/{user_id}", response_model=UserRead)
async def update_user(
    user_id: uuid.UUID, payload: UserRoleUpdate, session: DatabaseSession, _: CurrentAdmin
) -> UserRead:
    user = await session.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    await session.commit()
    await session.refresh(user)
    return UserRead.model_validate(user)


@router.post("/categories", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate, session: DatabaseSession, _: CurrentAdmin
) -> CategoryRead:
    category = WasteCategory(**payload.model_dump())
    session.add(category)
    await session.commit()
    await session.refresh(category)
    cache.delete("categories:all")
    return CategoryRead.model_validate(category)


@router.patch("/categories/{category_id}", response_model=CategoryRead)
async def update_category(
    category_id: uuid.UUID, payload: CategoryUpdate, session: DatabaseSession, _: CurrentAdmin
) -> CategoryRead:
    category = await session.get(WasteCategory, category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found.")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    await session.commit()
    await session.refresh(category)
    cache.delete("categories:all")
    return CategoryRead.model_validate(category)


@router.delete("/categories/{category_id}", response_model=Message)
async def deactivate_category(
    category_id: uuid.UUID, session: DatabaseSession, _: CurrentAdmin
) -> Message:
    category = await session.get(WasteCategory, category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found.")
    category.is_active = False
    await session.commit()
    cache.delete("categories:all")
    return Message(message="Category deactivated.")


@router.post(
    "/recycling-tips", response_model=RecyclingTipRead, status_code=status.HTTP_201_CREATED
)
async def create_tip(
    payload: RecyclingTipCreate, session: DatabaseSession, _: CurrentAdmin
) -> RecyclingTipRead:
    if await session.get(WasteCategory, payload.category_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found.")
    tip = RecyclingTip(**payload.model_dump())
    session.add(tip)
    await session.commit()
    await session.refresh(tip)
    cache.delete("recycling:all")
    return RecyclingTipRead.model_validate(tip)


@router.delete("/recycling-tips/{tip_id}", response_model=Message)
async def delete_tip(tip_id: uuid.UUID, session: DatabaseSession, _: CurrentAdmin) -> Message:
    tip = await session.get(RecyclingTip, tip_id)
    if tip is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tip not found.")
    await session.delete(tip)
    await session.commit()
    cache.delete("recycling:all")
    return Message(message="Recycling tip deleted.")


@router.post(
    "/collections/zones", response_model=CollectionZoneRead, status_code=status.HTTP_201_CREATED
)
async def create_zone(
    payload: CollectionZoneCreate, session: DatabaseSession, _: CurrentAdmin
) -> CollectionZoneRead:
    zone = CollectionZone(**payload.model_dump())
    session.add(zone)
    await session.commit()
    await session.refresh(zone)
    return CollectionZoneRead.model_validate(zone)


@router.post(
    "/collections/schedules",
    response_model=CollectionScheduleRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_schedule(
    payload: CollectionScheduleCreate, session: DatabaseSession, _: CurrentAdmin
) -> CollectionScheduleRead:
    if await session.get(CollectionZone, payload.zone_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Collection zone not found."
        )
    schedule = CollectionSchedule(**payload.model_dump())
    session.add(schedule)
    await session.commit()
    await session.refresh(schedule)
    return CollectionScheduleRead.model_validate(schedule)


@router.patch("/collections/schedules/{schedule_id}", response_model=CollectionScheduleRead)
async def update_schedule(
    schedule_id: uuid.UUID,
    payload: CollectionScheduleUpdate,
    session: DatabaseSession,
    _: CurrentAdmin,
) -> CollectionScheduleRead:
    schedule = await session.get(CollectionSchedule, schedule_id)
    if schedule is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found.")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(schedule, field, value)
    await session.commit()
    await session.refresh(schedule)
    return CollectionScheduleRead.model_validate(schedule)


@router.get("/classifications/review")
async def classifications_for_review(
    session: DatabaseSession, _: CurrentAdmin
) -> list[dict[str, object]]:
    rows = (
        await session.scalars(
            select(Classification)
            .where(Classification.requires_review)
            .order_by(Classification.created_at)
        )
    ).all()
    return [
        {
            "id": str(item.id),
            "waste_report_id": str(item.waste_report_id),
            "predicted_category": item.predicted_category,
            "confidence": float(item.confidence),
        }
        for item in rows
    ]
