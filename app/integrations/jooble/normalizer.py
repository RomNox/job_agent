from __future__ import annotations

import hashlib
import html
import re

from app.models.search_result import JobSearchResult

_HTML_TAG_PATTERN = re.compile(r"<[^>]+>")
_WHITESPACE_PATTERN = re.compile(r"\s+")


def normalize_jooble_response(payload: dict) -> list[JobSearchResult]:
    jobs = payload.get("jobs")
    if not isinstance(jobs, list):
        return []

    normalized_results: list[JobSearchResult] = []
    for item in jobs:
        if not isinstance(item, dict):
            continue

        url = _clean_text(item.get("link")) or _clean_text(item.get("url"))
        if not url:
            continue

        external_id = _clean_text(item.get("id"))
        title = _clean_text(item.get("title")) or "Untitled role"
        company = _clean_text(item.get("company")) or _clean_text(item.get("companyname"))
        location = _clean_text(item.get("location"))
        salary = _clean_text(item.get("salary"))
        employment_type = _clean_text(item.get("type"))
        posted_at = _clean_text(item.get("updated")) or _clean_text(item.get("posted"))
        snippet = _clean_text(item.get("snippet")) or _clean_text(item.get("description"))

        normalized_results.append(
            JobSearchResult(
                id=_build_result_id(url=url, external_id=external_id),
                source="jooble",
                external_id=external_id,
                title=title,
                company=company,
                location=location,
                salary=salary,
                employment_type=employment_type,
                posted_at=posted_at,
                url=url,
                snippet=snippet,
            )
        )

    return normalized_results


def _build_result_id(*, url: str, external_id: str | None) -> str:
    if external_id:
        return f"jooble:{external_id}"

    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:16]
    return f"jooble:{digest}"


def _clean_text(value: object) -> str | None:
    if value is None:
        return None

    text = html.unescape(str(value))
    text = _HTML_TAG_PATTERN.sub(" ", text)
    text = _WHITESPACE_PATTERN.sub(" ", text).strip()
    return text or None
