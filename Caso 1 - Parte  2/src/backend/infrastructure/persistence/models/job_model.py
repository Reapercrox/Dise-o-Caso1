"""SQLAlchemy ORM model: jobs."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, String
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Declarative base."""

    pass


class JobModel(Base):
    """Persistence model for `Job`."""

    __tablename__ = "jobs"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
    owner_sub: Mapped[str] = mapped_column(String(128), index=True)
    template_id: Mapped[str] = mapped_column(String(256))
    status: Mapped[str] = mapped_column(String(64))
    current_stage: Mapped[str | None] = mapped_column(String(64), nullable=True)
    s3_output_key: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    metadata_json: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
