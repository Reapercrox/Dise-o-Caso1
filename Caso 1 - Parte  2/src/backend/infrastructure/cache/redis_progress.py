"""Redis-backed progress store for SSE."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class RedisProgressStore:
    """Key `progress:{job_id}` JSON blobs."""

    redis_url: str

    def read(self, job_id: str) -> dict[str, Any] | None:
        ...

    def write(self, job_id: str, payload: dict[str, Any]) -> None:
        ...
