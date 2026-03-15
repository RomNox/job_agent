from __future__ import annotations

import html
import re

from app.models.job_parsing import JobParsingResponse
from app.models.resolved_job_content import ResolvedJobContent
from app.models.search_selected_job import SearchSelectedJob
from app.services.job_parsing_service import JobParsingService

_HTML_TAG_PATTERN = re.compile(r"<[^>]+>")
_WHITESPACE_PATTERN = re.compile(r"\s+")


class JobContentResolutionService:
    def __init__(self, job_parsing_service: JobParsingService) -> None:
        self._job_parsing_service = job_parsing_service

    async def resolve_selected_job(
        self,
        selected_job: SearchSelectedJob,
    ) -> ResolvedJobContent:
        try:
            parsed_job = await self._job_parsing_service.parse_url(selected_job.url)
        except ValueError:
            return self._build_preview_fallback(selected_job)

        return self._build_full_resolution(
            selected_job=selected_job,
            parsed_job=parsed_job,
        )

    def _build_full_resolution(
        self,
        *,
        selected_job: SearchSelectedJob,
        parsed_job: JobParsingResponse,
    ) -> ResolvedJobContent:
        return ResolvedJobContent(
            title=selected_job.title,
            company=selected_job.company,
            location=selected_job.location,
            salary=selected_job.salary,
            employment_type=selected_job.employment_type,
            posted_at=selected_job.posted_at,
            source=selected_job.source,
            source_url=parsed_job.source_url,
            raw_text=parsed_job.raw_text,
            content_quality="full",
            fetch_method="page_parse",
            resolution_notes=self._build_full_resolution_notes(parsed_job),
        )

    def _build_preview_fallback(
        self,
        selected_job: SearchSelectedJob,
    ) -> ResolvedJobContent:
        raw_text = self._build_preview_raw_text(selected_job)

        return ResolvedJobContent(
            title=selected_job.title,
            company=selected_job.company,
            location=selected_job.location,
            salary=selected_job.salary,
            employment_type=selected_job.employment_type,
            posted_at=selected_job.posted_at,
            source=selected_job.source,
            source_url=selected_job.url,
            raw_text=raw_text,
            content_quality="preview",
            fetch_method="search_preview",
            resolution_notes=(
                "Using search preview because the original job page could not be "
                "fully fetched."
            ),
        )

    def _build_preview_raw_text(self, selected_job: SearchSelectedJob) -> str:
        cleaned_title = self._clean_text(selected_job.title)
        cleaned_company = self._clean_text(selected_job.company)
        cleaned_location = self._clean_text(selected_job.location)
        cleaned_salary = self._clean_text(selected_job.salary)
        cleaned_employment_type = self._clean_text(selected_job.employment_type)
        cleaned_posted_at = self._clean_text(selected_job.posted_at)
        cleaned_source = self._clean_text(selected_job.source)
        cleaned_url = self._clean_text(selected_job.url)
        cleaned_snippet = self._clean_text(selected_job.snippet)

        if not any(
            (
                cleaned_title,
                cleaned_company,
                cleaned_location,
                cleaned_salary,
                cleaned_employment_type,
                cleaned_posted_at,
                cleaned_snippet,
            )
        ):
            raise ValueError("Not enough search data to construct fallback job content.")

        sections = [
            f"Job title: {cleaned_title or 'Not provided'}",
            f"Company: {cleaned_company or 'Not provided'}",
            f"Location: {cleaned_location or 'Not provided'}",
            f"Salary: {cleaned_salary or 'Not provided'}",
            f"Employment type: {cleaned_employment_type or 'Not provided'}",
            f"Posted at: {cleaned_posted_at or 'Not provided'}",
            f"Source: {cleaned_source or 'Not provided'}",
            f"Source URL: {cleaned_url or 'Not provided'}",
            "",
            "Job description preview:",
            cleaned_snippet or "No preview available.",
        ]
        raw_text = "\n".join(sections).strip()
        if not raw_text:
            raise ValueError("Not enough search data to construct fallback job content.")
        return raw_text

    def _build_full_resolution_notes(
        self,
        parsed_job: JobParsingResponse,
    ) -> str | None:
        notes: list[str] = []
        if parsed_job.page_title:
            notes.append(f"Page title: {parsed_job.page_title}")
        notes.extend(parsed_job.extraction_warnings)
        if not notes:
            return None
        return " ".join(notes)

    def _clean_text(self, value: str | None) -> str | None:
        if value is None:
            return None

        text = html.unescape(value)
        text = _HTML_TAG_PATTERN.sub(" ", text)
        text = _WHITESPACE_PATTERN.sub(" ", text).strip()
        return text or None
