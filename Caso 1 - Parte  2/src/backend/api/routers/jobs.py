"""Job lifecycle REST endpoints."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, status

from api.deps import CurrentUser, get_create_job_service, get_current_user, get_submit_job_service
from application.commands.create_job import CreateJobCommand
from application.commands.submit_job import SubmitJobCommand
from application.services.create_job_service import CreateJobService
from application.services.submit_job_service import SubmitJobService

router = APIRouter(prefix="/v1/jobs", tags=["jobs"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_job(
    cmd: CreateJobCommand,
    svc: CreateJobService = Depends(get_create_job_service),
    user: CurrentUser = Depends(get_current_user),
) -> dict:
    """Creates a job and returns S3 pre-signed PUT URLs for direct file upload."""

    return svc.execute(cmd, user_id=user.sub)


@router.post("/{job_id}/submit", status_code=status.HTTP_202_ACCEPTED)
def submit_job(
    job_id: UUID,
    svc: SubmitJobService = Depends(get_submit_job_service),
    user: CurrentUser = Depends(get_current_user),
) -> dict:
    """Verifies files exist in S3 and enqueues the processing pipeline."""

    return svc.execute(SubmitJobCommand(job_id=job_id), user_id=user.sub)


@router.get("/{job_id}")
def get_job(
    job_id: UUID,
    user: CurrentUser = Depends(get_current_user),
) -> dict:
    """Return current job status (polling fallback for progress)."""

    _ = (job_id, user)
    return {}
