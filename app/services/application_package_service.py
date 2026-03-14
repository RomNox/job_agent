from __future__ import annotations

from app.models.application_package import (
    ApplicationPackage,
    ApplicationPackageChecklist,
)
from app.models.candidate_profile import CandidateProfile
from app.models.job_analysis import JobAnalysisResponse
from app.services.claude_service import ClaudeService
from app.services.cover_letter_service import CoverLetterService
from app.services.cv_tailoring_service import CVTailoringService
from app.services.job_analysis_service import JobAnalysisService
from app.services.job_match_service import JobMatchService
from app.services.structured_response_parser import parse_structured_response

PREPARE_APPLICATION_SKILL = "prepare-application"
APPLICATION_PACKAGE_SYSTEM_PROMPT = (
    "You assemble final application-readiness guidance for German job and Ausbildung "
    "applications. Always respond with a single valid JSON object and no surrounding "
    "commentary."
)


class ApplicationPackageService:
    def __init__(
        self,
        claude_service: ClaudeService,
        job_analysis_service: JobAnalysisService,
        job_match_service: JobMatchService,
        cover_letter_service: CoverLetterService,
        cv_tailoring_service: CVTailoringService,
    ) -> None:
        self._claude_service = claude_service
        self._job_analysis_service = job_analysis_service
        self._job_match_service = job_match_service
        self._cover_letter_service = cover_letter_service
        self._cv_tailoring_service = cv_tailoring_service

    async def prepare_application(
        self,
        *,
        candidate_profile: CandidateProfile,
        job_posting: JobAnalysisResponse | None = None,
        raw_text: str | None = None,
        source_url: str | None = None,
    ) -> ApplicationPackage:
        analyzed_job = job_posting
        if analyzed_job is None:
            if raw_text is None:
                raise ValueError("Either job_posting or raw_text is required.")
            analyzed_job = await self._job_analysis_service.analyze(
                raw_text=raw_text,
                source_url=source_url,
            )

        match_result = await self._job_match_service.match_candidate(
            candidate_profile=candidate_profile,
            job_posting=analyzed_job,
        )
        cover_letter = await self._cover_letter_service.generate_cover_letter(
            candidate_profile=candidate_profile,
            job_posting=analyzed_job,
        )
        cv_tailoring = await self._cv_tailoring_service.tailor_cv(
            candidate_profile=candidate_profile,
            job_posting=analyzed_job,
        )
        checklist_bundle = await self._generate_checklist_and_warnings(
            candidate_profile=candidate_profile,
            job_posting=analyzed_job,
            match_result=match_result.model_dump(),
            cover_letter=cover_letter.model_dump(),
            cv_tailoring=cv_tailoring.model_dump(),
        )

        return ApplicationPackage(
            job_posting=analyzed_job,
            match_result=match_result,
            cover_letter=cover_letter,
            cv_tailoring=cv_tailoring,
            checklist=checklist_bundle.checklist,
            warnings=checklist_bundle.warnings,
        )

    async def _generate_checklist_and_warnings(
        self,
        *,
        candidate_profile: CandidateProfile,
        job_posting: JobAnalysisResponse,
        match_result: dict,
        cover_letter: dict,
        cv_tailoring: dict,
    ) -> ApplicationPackageChecklist:
        response = await self._claude_service.generate_response(
            prompt=self._build_prompt(),
            system_prompt=APPLICATION_PACKAGE_SYSTEM_PROMPT,
            context={
                "candidate_profile": candidate_profile.model_dump(),
                "job_posting": job_posting.model_dump(),
                "match_result": match_result,
                "cover_letter": cover_letter,
                "cv_tailoring": cv_tailoring,
            },
            skills=[PREPARE_APPLICATION_SKILL],
            max_tokens=900,
        )
        return parse_structured_response(
            response["text"],
            ApplicationPackageChecklist,
            error_message="Claude returned an invalid application package response.",
        )

    def _build_prompt(self) -> str:
        return (
            "Using the prepared application materials, return only JSON with the exact "
            "keys: checklist, warnings.\n\n"
            "Rules:\n"
            "- checklist must be an array of short actionable items the candidate "
            "should complete before submission.\n"
            "- warnings must be an array of short strings for risks, missing "
            "information, or items that require manual review.\n"
            "- Do not include markdown or code fences."
        )
