"""Strongly typed identifiers."""

from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID


@dataclass(frozen=True, slots=True)
class UserId:
    """Internal user identifier (from Cognito `sub`)."""

    value: str


@dataclass(frozen=True, slots=True)
class JobId:
    """Job aggregate identifier."""

    value: UUID
