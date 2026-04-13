"""Job aggregate and status transitions."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import StrEnum
from typing import Any
from uuid import UUID

from domain.common.ids import JobId, UserId


class JobStatus(StrEnum):
    """High-level job lifecycle states."""

    PENDING = "PENDING"
    QUEUED = "QUEUED"
    INGESTING = "INGESTING"
    VALIDATED = "VALIDATED"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class PipelineStage(StrEnum):
    """Stages surfaced to the frontend progress UI."""

    INGESTION = "ingestion"
    OCR = "ocr"
    EXTRACTION = "extraction"
    MAPPING = "mapping"
    VALIDATION = "validation"
    EXPORT = "export"


@dataclass
class Job:
    """Aggregate root for asynchronous DUA processing."""

    id: JobId
    owner: UserId
    template_id: str
    status: JobStatus
    current_stage: PipelineStage | None
    s3_output_key: str | None
    created_at: datetime
    updated_at: datetime
    metadata: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def create(cls, *, id: UUID, owner: UserId, template_id: str) -> Job:
        """Factory for a new job in `PENDING` state."""

        ...

    def to_dto(self, *, upload_urls: list[str]) -> Any:
        """Serialize API response DTO including upload URLs."""

        ...
