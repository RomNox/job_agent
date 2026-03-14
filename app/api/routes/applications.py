from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import (
    get_application_package_service,
    get_cover_letter_service,
    get_cv_tailoring_service,
)
from app.models.application_package import ApplicationPackage, ApplicationPackageRequest
from app.models.cover_letter import CoverLetterRequest, CoverLetterResponse
from app.models.cv_tailoring import CVTailoringRequest, CVTailoringResponse
from app.services.application_package_service import ApplicationPackageService
from app.services.cover_letter_service import CoverLetterService
from app.services.cv_tailoring_service import CVTailoringService

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post(
    "/cover-letter",
    response_model=CoverLetterResponse,
    summary="Generate a German cover letter",
)
async def generate_cover_letter(
    payload: CoverLetterRequest,
    cover_letter_service: CoverLetterService = Depends(get_cover_letter_service),
) -> CoverLetterResponse:
    try:
        return await cover_letter_service.generate_cover_letter(
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


@router.post(
    "/tailor-cv",
    response_model=CVTailoringResponse,
    summary="Tailor a CV for a specific job posting",
)
async def tailor_cv(
    payload: CVTailoringRequest,
    cv_tailoring_service: CVTailoringService = Depends(get_cv_tailoring_service),
) -> CVTailoringResponse:
    try:
        return await cv_tailoring_service.tailor_cv(
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


@router.post(
    "/prepare",
    response_model=ApplicationPackage,
    summary="Prepare a complete application package",
)
async def prepare_application(
    payload: ApplicationPackageRequest,
    application_package_service: ApplicationPackageService = Depends(
        get_application_package_service
    ),
) -> ApplicationPackage:
    try:
        return await application_package_service.prepare_application(
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
