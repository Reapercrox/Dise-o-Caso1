"""Submit job command."""

from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, Field


class SubmitJobCommand(BaseModel):
    """Input for `POST /v1/jobs/{job_id}/submit`."""

    job_id: UUID = Field(..., description="Job identifier")
