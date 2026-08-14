from datetime import UTC, datetime

from fastapi import APIRouter
from sqlalchemy import select

from app.api.dependencies import DatabaseSession
from app.models.collection import CollectionSchedule, CollectionZone
from app.schemas.collection import CollectionScheduleRead, CollectionZoneRead

router = APIRouter(prefix="/collections", tags=["collections"])


@router.get("/zones", response_model=list[CollectionZoneRead])
async def zones(session: DatabaseSession) -> list[CollectionZone]:
    return list((await session.scalars(select(CollectionZone).order_by(CollectionZone.name))).all())


@router.get("/upcoming", response_model=list[CollectionScheduleRead])
async def upcoming(session: DatabaseSession) -> list[CollectionSchedule]:
    query = (
        select(CollectionSchedule)
        .where(CollectionSchedule.collection_date >= datetime.now(UTC))
        .order_by(CollectionSchedule.collection_date)
    )
    return list((await session.scalars(query)).all())
