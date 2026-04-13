"""Mapping stage — entities to canonical DUA."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class MappingHandler:
    """Pipeline stage: mapping."""

    def handle(self, job_id: str) -> None:
        ...
