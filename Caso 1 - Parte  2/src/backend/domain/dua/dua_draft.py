"""DuaDraft aggregate."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from domain.common.ids import JobId
from domain.dua.value_objects import DuaField, Issue


@dataclass
class DuaDraft:
    """Canonical DUA structure produced by mapping + review."""

    job_id: JobId
    fields: list[DuaField]
    issues: list[Issue]
    raw_metadata: dict[str, Any] = field(default_factory=dict)
    updated_at: datetime | None = None
