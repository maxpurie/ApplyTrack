"""Add application pipeline fields

Revision ID: c4e1a7d9b2f0
Revises: fe56fa70289e
Create Date: 2026-09-12
"""

from alembic import op
import sqlalchemy as sa

revision = "c4e1a7d9b2f0"
down_revision = "fe56fa70289e"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "item", sa.Column("status", sa.String(length=40), nullable=False, server_default="Saved")
    )
    op.add_column("item", sa.Column("job_url", sa.String(length=500), nullable=True))
    op.add_column("item", sa.Column("applied_date", sa.Date(), nullable=True))


def downgrade():
    op.drop_column("item", "applied_date")
    op.drop_column("item", "job_url")
    op.drop_column("item", "status")
