"""Job status query."""

from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, Field


class GetJobStatusQuery(BaseModel):
    """Input for `GET /v1/jobs/{job_id}`."""

    job_id: UUID = Field(...)
