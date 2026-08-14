import uuid

from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class WasteCategory(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "waste_categories"

    name: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    recyclable: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    reports = relationship("WasteReport", back_populates="category")
    tips = relationship("RecyclingTip", back_populates="category", cascade="all, delete-orphan")


class RecyclingTip(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "recycling_tips"

    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("waste_categories.id", ondelete="CASCADE"), index=True
    )
    guidance: Mapped[str] = mapped_column(Text)

    category = relationship("WasteCategory", back_populates="tips")
