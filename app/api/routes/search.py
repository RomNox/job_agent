from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import (
    get_job_content_resolution_service,
    get_job_search_service,
)
from app.models.resolved_job_content import ResolvedJobContent
from app.models.search_query import SearchQuery
from app.models.search_result import JobSearchResponse
from app.models.search_selected_job import SearchSelectedJob
from app.services.job_content_resolution_service import JobContentResolutionService
from app.services.job_search_service import JobSearchService

router = APIRouter(prefix="/search", tags=["search"])


@router.post(
    "/jobs",
    response_model=JobSearchResponse,
    summary="Search jobs from external sources",
)
async def search_jobs(
    payload: SearchQuery,
    job_search_service: JobSearchService = Depends(get_job_search_service),
) -> JobSearchResponse:
    try:
        results = await job_search_service.search_jobs(payload)
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    return JobSearchResponse(
        source=payload.source,
        count=len(results),
        results=results,
    )


@router.post(
    "/resolve-job",
    response_model=ResolvedJobContent,
    summary="Resolve best-available job content for a selected search result",
)
async def resolve_job_content(
    payload: SearchSelectedJob,
    job_content_resolution_service: JobContentResolutionService = Depends(
        get_job_content_resolution_service
    ),
) -> ResolvedJobContent:
    try:
        return await job_content_resolution_service.resolve_selected_job(payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
