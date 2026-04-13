"""Validation stage — business rules and issues."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ValidationHandler:
    """Pipeline stage: validation."""

    def handle(self, job_id: str) -> None:
        ...
