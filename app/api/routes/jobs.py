from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import (
    get_job_analysis_service,
    get_job_match_service,
    get_job_parsing_service,
)
from app.models.job_analysis import JobAnalysisRequest, JobAnalysisResponse
from app.models.job_match import JobMatchRequest, JobMatchResponse
from app.models.job_parsing import JobParsingRequest, JobParsingResponse
from app.services.job_analysis_service import JobAnalysisService
from app.services.job_match_service import JobMatchService
from app.services.job_parsing_service import JobParsingService

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post(
    "/parse",
    response_model=JobParsingResponse,
    summary="Parse a job posting page from a URL",
)
async def parse_job_posting_page(
    payload: JobParsingRequest,
    job_parsing_service: JobParsingService = Depends(get_job_parsing_service),
) -> JobParsingResponse:
    try:
        return await job_parsing_service.parse_url(payload.url)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc


@router.post(
    "/analyze",
    response_model=JobAnalysisResponse,
    summary="Analyze a raw job posting",
)
async def analyze_job_posting(
    payload: JobAnalysisRequest,
    job_analysis_service: JobAnalysisService = Depends(get_job_analysis_service),
) -> JobAnalysisResponse:
    try:
        return await job_analysis_service.analyze(
            raw_text=payload.raw_text,
            source_url=payload.source_url,
        )
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
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


@router.post(
    "/match",
    response_model=JobMatchResponse,
    summary="Match a candidate profile to a job posting",
)
async def match_candidate_to_job(
    payload: JobMatchRequest,
    job_match_service: JobMatchService = Depends(get_job_match_service),
) -> JobMatchResponse:
    try:
        return await job_match_service.match_candidate(
            candidate_profile=payload.candidate_profile,
            job_posting=payload.job_posting,
            raw_text=payload.raw_text,
            source_url=payload.source_url,
        )
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
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
