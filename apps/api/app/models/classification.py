import uuid
from decimal import Decimal

from sqlalchemy import Boolean, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Classification(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "classifications"

    waste_report_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("waste_reports.id", ondelete="CASCADE"), unique=True
    )
    predicted_category: Mapped[str] = mapped_column(String(80), index=True)
    confidence: Mapped[Decimal] = mapped_column(Numeric(5, 4))
    model_name: Mapped[str | None] = mapped_column(String(255))
    requires_review: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    manually_corrected: Mapped[bool] = mapped_column(Boolean, default=False)

    waste_report = relationship("WasteReport", back_populates="classification")
