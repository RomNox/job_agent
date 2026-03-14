from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    payload = response.json()

    assert payload["status"] == "ok"
    assert "environment" in payload


def test_info_endpoint_lists_skills() -> None:
    response = client.get("/api/v1/info")

    assert response.status_code == 200
    payload = response.json()

    assert payload["service"] == "job-agent"
    assert "environment" in payload
    assert payload["available_skills"] == [
        "analyze-job-posting",
        "generate-anschreiben",
        "match-candidate",
        "prepare-application",
        "tailor-cv",
    ]
