"""SQLAlchemy implementation of `IJobRepository`."""

from __future__ import annotations

from dataclasses import dataclass

from domain.common.ids import JobId, UserId
from domain.jobs.job import Job
from domain.jobs.repositories import IJobRepository


@dataclass
class SqlJobRepository:
    """Maps `Job` aggregate to `JobModel`."""

    def save(self, job: Job) -> None:
        ...

    def get_by_id(self, job_id: JobId, owner: UserId) -> Job | None:
        ...
