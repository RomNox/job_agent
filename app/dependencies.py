from functools import lru_cache

from fastapi import Depends

from app.agents.job_agent import JobAgent
from app.config import Settings, get_settings
from app.services.application_package_service import ApplicationPackageService
from app.services.claude_service import ClaudeService
from app.services.cover_letter_service import CoverLetterService
from app.services.cv_tailoring_service import CVTailoringService
from app.services.job_analysis_service import JobAnalysisService
from app.services.job_match_service import JobMatchService
from app.services.job_parsing_service import JobParsingService
from app.services.skill_registry import ClaudeSkillRegistry


@lru_cache
def get_skill_registry() -> ClaudeSkillRegistry:
    settings = get_settings()
    return ClaudeSkillRegistry(settings.claude_skills_dir)


@lru_cache
def get_claude_service() -> ClaudeService:
    settings = get_settings()
    return ClaudeService(settings=settings, skill_registry=get_skill_registry())


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
