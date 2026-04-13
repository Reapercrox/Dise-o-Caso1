"""FastAPI application entrypoint."""

from __future__ import annotations

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI

from api.routers import dua, health, jobs


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Startup/shutdown hooks (DB engine, JWKS cache, etc.)."""

    yield


def create_app() -> FastAPI:
    """Application factory."""

    app = FastAPI(title="DUA Streamliner API", lifespan=lifespan)
    app.include_router(health.router)
    app.include_router(jobs.router)
    app.include_router(dua.router)
    return app


app = create_app()
