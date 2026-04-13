"""SQLAlchemy implementation of `IDuaDraftRepository`."""

from __future__ import annotations

from dataclasses import dataclass

from domain.common.ids import JobId
from domain.dua.dua_draft import DuaDraft
from domain.dua.repositories import IDuaDraftRepository


@dataclass
class SqlDuaDraftRepository:
    """Maps `DuaDraft` to ORM models."""

    def save(self, draft: DuaDraft) -> None:
        ...

    def get_by_job_id(self, job_id: JobId) -> DuaDraft | None:
        ...
