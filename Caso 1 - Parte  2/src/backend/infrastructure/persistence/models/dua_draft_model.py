"""SQLAlchemy ORM model: dua_drafts."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from infrastructure.persistence.models.job_model import Base


class DuaDraftModel(Base):
    """Persistence model for `DuaDraft` (denormalized JSON + metadata)."""

    __tablename__ = "dua_drafts"

    job_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
    payload: Mapped[dict] = mapped_column(JSONB, default=dict)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
