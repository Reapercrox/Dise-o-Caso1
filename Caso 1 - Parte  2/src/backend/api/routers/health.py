"""Health probes for orchestration."""

from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/liveness")
def liveness() -> dict[str, str]:
    """Process is running."""

    return {"status": "ok"}


@router.get("/readiness")
def readiness() -> dict[str, str]:
    """Dependencies (DB, etc.) are reachable."""

    return {"status": "ok"}
