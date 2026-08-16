"""Add composite indexes for report and classification queries."""

from collections.abc import Sequence

from alembic import op

revision: str = "20260816_0004"
down_revision: str | None = "20260816_0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_index(
        "ix_waste_reports_user_category_created",
        "waste_reports",
        ["user_id", "category_id", "created_at"],
    )
    op.create_index(
        "ix_classifications_review_queue",
        "classifications",
        ["requires_review", "created_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_classifications_review_queue", table_name="classifications")
    op.drop_index("ix_waste_reports_user_category_created", table_name="waste_reports")
