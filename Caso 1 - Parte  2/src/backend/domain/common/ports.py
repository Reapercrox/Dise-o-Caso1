"""Outbound ports (interfaces) for infrastructure adapters."""

from __future__ import annotations

from typing import Any, Protocol


class ISqsPublisher(Protocol):
    """Publishes versioned pipeline messages to Amazon SQS."""

    def publish_pipeline_start(self, envelope: dict[str, Any]) -> None:
        """Enqueue a `PIPELINE_START` message for the worker."""


class IS3Storage(Protocol):
    """Object storage operations (uploads, head, pre-signed URLs)."""

    def generate_presigned_put(
        self,
        *,
        key: str,
        size: int,
        ttl_seconds: int,
    ) -> str:
        """Return a pre-signed PUT URL for direct client upload."""

    def head_object_exists(self, key: str) -> bool:
        """Return True if the object exists in the uploads bucket."""

    def generate_presigned_get(self, *, key: str, ttl_seconds: int) -> str:
        """Return a pre-signed GET URL for downloading an artifact."""
