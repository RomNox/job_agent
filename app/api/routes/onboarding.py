from __future__ import annotations

from fastapi import APIRouter, Depends, Response

from app.dependencies import get_current_user, get_onboarding_service
from app.models.onboarding import (
    OnboardingStateResponse,
    UpdateOnboardingStateRequest,
)
from app.models.user import User
from app.services.onboarding_service import OnboardingService

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.get(
    "",
    response_model=OnboardingStateResponse,
    summary="Get the current user's onboarding progress",
)
async def get_onboarding_state(
    response: Response,
    current_user: User = Depends(get_current_user),
    onboarding_service: OnboardingService = Depends(get_onboarding_service),
) -> OnboardingStateResponse:
    _set_onboarding_response_headers(response)
    return onboarding_service.get_state_for_user(current_user)


@router.put(
    "",
    response_model=OnboardingStateResponse,
    summary="Update the current user's onboarding progress",
)
async def update_onboarding_state(
    payload: UpdateOnboardingStateRequest,
    response: Response,
    current_user: User = Depends(get_current_user),
    onboarding_service: OnboardingService = Depends(get_onboarding_service),
) -> OnboardingStateResponse:
    _set_onboarding_response_headers(response)
    return onboarding_service.update_state_for_user(current_user, payload)


def _set_onboarding_response_headers(response: Response) -> None:
    response.headers["Cache-Control"] = "no-store"
    response.headers["Pragma"] = "no-cache"
    response.headers["Vary"] = "Cookie"
