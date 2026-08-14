import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class WasteReportCreate(BaseModel):
    category_id: uuid.UUID
    quantity_kg: Decimal = Field(gt=0, decimal_places=2)
    location: str = Field(min_length=2, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    image_url: str | None = Field(default=None, max_length=2048)


class WasteReportUpdate(BaseModel):
    category_id: uuid.UUID | None = None
    quantity_kg: Decimal | None = Field(default=None, gt=0, decimal_places=2)
    location: str | None = Field(default=None, min_length=2, max_length=255)
    description: str | None = Field(default=None, max_length=2000)


class WasteReportRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    category_id: uuid.UUID
    quantity_kg: Decimal
    location: str
    description: str | None
    image_url: str | None
    created_at: datetime


class WasteReportPage(BaseModel):
    items: list[WasteReportRead]
    page: int
    page_size: int
    total: int
