"""Domain value objects for DUA fields, evidence, and issues."""

from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum


class ConfidenceLevel(StrEnum):
    """Traffic-light bucket for UI."""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


@dataclass(frozen=True, slots=True)
class ConfidenceScore:
    """Numeric confidence in ``[0.0, 1.0]``."""

    value: float


@dataclass(frozen=True, slots=True)
class SourceReference:
    """Traceability: file, page, snippet."""

    file_name: str
    page: int | None
    snippet: str


@dataclass(slots=True)
class DuaField:
    """A single mapped DUA field with evidence."""

    key: str
    value: str | None
    confidence: ConfidenceScore
    level: ConfidenceLevel
    source: SourceReference | None


@dataclass(slots=True)
class Issue:
    """Validation or coherence issue surfaced to the review UI."""

    code: str
    message: str
    severity: str
    field_key: str | None
