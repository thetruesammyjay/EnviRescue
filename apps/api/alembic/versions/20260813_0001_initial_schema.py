"""Create the core EnviRescue schema."""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "20260813_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

user_role = postgresql.ENUM("USER", "ADMIN", name="userrole", create_type=False)
collection_status = postgresql.ENUM(
    "SCHEDULED", "COMPLETED", "CANCELLED", name="collectionstatus", create_type=False
)


def timestamp_columns() -> list[sa.Column]:
    return [
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
    ]


def upgrade() -> None:
    user_role.create(op.get_bind(), checkfirst=True)
    collection_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("full_name", sa.String(120), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", user_role, nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        *timestamp_columns(),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_role", "users", ["role"])

    op.create_table(
        "waste_categories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(80), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("recyclable", sa.Boolean(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        *timestamp_columns(),
    )
    op.create_index("ix_waste_categories_name", "waste_categories", ["name"], unique=True)

    op.create_table(
        "collection_zones",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("region", sa.String(120), nullable=False),
        *timestamp_columns(),
    )
    op.create_index("ix_collection_zones_name", "collection_zones", ["name"], unique=True)
    op.create_index("ix_collection_zones_region", "collection_zones", ["region"])

    op.create_table(
        "recycling_tips",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "category_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("waste_categories.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("guidance", sa.Text(), nullable=False),
        *timestamp_columns(),
    )
    op.create_index("ix_recycling_tips_category_id", "recycling_tips", ["category_id"])

    op.create_table(
        "waste_reports",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "category_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("waste_categories.id"),
            nullable=False,
        ),
        sa.Column("quantity_kg", sa.Numeric(10, 2), nullable=False),
        sa.Column("location", sa.String(255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("image_url", sa.String(2048)),
        *timestamp_columns(),
    )
    op.create_index("ix_waste_reports_user_id", "waste_reports", ["user_id"])
    op.create_index("ix_waste_reports_category_id", "waste_reports", ["category_id"])
    op.create_index("ix_waste_reports_location", "waste_reports", ["location"])
    op.create_index("ix_waste_reports_user_created", "waste_reports", ["user_id", "created_at"])

    op.create_table(
        "classifications",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "waste_report_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("waste_reports.id", ondelete="CASCADE"),
            nullable=False,
            unique=True,
        ),
        sa.Column("predicted_category", sa.String(80), nullable=False),
        sa.Column("confidence", sa.Numeric(5, 4), nullable=False),
        sa.Column("model_name", sa.String(255)),
        sa.Column("requires_review", sa.Boolean(), nullable=False),
        sa.Column("manually_corrected", sa.Boolean(), nullable=False),
        *timestamp_columns(),
    )
    op.create_index(
        "ix_classifications_predicted_category", "classifications", ["predicted_category"]
    )
    op.create_index("ix_classifications_requires_review", "classifications", ["requires_review"])

    op.create_table(
        "collection_schedules",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "zone_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("collection_zones.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("collection_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("status", collection_status, nullable=False),
        *timestamp_columns(),
    )
    op.create_index("ix_collection_schedules_zone_id", "collection_schedules", ["zone_id"])
    op.create_index(
        "ix_collection_schedules_collection_date", "collection_schedules", ["collection_date"]
    )
    op.create_index("ix_collection_schedules_status", "collection_schedules", ["status"])
    op.create_index(
        "ix_collection_zone_date", "collection_schedules", ["zone_id", "collection_date"]
    )


def downgrade() -> None:
    op.drop_table("collection_schedules")
    op.drop_table("classifications")
    op.drop_table("waste_reports")
    op.drop_table("recycling_tips")
    op.drop_table("collection_zones")
    op.drop_table("waste_categories")
    op.drop_table("users")
    collection_status.drop(op.get_bind(), checkfirst=True)
    user_role.drop(op.get_bind(), checkfirst=True)
