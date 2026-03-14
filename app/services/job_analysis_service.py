from __future__ import annotations

from app.models.job_analysis import JobAnalysisResponse
from app.services.claude_service import ClaudeService
from app.services.structured_response_parser import parse_structured_response

ANALYZE_JOB_POSTING_SKILL = "analyze-job-posting"
JOB_ANALYSIS_SYSTEM_PROMPT = (
    "You analyze German job and Ausbildung postings and return structured results. "
    "Always respond with a single valid JSON object and no surrounding commentary."
)


class JobAnalysisService:
    def __init__(self, claude_service: ClaudeService) -> None:
        self._claude_service = claude_service

    async def analyze(
        self,
        *,
        raw_text: str,
        source_url: str | None = None,
    ) -> JobAnalysisResponse:
        response = await self._claude_service.generate_response(
            prompt=self._build_prompt(raw_text=raw_text, source_url=source_url),
            system_prompt=JOB_ANALYSIS_SYSTEM_PROMPT,
            context={"source_url": source_url} if source_url else None,
            skills=[ANALYZE_JOB_POSTING_SKILL],
            max_tokens=1200,
        )
        return self._parse_analysis_response(response["text"])

    def _build_prompt(self, *, raw_text: str, source_url: str | None) -> str:
        source_line = source_url or "not provided"
        return (
            "Analyze the following raw job posting text and return only JSON with the "
            "exact keys: title, employer, location, employment_type, language, "
            "requirements, summary, missing_information.\n\n"
            "Rules:\n"
            "- requirements must be an array of short strings.\n"
            "- missing_information must be an array of short strings.\n"
            "- If a field cannot be determined, use 'Unknown' for string fields.\n"
            "- Write the summary as a concise paragraph.\n"
            "- Do not include markdown or code fences.\n\n"
            f"Source URL: {source_line}\n\n"
            "Raw job posting:\n"
            f"{raw_text}"
        )

    def _parse_analysis_response(self, response_text: str) -> JobAnalysisResponse:
        return parse_structured_response(
            response_text,
            JobAnalysisResponse,
            error_message="Claude returned an invalid job analysis response.",
        )
