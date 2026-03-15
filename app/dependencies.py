from datetime import timedelta
from functools import lru_cache

from fastapi import Depends, HTTPException, Request, status

from app.agents.job_agent import JobAgent
from app.config import Settings, get_settings
from app.integrations.jooble.adapter import JoobleAdapter
from app.integrations.jooble.client import JoobleClient
from app.repositories.candidate_profile_repository import CandidateProfileRepository
from app.repositories.onboarding_repository import OnboardingRepository
from app.models.user import User
from app.repositories.session_repository import SessionRepository
from app.repositories.sqlite_database import SQLiteDatabase
from app.repositories.user_repository import UserRepository
from app.services.application_package_service import ApplicationPackageService
from app.services.auth_service import AuthService
from app.services.candidate_profile_service import CandidateProfileService
from app.services.claude_service import ClaudeService
from app.services.cover_letter_service import CoverLetterService
from app.services.cv_tailoring_service import CVTailoringService
from app.services.job_analysis_service import JobAnalysisService
from app.services.job_content_resolution_service import JobContentResolutionService
from app.services.job_search_service import JobSearchService
from app.services.job_match_service import JobMatchService
from app.services.job_parsing_service import JobParsingService
from app.services.onboarding_service import OnboardingService
from app.services.password_service import PasswordService
from app.services.session_service import SessionService
from app.services.skill_registry import ClaudeSkillRegistry


@lru_cache
def get_skill_registry() -> ClaudeSkillRegistry:
    settings = get_settings()
    return ClaudeSkillRegistry(settings.claude_skills_dir)


@lru_cache
def get_claude_service() -> ClaudeService:
    settings = get_settings()
    return ClaudeService(settings=settings, skill_registry=get_skill_registry())


@lru_cache
def get_auth_database() -> SQLiteDatabase:
    settings = get_settings()
    return SQLiteDatabase(settings.auth_db_path)


@lru_cache
def get_user_repository() -> UserRepository:
    return UserRepository(get_auth_database())


@lru_cache
def get_session_repository() -> SessionRepository:
    return SessionRepository(get_auth_database())


@lru_cache
def get_candidate_profile_repository() -> CandidateProfileRepository:
    return CandidateProfileRepository(get_auth_database())


@lru_cache
def get_onboarding_repository() -> OnboardingRepository:
    return OnboardingRepository(get_auth_database())


@lru_cache
def get_password_service() -> PasswordService:
    return PasswordService()


@lru_cache
def get_session_service() -> SessionService:
    settings = get_settings()
    return SessionService(
        session_repository=get_session_repository(),
        user_repository=get_user_repository(),
        session_ttl=timedelta(seconds=settings.auth_session_max_age_seconds),
    )


@lru_cache
def get_auth_service() -> AuthService:
    return AuthService(
        user_repository=get_user_repository(),
        password_service=get_password_service(),
        session_service=get_session_service(),
    )


@lru_cache
def get_candidate_profile_service() -> CandidateProfileService:
    return CandidateProfileService(repository=get_candidate_profile_repository())


@lru_cache
def get_onboarding_service() -> OnboardingService:
    return OnboardingService(repository=get_onboarding_repository())


def get_job_agent(
    claude_service: ClaudeService = Depends(get_claude_service),
) -> JobAgent:
    return JobAgent(claude_service=claude_service)


def get_job_analysis_service(
    claude_service: ClaudeService = Depends(get_claude_service),
) -> JobAnalysisService:
    return JobAnalysisService(claude_service=claude_service)


def get_job_parsing_service() -> JobParsingService:
    return JobParsingService()


def get_job_content_resolution_service(
    job_parsing_service: JobParsingService = Depends(get_job_parsing_service),
) -> JobContentResolutionService:
    return JobContentResolutionService(job_parsing_service=job_parsing_service)


@lru_cache
def get_job_search_service() -> JobSearchService:
    settings = get_settings()
    jooble_api_key = (
        settings.jooble_api_key.get_secret_value()
        if settings.jooble_api_key is not None
        else None
    )
    client = JoobleClient(api_key=jooble_api_key)
    adapter = JoobleAdapter(client=client)
    return JobSearchService(jooble_adapter=adapter)


def get_job_match_service(
    claude_service: ClaudeService = Depends(get_claude_service),
    job_analysis_service: JobAnalysisService = Depends(get_job_analysis_service),
) -> JobMatchService:
    return JobMatchService(
        claude_service=claude_service,
        job_analysis_service=job_analysis_service,
    )


def get_cover_letter_service(
    claude_service: ClaudeService = Depends(get_claude_service),
    job_analysis_service: JobAnalysisService = Depends(get_job_analysis_service),
) -> CoverLetterService:
    return CoverLetterService(
        claude_service=claude_service,
        job_analysis_service=job_analysis_service,
    )


def get_cv_tailoring_service(
    claude_service: ClaudeService = Depends(get_claude_service),
    job_analysis_service: JobAnalysisService = Depends(get_job_analysis_service),
) -> CVTailoringService:
    return CVTailoringService(
        claude_service=claude_service,
        job_analysis_service=job_analysis_service,
    )


def get_application_package_service(
    claude_service: ClaudeService = Depends(get_claude_service),
    job_analysis_service: JobAnalysisService = Depends(get_job_analysis_service),
    job_match_service: JobMatchService = Depends(get_job_match_service),
    cover_letter_service: CoverLetterService = Depends(get_cover_letter_service),
    cv_tailoring_service: CVTailoringService = Depends(get_cv_tailoring_service),
) -> ApplicationPackageService:
    return ApplicationPackageService(
        claude_service=claude_service,
        job_analysis_service=job_analysis_service,
        job_match_service=job_match_service,
        cover_letter_service=cover_letter_service,
        cv_tailoring_service=cv_tailoring_service,
    )


def get_app_settings() -> Settings:
    return get_settings()


def get_optional_session_token(
    request: Request,
    settings: Settings = Depends(get_app_settings),
) -> str | None:
    cookie_value = request.cookies.get(settings.auth_session_cookie_name)
    if cookie_value is None:
        return None

    normalized = cookie_value.strip()
    return normalized or None


def get_optional_current_user(
    session_token: str | None = Depends(get_optional_session_token),
    auth_service: AuthService = Depends(get_auth_service),
) -> User | None:
    return auth_service.get_current_user(session_token)


def get_current_user(
    current_user: User | None = Depends(get_optional_current_user),
) -> User:
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )

    return current_user
