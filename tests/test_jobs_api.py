from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

from app.dependencies import get_claude_service
from app.main import app


class MockClaudeAnalysisService:
    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: dict | None = None,
        skills: list[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict:
        assert "Softwareentwickler" in prompt
        assert system_prompt is not None
        assert context == {"source_url": "https://example.com/job"}
        assert skills == ["analyze-job-posting"]
        assert max_tokens == 1200

        return {
            "text": """
            {
              "title": "Softwareentwickler Backend",
              "employer": "Beispiel GmbH",
              "location": "Berlin",
              "employment_type": "full-time",
              "language": "de",
              "requirements": ["Python", "FastAPI", "Deutsch C1"],
              "summary": "Backend role focused on Python services in Berlin.",
              "missing_information": ["salary range", "application deadline"]
            }
            """.strip(),
            "model": "mock-claude",
            "usage": {"input_tokens": 42, "output_tokens": 84},
        }


class MissingApiKeyClaudeService:
    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: dict | None = None,
        skills: list[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict:
        _ = (prompt, system_prompt, context, skills, max_tokens)
        raise RuntimeError("ANTHROPIC_API_KEY is not configured.")


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    app.dependency_overrides[get_claude_service] = lambda: MockClaudeAnalysisService()

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def test_analyze_job_posting_endpoint_returns_structured_analysis(
    client: TestClient,
) -> None:
    response = client.post(
        "/api/v1/jobs/analyze",
        json={
            "raw_text": (
                "Softwareentwickler Backend (m/w/d) bei Beispiel GmbH in Berlin. "
                "Wir suchen Erfahrung mit Python, FastAPI und Deutsch C1."
            ),
            "source_url": "https://example.com/job",
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "title": "Softwareentwickler Backend",
        "employer": "Beispiel GmbH",
        "location": "Berlin",
        "employment_type": "full-time",
        "language": "de",
        "requirements": ["Python", "FastAPI", "Deutsch C1"],
        "summary": "Backend role focused on Python services in Berlin.",
        "missing_information": ["salary range", "application deadline"],
    }


def test_analyze_job_posting_returns_503_when_api_key_is_missing() -> None:
    app.dependency_overrides[get_claude_service] = lambda: MissingApiKeyClaudeService()

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/jobs/analyze",
                json={"raw_text": "Ausbildung als Fachinformatiker in Hamburg."},
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 503
    assert response.json() == {
        "detail": "ANTHROPIC_API_KEY is not configured."
    }


class MatchWorkflowClaudeService:
    def __init__(self) -> None:
        self.skills_seen: list[list[str] | None] = []

    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: dict | None = None,
        skills: list[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict:
        self.skills_seen.append(skills)

        if skills == ["analyze-job-posting"]:
            assert "Data Analyst" in prompt
            assert context == {"source_url": "https://example.com/data-analyst"}
            return {
                "text": """
                {
                  "title": "Data Analyst",
                  "employer": "Berlin Data GmbH",
                  "location": "Berlin",
                  "employment_type": "full-time",
                  "language": "de",
                  "requirements": ["SQL", "Excel", "Deutsch B2"],
                  "summary": "Entry-level data analyst role in Berlin.",
                  "missing_information": ["salary range"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 30, "output_tokens": 60},
            }

        if skills == ["match-candidate"]:
            assert system_prompt is not None
            assert context is not None
            assert context["candidate_profile"]["full_name"] == "Anna Schmidt"
            assert context["job_posting"]["title"] == "Data Analyst"
            assert max_tokens == 1200
            return {
                "text": """
                {
                  "match_score": 82,
                  "summary": "The candidate is a strong entry-level match for the role.",
                  "strengths": ["SQL basics", "Relevant motivation", "Berlin location match"],
                  "gaps": ["Limited Excel project evidence"],
                  "recommended_next_steps": ["Add data project examples", "Tailor the CV summary"]
                }
                """.strip(),
                "model": "mock-claude",
                "usage": {"input_tokens": 45, "output_tokens": 70},
            }

        raise AssertionError(f"Unexpected skills payload: {skills}")


def test_match_candidate_endpoint_reuses_job_analysis_for_raw_text() -> None:
    mock_service = MatchWorkflowClaudeService()
    app.dependency_overrides[get_claude_service] = lambda: mock_service

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/jobs/match",
                json={
                    "candidate_profile": {
                        "full_name": "Anna Schmidt",
                        "summary": "Junior analyst with SQL fundamentals.",
                        "skills": ["SQL", "Python"],
                        "desired_roles": ["Data Analyst"],
                        "desired_locations": ["Berlin"],
                        "languages": ["German B2", "English C1"],
                    },
                    "raw_text": (
                        "Data Analyst (m/w/d) bei Berlin Data GmbH in Berlin. "
                        "Kenntnisse in SQL, Excel und Deutsch B2 erforderlich."
                    ),
                    "source_url": "https://example.com/data-analyst",
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {
        "match_score": 82.0,
        "summary": "The candidate is a strong entry-level match for the role.",
        "strengths": ["SQL basics", "Relevant motivation", "Berlin location match"],
        "gaps": ["Limited Excel project evidence"],
        "recommended_next_steps": ["Add data project examples", "Tailor the CV summary"],
    }
    assert mock_service.skills_seen == [["analyze-job-posting"], ["match-candidate"]]


def test_match_candidate_endpoint_returns_503_when_api_key_is_missing() -> None:
    app.dependency_overrides[get_claude_service] = lambda: MissingApiKeyClaudeService()

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/jobs/match",
                json={
                    "candidate_profile": {
                        "full_name": "Anna Schmidt",
                        "skills": ["SQL"],
                    },
                    "job_posting": {
                        "title": "Data Analyst",
                        "employer": "Berlin Data GmbH",
                        "location": "Berlin",
                        "employment_type": "full-time",
                        "language": "de",
                        "requirements": ["SQL"],
                        "summary": "Data analyst role.",
                        "missing_information": [],
                    },
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 503
    assert response.json() == {
        "detail": "ANTHROPIC_API_KEY is not configured."
    }
