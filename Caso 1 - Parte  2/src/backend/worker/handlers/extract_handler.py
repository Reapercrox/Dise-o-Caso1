"""Semantic extraction stage."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ExtractionHandler:
    """Pipeline stage: entity / field extraction."""

    def handle(self, job_id: str) -> None:
        ...
