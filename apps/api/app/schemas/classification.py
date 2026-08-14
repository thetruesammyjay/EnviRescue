import uuid

from pydantic import BaseModel, Field


class ClassificationResult(BaseModel):
    category: str
    confidence: float = Field(ge=0, le=1)
    requires_review: bool
    model_name: str | None = None


class ClassificationCorrection(BaseModel):
    category_id: uuid.UUID
    reason: str | None = Field(default=None, max_length=500)
