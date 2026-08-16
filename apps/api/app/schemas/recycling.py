import uuid

from pydantic import BaseModel, ConfigDict


class CategoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: str | None
    recyclable: bool


class CategoryCreate(BaseModel):
    name: str
    description: str | None = None
    recyclable: bool = False


class CategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    recyclable: bool | None = None
    is_active: bool | None = None


class RecyclingTipRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    category_id: uuid.UUID
    guidance: str


class RecyclingTipCreate(BaseModel):
    category_id: uuid.UUID
    guidance: str
