"""Artifact download use case."""

from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID

from domain.common.ids import UserId
from domain.common.ports import IS3Storage
from domain.jobs.repositories import IJobRepository


@dataclass
class DownloadArtifactService:
    """Issues a pre-signed GET URL for the generated `.docx`."""

    jobs: IJobRepository
    storage: IS3Storage

    def execute(self, *, job_id: UUID, user_id: str) -> dict:
        """Return `{ download_url, expires_at }`."""

        _ = (job_id, user_id)
        return {}
