from __future__ import annotations

from app.models.candidate_profile import CandidateProfile
from app.models.cover_letter import CoverLetterResponse
from app.models.job_analysis import JobAnalysisResponse
from app.services.claude_service import ClaudeService
from app.services.job_analysis_service import JobAnalysisService
from app.services.structured_response_parser import parse_structured_response

GENERATE_ANSCHREIBEN_SKILL = "generate-anschreiben"
COVER_LETTER_SYSTEM_PROMPT = (
    "You generate tailored German cover letters for job and Ausbildung applications. "
    "Always respond with a single valid JSON object and no surrounding commentary."
)


class CoverLetterService:
    def __init__(
        self,
        claude_service: ClaudeService,
        job_analysis_service: JobAnalysisService,
    ) -> None:
        self._claude_service = claude_service
        self._job_analysis_service = job_analysis_service

    async def generate_cover_letter(
        self,
        *,
        candidate_profile: CandidateProfile,
        job_posting: JobAnalysisResponse | None = None,
        raw_text: str | None = None,
        source_url: str | None = None,
    ) -> CoverLetterResponse:
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
            system_prompt=COVER_LETTER_SYSTEM_PROMPT,
            context={
                "candidate_profile": candidate_profile.model_dump(),
                "job_posting": analyzed_job.model_dump(),
            },
            skills=[GENERATE_ANSCHREIBEN_SKILL],
            max_tokens=1600,
        )
        return parse_structured_response(
            response["text"],
            CoverLetterResponse,
            error_message="Claude returned an invalid cover letter response.",
        )

    def _build_prompt(self) -> str:
        return (
            "Create a tailored German cover letter and return only JSON with the exact "
            "keys: cover_letter, key_points_used, warnings.\n\n"
            "Rules:\n"
            "- cover_letter must be a complete German Anschreiben as a single string.\n"
            "- key_points_used must be an array of short strings describing the core "
            "arguments used from the candidate profile and job posting.\n"
            "- warnings must be an array of short strings for unclear claims, missing "
            "evidence, or items the applicant should review manually.\n"
            "- Do not include markdown or code fences.\n"
            "- The letter should be professional, concise, and tailored to the role."
        )
