import asyncio
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

from app.dependencies import (
    get_job_content_resolution_service,
    get_job_search_service,
)
from app.main import app
from app.models.job_parsing import JobParsingResponse
from app.models.search_query import SearchQuery
from app.models.search_result import JobSearchResult
from app.models.search_selected_job import SearchSelectedJob
from app.services.job_content_resolution_service import JobContentResolutionService
from app.services.job_search_service import JobSearchService


class MockJobSearchService:
    def __init__(self) -> None:
        self.queries: list[SearchQuery] = []

    async def search_jobs(self, query: SearchQuery) -> list[JobSearchResult]:
        self.queries.append(query)
        return [
            JobSearchResult(
                id="jooble:123",
                source="jooble",
                external_id="123",
                title="Python Developer",
                company="Berlin Tech GmbH",
                location="Berlin",
                salary="EUR 70,000",
                employment_type="Full-time",
                posted_at="2026-03-10T12:00:00Z",
                url="https://example.com/jobs/python-developer",
                snippet="Build backend APIs with Python and FastAPI.",
            ),
            JobSearchResult(
                id="jooble:456",
                source="jooble",
                external_id="456",
                title="Senior Backend Engineer",
                company="Remote Europe AG",
                location="Berlin / Remote",
                salary=None,
                employment_type="Full-time",
                posted_at=None,
                url="https://example.com/jobs/backend-engineer",
                snippet="Lead service development for a distributed product team.",
            ),
        ]


class MissingApiKeyJobSearchService:
    async def search_jobs(self, query: SearchQuery) -> list[JobSearchResult]:
        _ = query
        raise RuntimeError("JOOBLE_API_KEY is not configured.")


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    mock_service = MockJobSearchService()
    app.dependency_overrides[get_job_search_service] = lambda: mock_service

    with TestClient(app) as test_client:
        test_client.app.state.mock_job_search_service = mock_service
        yield test_client

    app.dependency_overrides.clear()


def test_search_jobs_endpoint_returns_normalized_results(
    client: TestClient,
) -> None:
    response = client.post(
        "/api/v1/search/jobs",
        json={
            "keywords": "python developer",
            "location": "Berlin",
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "source": "jooble",
        "count": 2,
        "results": [
            {
                "id": "jooble:123",
                "source": "jooble",
                "external_id": "123",
                "title": "Python Developer",
                "company": "Berlin Tech GmbH",
                "location": "Berlin",
                "salary": "EUR 70,000",
                "employment_type": "Full-time",
                "posted_at": "2026-03-10T12:00:00Z",
                "url": "https://example.com/jobs/python-developer",
                "snippet": "Build backend APIs with Python and FastAPI.",
                "fit_score": None,
                "fit_reason": None,
            },
            {
                "id": "jooble:456",
                "source": "jooble",
                "external_id": "456",
                "title": "Senior Backend Engineer",
                "company": "Remote Europe AG",
                "location": "Berlin / Remote",
                "salary": None,
                "employment_type": "Full-time",
                "posted_at": None,
                "url": "https://example.com/jobs/backend-engineer",
                "snippet": "Lead service development for a distributed product team.",
                "fit_score": None,
                "fit_reason": None,
            },
        ],
    }

    mock_service = client.app.state.mock_job_search_service
    assert len(mock_service.queries) == 1
    assert mock_service.queries[0].keywords == "python developer"
    assert mock_service.queries[0].location == "Berlin"
    assert mock_service.queries[0].source == "jooble"


def test_search_jobs_endpoint_returns_503_when_api_key_is_missing() -> None:
    app.dependency_overrides[get_job_search_service] = (
        lambda: MissingApiKeyJobSearchService()
    )

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/search/jobs",
                json={"keywords": "python developer", "location": "Berlin"},
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 503
    assert response.json() == {
        "detail": "JOOBLE_API_KEY is not configured."
    }


class CountingJoobleAdapter:
    def __init__(self) -> None:
        self.calls = 0

    async def search_jobs(self, query: SearchQuery) -> list[JobSearchResult]:
        self.calls += 1
        _ = query
        return [
            JobSearchResult(
                id="jooble:cached",
                source="jooble",
                external_id="cached",
                title="Cached Python Developer",
                company="Cache GmbH",
                location="Berlin",
                salary=None,
                employment_type="Full-time",
                posted_at=None,
                url="https://example.com/jobs/cached",
                snippet="Cached result payload.",
            )
        ]


def test_job_search_service_caches_identical_queries() -> None:
    adapter = CountingJoobleAdapter()
    service = JobSearchService(jooble_adapter=adapter, cache_ttl_seconds=60)
    query = SearchQuery(keywords="python developer", location="Berlin")

    first_result = asyncio.run(service.search_jobs(query))
    second_result = asyncio.run(service.search_jobs(query))

    assert adapter.calls == 1
    assert first_result == second_result
    assert first_result is not second_result
    assert first_result[0] is not second_result[0]


class SuccessfulParsingService:
    async def parse_url(self, url: str) -> JobParsingResponse:
        assert url == "https://jooble.org/jdp/python-role"
        return JobParsingResponse(
            source_url="https://company.example/jobs/python-role",
            page_title="Python Developer | Company Example",
            raw_text=(
                "Python Developer\n"
                "Company Example\n"
                "Berlin\n"
                "Build backend services with Python, FastAPI, and PostgreSQL."
            ),
            detected_source="company-careers",
            extraction_warnings=[],
        )


class FailingParsingService:
    async def parse_url(self, url: str) -> JobParsingResponse:
        _ = url
        raise ValueError("Failed to fetch job posting page.")


def test_resolve_job_endpoint_returns_full_content_when_parsing_succeeds() -> None:
    service = JobContentResolutionService(job_parsing_service=SuccessfulParsingService())
    app.dependency_overrides[get_job_content_resolution_service] = lambda: service

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/search/resolve-job",
                json={
                    "id": "jooble:123",
                    "source": "jooble",
                    "external_id": "123",
                    "title": "Python Developer",
                    "company": "Company Example",
                    "location": "Berlin",
                    "salary": "EUR 80,000",
                    "employment_type": "Full-time",
                    "posted_at": "2026-03-10",
                    "url": "https://jooble.org/jdp/python-role",
                    "snippet": "Python and FastAPI role in Berlin.",
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {
        "title": "Python Developer",
        "company": "Company Example",
        "location": "Berlin",
        "salary": "EUR 80,000",
        "employment_type": "Full-time",
        "posted_at": "2026-03-10",
        "source": "jooble",
        "source_url": "https://company.example/jobs/python-role",
        "raw_text": (
            "Python Developer\n"
            "Company Example\n"
            "Berlin\n"
            "Build backend services with Python, FastAPI, and PostgreSQL."
        ),
        "content_quality": "full",
        "fetch_method": "page_parse",
        "resolution_notes": "Page title: Python Developer | Company Example",
    }


def test_resolve_job_endpoint_returns_preview_fallback_when_parsing_fails() -> None:
    service = JobContentResolutionService(job_parsing_service=FailingParsingService())
    app.dependency_overrides[get_job_content_resolution_service] = lambda: service

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/search/resolve-job",
                json={
                    "id": "jooble:456",
                    "source": "jooble",
                    "external_id": "456",
                    "title": "Backend Engineer",
                    "company": "Remote GmbH",
                    "location": "Berlin / Remote",
                    "salary": None,
                    "employment_type": "Full-time",
                    "posted_at": "2026-03-11",
                    "url": "https://jooble.org/away/backend-role",
                    "snippet": "<p>Build APIs with Python and distributed systems.</p>",
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {
        "title": "Backend Engineer",
        "company": "Remote GmbH",
        "location": "Berlin / Remote",
        "salary": None,
        "employment_type": "Full-time",
        "posted_at": "2026-03-11",
        "source": "jooble",
        "source_url": "https://jooble.org/away/backend-role",
        "raw_text": (
            "Job title: Backend Engineer\n"
            "Company: Remote GmbH\n"
            "Location: Berlin / Remote\n"
            "Salary: Not provided\n"
            "Employment type: Full-time\n"
            "Posted at: 2026-03-11\n"
            "Source: jooble\n"
            "Source URL: https://jooble.org/away/backend-role\n"
            "\n"
            "Job description preview:\n"
            "Build APIs with Python and distributed systems."
        ),
        "content_quality": "preview",
        "fetch_method": "search_preview",
        "resolution_notes": (
            "Using search preview because the original job page could not be fully fetched."
        ),
    }


def test_job_content_resolution_service_errors_only_when_fallback_is_insufficient() -> None:
    service = JobContentResolutionService(job_parsing_service=FailingParsingService())
    selected_job = SearchSelectedJob.model_construct(
        id="jooble:789",
        source="jooble",
        external_id=None,
        title="",
        company=None,
        location=None,
        salary=None,
        employment_type=None,
        posted_at=None,
        url="https://jooble.org/jdp/empty-role",
        snippet=None,
    )

    with pytest.raises(
        ValueError,
        match="Not enough search data to construct fallback job content.",
    ):
        asyncio.run(service.resolve_selected_job(selected_job))


def test_resolve_job_endpoint_returns_422_for_invalid_url() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/search/resolve-job",
            json={
                "id": "jooble:999",
                "source": "jooble",
                "title": "Broken role",
                "url": "not-a-url",
            },
        )

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "url"]
