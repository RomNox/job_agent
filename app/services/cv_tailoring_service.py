from __future__ import annotations

from app.models.candidate_profile import CandidateProfile
from app.models.cv_tailoring import CVTailoringResponse
from app.models.job_analysis import JobAnalysisResponse
from app.services.claude_service import ClaudeService
from app.services.job_analysis_service import JobAnalysisService
from app.services.structured_response_parser import parse_structured_response

TAILOR_CV_SKILL = "tailor-cv"
CV_TAILORING_SYSTEM_PROMPT = (
    "You tailor candidate CV content for German job and Ausbildung applications. "
    "Always respond with a single valid JSON object and no surrounding commentary."
)


class CVTailoringService:
    def __init__(
        self,
        claude_service: ClaudeService,
        job_analysis_service: JobAnalysisService,
    ) -> None:
        self._claude_service = claude_service
        self._job_analysis_service = job_analysis_service

    async def tailor_cv(
        self,
        *,
        candidate_profile: CandidateProfile,
        job_posting: JobAnalysisResponse | None = None,
        raw_text: str | None = None,
        source_url: str | None = None,
    ) -> CVTailoringResponse:
        analyzed_job = job_posting
        if analyzed_job is None:
            if raw_text is None:
                raise ValueError("Either job_posting or raw_text is required.")
            analyzed_job = await self._job_analysis_service.analyze(
                raw_text=raw_text,
                source_url=source_url,
            )

        response = await self._claude_service.generate_response(
            prompt=self._build_prompt(),
            system_prompt=CV_TAILORING_SYSTEM_PROMPT,
            context={
                "candidate_profile": candidate_profile.model_dump(),
                "job_posting": analyzed_job.model_dump(),
            },
            skills=[TAILOR_CV_SKILL],
            max_tokens=1400,
        )
        return parse_structured_response(
            response["text"],
            CVTailoringResponse,
            error_message="Claude returned an invalid CV tailoring response.",
        )

    def _build_prompt(self) -> str:
        return (
            "Tailor the candidate CV for the job posting and return only JSON with the "
            "exact keys: tailored_summary, highlighted_skills, "
            "suggested_experience_points, warnings.\n\n"
            "Rules:\n"
            "- tailored_summary must be a concise role-specific professional summary.\n"
            "- highlighted_skills must be an array of short strings emphasizing the "
            "most relevant skills to foreground.\n"
            "- suggested_experience_points must be an array of short CV bullet ideas "
            "aligned with the role.\n"
            "- warnings must be an array of short strings for weak evidence, gaps, or "
            "claims that need human review.\n"
            "- Do not include markdown or code fences."
        )
