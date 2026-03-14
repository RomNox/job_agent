from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

from app.dependencies import get_claude_service
from app.main import app


class MockClaudeService:
    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: dict | None = None,
        skills: list[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict:
        assert prompt == "Find Ausbildung positions in Berlin"
        assert system_prompt is not None
        assert context == {"location": "Berlin"}
        assert skills == ["match-candidate"]
        assert max_tokens == 1024

        return {
            "text": "Mocked agent response",
            "model": "mock-claude",
            "usage": {"input_tokens": 10, "output_tokens": 20},
        }


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    app.dependency_overrides[get_claude_service] = lambda: MockClaudeService()

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def test_run_job_agent_endpoint_returns_mocked_response(client: TestClient) -> None:
    response = client.post(
        "/api/v1/agent/run",
        json={
            "prompt": "Find Ausbildung positions in Berlin",
            "context": {"location": "Berlin"},
            "skills": ["match-candidate"],
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "text": "Mocked agent response",
        "model": "mock-claude",
        "skills_used": ["match-candidate"],
        "usage": {"input_tokens": 10, "output_tokens": 20},
    }
