"""SQS consumer entrypoint and pipeline dispatcher."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from worker.handlers.export_word_handler import ExportWordHandler
from worker.handlers.extract_handler import ExtractionHandler
from worker.handlers.ingest_handler import IngestHandler
from worker.handlers.map_handler import MappingHandler
from worker.handlers.ocr_handler import OcrHandler
from worker.handlers.validate_handler import ValidationHandler


@dataclass
class PipelineDispatcher:
    """Routes queue messages to stage handlers."""

    ingest: IngestHandler
    ocr: OcrHandler
    extraction: ExtractionHandler
    mapping: MappingHandler
    validation: ValidationHandler
    export_word: ExportWordHandler

    def dispatch(self, envelope: dict[str, Any]) -> None:
        """Handle a versioned pipeline envelope."""

        ...


def run_consumer() -> None:
    """Long-poll SQS and process messages."""

    ...


if __name__ == "__main__":
    run_consumer()
