"""Persistence abstraction for `Job`."""

from __future__ import annotations

from typing import Protocol

from domain.common.ids import JobId, UserId
from domain.jobs.job import Job


class IJobRepository(Protocol):
    """Repository port for the `Job` aggregate."""

    def save(self, job: Job) -> None:
        """Persist or update a job."""

    def get_by_id(self, job_id: JobId, owner: UserId) -> Job | None:
        """Return the job if owned by `owner`, else None."""
