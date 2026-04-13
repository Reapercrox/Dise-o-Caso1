"""Create job use case."""

from __future__ import annotations

from dataclasses import dataclass

from application.commands.create_job import CreateJobCommand
from domain.common.ids import UserId
from domain.common.ports import IS3Storage
from domain.jobs.repositories import IJobRepository


@dataclass
class CreateJobService:
    """Creates a job row and returns pre-signed upload URLs."""

    jobs: IJobRepository
    storage: IS3Storage

    def execute(self, cmd: CreateJobCommand, *, user_id: str) -> dict:
        """Persist job and return `{ job_id, upload_urls, status }`."""

        _ = (cmd, user_id)
        return {}
