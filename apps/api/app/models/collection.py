import uuid
from datetime import datetime
from enum import StrEnum

from sqlalchemy import DateTime, Enum, ForeignKey, Index, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class CollectionStatus(StrEnum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class CollectionZone(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "collection_zones"

    name: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    region: Mapped[str] = mapped_column(String(120), index=True)

    schedules = relationship(
        "CollectionSchedule", back_populates="zone", cascade="all, delete-orphan"
    )


class CollectionSchedule(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "collection_schedules"
    __table_args__ = (Index("ix_collection_zone_date", "zone_id", "collection_date"),)

    zone_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("collection_zones.id", ondelete="CASCADE"), index=True
    )
    collection_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    status: Mapped[CollectionStatus] = mapped_column(
        Enum(CollectionStatus), default=CollectionStatus.SCHEDULED, index=True
    )

    zone = relationship("CollectionZone", back_populates="schedules")
