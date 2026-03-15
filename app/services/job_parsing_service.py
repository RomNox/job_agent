from __future__ import annotations

import re
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup
from bs4.element import Tag

from app.models.job_parsing import JobParsingResponse

NOISE_TAGS = (
    "script",
    "style",
    "noscript",
    "svg",
    "canvas",
    "iframe",
    "nav",
    "header",
    "footer",
    "aside",
    "form",
    "button",
    "input",
)
NOISE_HINTS = (
    "nav",
    "menu",
    "footer",
    "header",
    "cookie",
    "breadcrumb",
    "sidebar",
    "share",
    "social",
    "related",
    "recommend",
    "banner",
    "subscribe",
    "login",
    "signup",
)


class JobParsingService:
    def __init__(self, transport: httpx.AsyncBaseTransport | None = None) -> None:
        self._transport = transport

    async def parse_url(self, url: str) -> JobParsingResponse:
        normalized_url = url.strip()
        parsed_url = urlparse(normalized_url)
        if parsed_url.scheme not in {"http", "https"} or not parsed_url.netloc:
            raise ValueError(f"Failed to fetch job posting page from '{normalized_url}'.")

        response = await self._fetch_page(normalized_url)
        detected_source = self.detect_source(str(response.url))
        return self._parse_html(
            html=response.text,
            source_url=str(response.url),
            detected_source=detected_source,
        )

    def detect_source(self, url: str) -> str | None:
        hostname = (urlparse(url).hostname or "").lower()
        if "linkedin" in hostname:
            return "linkedin"
        if "indeed" in hostname:
            return "indeed"
        if "stepstone" in hostname:
            return "stepstone"
        if "arbeitsagentur" in hostname:
            return "arbeitsagentur"
        return None

    async def _fetch_page(self, url: str) -> httpx.Response:
        try:
            async with httpx.AsyncClient(
                follow_redirects=True,
                timeout=15.0,
                transport=self._transport,
                headers={
                    "User-Agent": (
                        "job-agent/0.1.0 (+https://example.local/job-agent)"
                    )
                },
            ) as client:
                response = await client.get(url)
                response.raise_for_status()
                return response
        except httpx.HTTPError as exc:
            raise ValueError(f"Failed to fetch job posting page from '{url}'.") from exc

    def _parse_html(
        self,
        *,
        html: str,
        source_url: str,
        detected_source: str | None,
    ) -> JobParsingResponse:
        soup = BeautifulSoup(html, "html.parser")
        page_title = self._extract_page_title(soup)
        self._remove_noise(soup)
        content_root, extraction_warnings = self._select_content_root(soup)
        raw_text = self._extract_visible_text(content_root)

        if len(raw_text) < 80:
            raise ValueError(
                f"Failed to extract meaningful job text from '{source_url}'."
            )

        if page_title is None:
            extraction_warnings.append("Page title could not be extracted.")

        return JobParsingResponse(
            source_url=source_url,
            page_title=page_title,
            raw_text=raw_text,
            detected_source=detected_source,
            extraction_warnings=extraction_warnings,
        )

    def _extract_page_title(self, soup: BeautifulSoup) -> str | None:
        if soup.title is None or soup.title.string is None:
            return None
        title = self._normalize_whitespace(soup.title.string)
        return title or None

    def _remove_noise(self, soup: BeautifulSoup) -> None:
        for element in soup(NOISE_TAGS):
            element.decompose()

        for element in soup.find_all(True):
            if not isinstance(element, Tag):
                continue
            hints = " ".join(
                value
                for value in (
                    element.get("id"),
                    " ".join(element.get("class", [])),
                    element.get("role"),
                    element.get("aria-label"),
                )
                if value
            ).lower()
            if hints and any(noise_hint in hints for noise_hint in NOISE_HINTS):
                element.decompose()

    def _select_content_root(self, soup: BeautifulSoup) -> tuple[Tag, list[str]]:
        warnings: list[str] = []
        candidates: list[Tag] = []

        for candidate in (
            soup.find("main"),
            soup.find("article"),
            soup.find(attrs={"role": "main"}),
            soup.body,
            soup,
        ):
            if isinstance(candidate, Tag) and candidate not in candidates:
                candidates.append(candidate)

        if not candidates:
            raise ValueError("Failed to parse job posting HTML.")

        best_candidate = max(candidates, key=self._candidate_text_score)
        if best_candidate is soup.body or best_candidate is soup:
            warnings.append("Used fallback body extraction for page content.")

        return best_candidate, warnings

    def _candidate_text_score(self, candidate: Tag) -> int:
        score = len(self._extract_visible_text(candidate))
        # Prefer semantic content roots over the full document to avoid
        # folding head/title content into the extracted job text.
        if candidate.name == "[document]":
            score -= 1_000
        return score

    def _extract_visible_text(self, root: Tag) -> str:
        lines: list[str] = []
        previous_line: str | None = None

        for text in root.stripped_strings:
            normalized = self._normalize_whitespace(text)
            if len(normalized) < 2:
                continue
            if normalized == previous_line:
                continue
            lines.append(normalized)
            previous_line = normalized

        return "\n".join(lines)

    def _normalize_whitespace(self, text: str) -> str:
        return re.sub(r"\s+", " ", text).strip()
