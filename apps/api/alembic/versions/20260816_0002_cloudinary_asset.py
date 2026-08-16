"""Store the Cloudinary public ID for uploaded waste images."""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "20260816_0002"
down_revision: str | None = "20260813_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "waste_reports", sa.Column("image_public_id", sa.String(length=512), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("waste_reports", "image_public_id")
