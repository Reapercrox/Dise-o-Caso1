"""Create job command."""

from __future__ import annotations

from pydantic import BaseModel, Field


class FileDescriptor(BaseModel):
    """Declared file to upload."""

    name: str = Field(..., min_length=1)
    size: int = Field(..., ge=0)


class CreateJobCommand(BaseModel):
    """Input for `POST /v1/jobs`."""

    files: list[FileDescriptor]
    template_id: str = Field(..., min_length=1)
