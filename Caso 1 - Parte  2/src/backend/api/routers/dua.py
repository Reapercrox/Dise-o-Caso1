"""SSE progress and artifact download."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from api.deps import CurrentUser, get_current_user, get_download_service
from application.services.download_service import DownloadArtifactService

router = APIRouter(prefix="/v1/jobs", tags=["dua"])


@router.get("/{job_id}/progress")
async def job_progress(
    job_id: UUID,
    user: CurrentUser = Depends(get_current_user),
):
    """Server-Sent Events stream of pipeline progress from Redis."""

    _ = user

    async def events():
        yield f'data: {{"job_id":"{job_id}","stage":"ingestion","percentage":0}}\n\n'

    return StreamingResponse(events(), media_type="text/event-stream")


@router.get("/{job_id}/download")
def download_dua(
    job_id: UUID,
    svc: DownloadArtifactService = Depends(get_download_service),
    user: CurrentUser = Depends(get_current_user),
) -> dict:
    """Return a pre-signed GET URL for the generated Word document."""

    return svc.execute(job_id=job_id, user_id=user.sub)
