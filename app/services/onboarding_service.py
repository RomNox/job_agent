from __future__ import annotations

from datetime import UTC, datetime

from app.models.onboarding import (
    OnboardingStateRecord,
    OnboardingStateResponse,
    UpdateOnboardingStateRequest,
)
from app.models.user import User
from app.repositories.onboarding_repository import OnboardingRepository


class OnboardingService:
    def __init__(self, repository: OnboardingRepository) -> None:
        self._repository = repository

    def get_state_for_user(self, user: User) -> OnboardingStateResponse:
        state = self._repository.get_by_user_id(user.id)
        if state is None:
            return OnboardingStateResponse(user_id=user.id)

        return OnboardingStateResponse.model_validate(state.model_dump())

    def update_state_for_user(
        self,
        user: User,
        payload: UpdateOnboardingStateRequest,
    ) -> OnboardingStateResponse:
        existing_state = self._repository.get_by_user_id(user.id)
        now = datetime.now(UTC)
        furthest_step = max(
            payload.current_step,
            existing_state.furthest_step if existing_state is not None else 0,
        )
        if payload.completed:
            furthest_step = max(furthest_step, payload.current_step)

        state = OnboardingStateRecord(
            user_id=user.id,
            current_step=payload.current_step,
            furthest_step=furthest_step,
            completed=payload.completed,
            created_at=existing_state.created_at if existing_state else now,
            updated_at=now,
        )
        saved_state = self._repository.upsert(state)
        return OnboardingStateResponse.model_validate(saved_state.model_dump())
