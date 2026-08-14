import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.collection import CollectionStatus


class CollectionZoneRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    region: str


class CollectionScheduleCreate(BaseModel):
    zone_id: uuid.UUID
    collection_date: datetime


class CollectionScheduleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    zone_id: uuid.UUID
    collection_date: datetime
    status: CollectionStatus
