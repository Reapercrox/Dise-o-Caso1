"""Persistence abstraction for `DuaDraft`."""

from __future__ import annotations

from typing import Protocol

from domain.common.ids import JobId
from domain.dua.dua_draft import DuaDraft


class IDuaDraftRepository(Protocol):
    """Repository port for `DuaDraft`."""

    def save(self, draft: DuaDraft) -> None:
        """Persist draft state."""

    def get_by_job_id(self, job_id: JobId) -> DuaDraft | None:
        """Load draft for a job."""
