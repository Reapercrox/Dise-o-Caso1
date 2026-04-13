"""Ingestion stage — download from S3, detect MIME, normalize."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class IngestHandler:
    """Pipeline stage: ingestion."""

    def handle(self, job_id: str, s3_keys: list[str]) -> None:
        ...
