from __future__ import annotations

from datetime import UTC, datetime

from app.models.candidate_profile import (
    CandidateProfileRecord,
    CandidateProfileResponse,
    UpsertCandidateProfileRequest,
)
from app.models.user import User
from app.repositories.candidate_profile_repository import CandidateProfileRepository


class CandidateProfileService:
    def __init__(self, repository: CandidateProfileRepository) -> None:
        self._repository = repository

    def get_profile_for_user(self, user: User) -> CandidateProfileResponse:
        profile = self._repository.get_by_user_id(user.id)
        if profile is None:
            return CandidateProfileResponse(
                user_id=user.id,
                full_name=user.full_name,
                email=user.email,
            )

        return CandidateProfileResponse.model_validate(profile.model_dump())

    def upsert_profile_for_user(
        self,
        user: User,
        payload: UpsertCandidateProfileRequest,
    ) -> CandidateProfileResponse:
        existing_profile = self._repository.get_by_user_id(user.id)
        now = datetime.now(UTC)
        profile = CandidateProfileRecord(
            user_id=user.id,
            full_name=payload.full_name or user.full_name,
            email=payload.email or user.email,
            phone=payload.phone,
            location=payload.location,
            target_role=payload.target_role,
            years_of_experience=payload.years_of_experience,
            skills=payload.skills,
            languages=payload.languages,
            work_authorization=payload.work_authorization,
            remote_preference=payload.remote_preference,
            preferred_locations=payload.preferred_locations,
            salary_expectation=payload.salary_expectation,
            professional_summary=payload.professional_summary,
            cv_text=payload.cv_text,
            created_at=existing_profile.created_at if existing_profile else now,
            updated_at=now,
        )
        saved_profile = self._repository.upsert(profile)
        return CandidateProfileResponse.model_validate(saved_profile.model_dump())
