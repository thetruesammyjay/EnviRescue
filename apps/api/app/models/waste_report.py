import uuid
from decimal import Decimal

from sqlalchemy import ForeignKey, Index, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class WasteReport(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "waste_reports"
    __table_args__ = (
        Index("ix_waste_reports_user_created", "user_id", "created_at"),
        Index("ix_waste_reports_user_category_created", "user_id", "category_id", "created_at"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("waste_categories.id"), index=True
    )
    quantity_kg: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    location: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(2048))
    image_public_id: Mapped[str | None] = mapped_column(String(512))

    user = relationship("User", back_populates="waste_reports")
    category = relationship("WasteCategory", back_populates="reports")
    classification = relationship(
        "Classification", back_populates="waste_report", cascade="all, delete-orphan", uselist=False
    )
