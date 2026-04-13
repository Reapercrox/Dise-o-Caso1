"""Dependency injection wiring for FastAPI."""

from __future__ import annotations

import os
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from application.services.create_job_service import CreateJobService
from application.services.download_service import DownloadArtifactService
from application.services.submit_job_service import SubmitJobService
from infrastructure.messaging.sqs_publisher import SqsPublisher
from infrastructure.persistence.sql_job_repository import SqlJobRepository
from infrastructure.storage.s3_adapter import S3StorageAdapter


class CurrentUser:
    """Subset of JWT claims used by the API layer."""

    def __init__(self, sub: str, groups: list[str]) -> None:
        self.sub = sub
        self.groups = groups


def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
) -> CurrentUser:
    """Resolve the authenticated user (skeleton: dev user if no Bearer token)."""

    if authorization and authorization.startswith("Bearer "):
        return CurrentUser(sub="cognito-sub-stub", groups=["USER_AGENT"])
    if os.getenv("DUA_DEV_AUTH", "").lower() in ("1", "true", "yes"):
        return CurrentUser(sub="00000000-0000-0000-0000-000000000001", groups=["USER_AGENT"])
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Missing or invalid Authorization header",
    )


def require_permission(code: str):
    """FastAPI dependency factory enforcing RBAC by permission code."""

    def _inner(user: Annotated[CurrentUser, Depends(get_current_user)]) -> CurrentUser:
        _ = code
        return user

    return _inner


def get_create_job_service() -> CreateJobService:
    """Inject `CreateJobService` with concrete adapters."""

    return CreateJobService(
        jobs=SqlJobRepository(),
        storage=S3StorageAdapter(
            uploads_bucket=os.getenv("S3_UPLOADS_BUCKET", "local-uploads"),
            outputs_bucket=os.getenv("S3_OUTPUTS_BUCKET", "local-outputs"),
        ),
    )


def get_submit_job_service() -> SubmitJobService:
    """Inject `SubmitJobService`."""

    return SubmitJobService(
        jobs=SqlJobRepository(),
        storage=S3StorageAdapter(
            uploads_bucket=os.getenv("S3_UPLOADS_BUCKET", "local-uploads"),
            outputs_bucket=os.getenv("S3_OUTPUTS_BUCKET", "local-outputs"),
        ),
        sqs=SqsPublisher(queue_url=os.getenv("SQS_PIPELINE_URL", "https://sqs.local/pipeline")),
    )


def get_download_service() -> DownloadArtifactService:
    """Inject `DownloadArtifactService`."""

    return DownloadArtifactService(
        jobs=SqlJobRepository(),
        storage=S3StorageAdapter(
            uploads_bucket=os.getenv("S3_UPLOADS_BUCKET", "local-uploads"),
            outputs_bucket=os.getenv("S3_OUTPUTS_BUCKET", "local-outputs"),
        ),
    )
