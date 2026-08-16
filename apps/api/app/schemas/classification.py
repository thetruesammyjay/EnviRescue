import uuid

from pydantic import BaseModel, Field


class ClassificationResult(BaseModel):
    waste_report_id: uuid.UUID | None = None
    category: str | None = None
    detected_type: str | None = None
    classification_group: str | None = None
    confidence: float | None = Field(default=None, ge=0, le=1)
    requires_review: bool
    model_name: str | None = None
    status: str = "pending"
    source: str = "ai"
    error_message: str | None = None


class ClassificationCorrection(BaseModel):
    category_id: uuid.UUID
    reason: str | None = Field(default=None, max_length=500)
