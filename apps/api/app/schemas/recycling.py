import uuid

from pydantic import BaseModel, ConfigDict


class CategoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: str | None
    recyclable: bool


class RecyclingTipRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    category_id: uuid.UUID
    guidance: str


class RecyclingTipCreate(BaseModel):
    category_id: uuid.UUID
    guidance: str
