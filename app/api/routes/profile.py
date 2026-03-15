from __future__ import annotations

from fastapi import APIRouter, Depends, Response

from app.dependencies import get_candidate_profile_service, get_current_user
from app.models.candidate_profile import (
    CandidateProfileResponse,
    UpsertCandidateProfileRequest,
)
from app.models.user import User
from app.services.candidate_profile_service import CandidateProfileService

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get(
    "",
    response_model=CandidateProfileResponse,
    summary="Get the current user's candidate profile",
)
async def get_current_candidate_profile(
    response: Response,
    current_user: User = Depends(get_current_user),
    candidate_profile_service: CandidateProfileService = Depends(
        get_candidate_profile_service
    ),
) -> CandidateProfileResponse:
    _set_profile_response_headers(response)
    return candidate_profile_service.get_profile_for_user(current_user)


@router.put(
    "",
    response_model=CandidateProfileResponse,
    summary="Create or update the current user's candidate profile",
)
async def upsert_current_candidate_profile(
    payload: UpsertCandidateProfileRequest,
    response: Response,
    current_user: User = Depends(get_current_user),
    candidate_profile_service: CandidateProfileService = Depends(
        get_candidate_profile_service
    ),
) -> CandidateProfileResponse:
    _set_profile_response_headers(response)
    return candidate_profile_service.upsert_profile_for_user(current_user, payload)


def _set_profile_response_headers(response: Response) -> None:
    response.headers["Cache-Control"] = "no-store"
    response.headers["Pragma"] = "no-cache"
    response.headers["Vary"] = "Cookie"
