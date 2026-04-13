"""SQS publisher (boto3)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from domain.common.ports import ISqsPublisher


@dataclass
class SqsPublisher:
    """Publishes JSON envelopes to the pipeline queue."""

    queue_url: str

    def publish_pipeline_start(self, envelope: dict[str, Any]) -> None:
        ...
