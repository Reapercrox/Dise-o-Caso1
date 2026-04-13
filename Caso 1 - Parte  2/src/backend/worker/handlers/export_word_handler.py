"""Word export stage — .docx from template."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ExportWordHandler:
    """Pipeline stage: generate DUA Word artifact."""

    def handle(self, job_id: str) -> None:
        ...
