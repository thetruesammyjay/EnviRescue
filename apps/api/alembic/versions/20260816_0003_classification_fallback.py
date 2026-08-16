"""Track classification source, status, and recoverable classifier errors."""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "20260816_0003"
down_revision: str | None = "20260816_0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column("classifications", "predicted_category", nullable=True)
    op.alter_column("classifications", "confidence", nullable=True)
    op.add_column(
        "classifications",
        sa.Column(
            "classification_status", sa.String(length=32), server_default="pending", nullable=False
        ),
    )
    op.add_column(
        "classifications",
        sa.Column(
            "classification_source", sa.String(length=16), server_default="ai", nullable=False
        ),
    )
    op.add_column(
        "classifications", sa.Column("error_message", sa.String(length=1000), nullable=True)
    )
    op.create_index("ix_classifications_status", "classifications", ["classification_status"])
    op.create_index("ix_classifications_source", "classifications", ["classification_source"])


def downgrade() -> None:
    op.drop_index("ix_classifications_source", table_name="classifications")
    op.drop_index("ix_classifications_status", table_name="classifications")
    op.drop_column("classifications", "error_message")
    op.drop_column("classifications", "classification_source")
    op.drop_column("classifications", "classification_status")
    op.alter_column("classifications", "confidence", nullable=False)
    op.alter_column("classifications", "predicted_category", nullable=False)
