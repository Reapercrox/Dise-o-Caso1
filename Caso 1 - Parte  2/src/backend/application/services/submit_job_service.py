"""Submit job use case — verify S3 objects and enqueue pipeline."""

from __future__ import annotations

from dataclasses import dataclass

from application.commands.submit_job import SubmitJobCommand
from domain.common.ids import UserId
from domain.common.ports import IS3Storage, ISqsPublisher
from domain.jobs.repositories import IJobRepository


@dataclass
class SubmitJobService:
    """Verifies uploads exist, updates status, publishes SQS message."""

    jobs: IJobRepository
    storage: IS3Storage
    sqs: ISqsPublisher

    def execute(self, cmd: SubmitJobCommand, *, user_id: str) -> dict:
        """Return acceptance payload for `202 Accepted`."""

        _ = (cmd, user_id)
        return {}
