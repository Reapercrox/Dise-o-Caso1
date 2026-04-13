"""OCR stage — Textract / Tesseract."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class OcrHandler:
    """Pipeline stage: OCR for scanned content."""

    def handle(self, job_id: str, document_id: str) -> None:
        ...
