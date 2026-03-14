from __future__ import annotations

from app.models.candidate_profile import CandidateProfile
from app.models.job_analysis import JobAnalysisResponse
from app.models.job_match import JobMatchResponse
from app.services.claude_service import ClaudeService
from app.services.job_analysis_service import JobAnalysisService
from app.services.structured_response_parser import parse_structured_response

MATCH_CANDIDATE_SKILL = "match-candidate"
JOB_MATCH_SYSTEM_PROMPT = (
    "You evaluate how well a candidate matches a German job or Ausbildung posting. "
    "Always respond with a single valid JSON object and no surrounding commentary."
)


class JobMatchService:
    def __init__(
        self,
        claude_service: ClaudeService,
        job_analysis_service: JobAnalysisService,
    ) -> None:
        self._claude_service = claude_service
        self._job_analysis_service = job_analysis_service

    async def match_candidate(
        self,
        *,
        candidate_profile: CandidateProfile,
        job_posting: JobAnalysisResponse | None = None,
        raw_text: str | None = None,
        source_url: str | None = None,
    ) -> JobMatchResponse:
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
            system_prompt=JOB_MATCH_SYSTEM_PROMPT,
            context={
                "candidate_profile": candidate_profile.model_dump(),
                "job_posting": analyzed_job.model_dump(),
            },
            skills=[MATCH_CANDIDATE_SKILL],
            max_tokens=1200,
        )
        return parse_structured_response(
            response["text"],
            JobMatchResponse,
            error_message="Claude returned an invalid job match response.",
        )

    def _build_prompt(self) -> str:
        return (
            "Match the candidate profile to the job posting and return only JSON with "
            "the exact keys: match_score, summary, strengths, gaps, "
            "recommended_next_steps.\n\n"
            "Rules:\n"
            "- match_score must be a number between 0 and 100.\n"
            "- strengths, gaps, and recommended_next_steps must be arrays of short "
            "strings.\n"
            "- summary must be a concise paragraph.\n"
            "- Do not include markdown or code fences."
        )
