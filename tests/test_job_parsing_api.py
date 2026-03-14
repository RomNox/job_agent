import httpx
from fastapi.testclient import TestClient

from app.dependencies import get_job_parsing_service
from app.main import app
from app.services.job_parsing_service import JobParsingService


def _override_job_parsing_service(
    transport: httpx.AsyncBaseTransport,
) -> JobParsingService:
    return JobParsingService(transport=transport)


def test_parse_job_posting_page_success() -> None:
    html = """
    <html>
      <head>
        <title>Backend Engineer at Example GmbH</title>
        <style>.hidden { display: none; }</style>
      </head>
      <body>
        <header>Home Jobs Login</header>
        <main>
          <h1>Backend Engineer (m/w/d)</h1>
          <p>Example GmbH in Berlin is hiring for a backend engineering role.</p>
          <ul>
            <li>Python</li>
            <li>FastAPI</li>
            <li>Deutsch C1</li>
          </ul>
        </main>
        <script>console.log("tracking");</script>
      </body>
    </html>
    """.strip()

    def handler(request: httpx.Request) -> httpx.Response:
        assert str(request.url) == "https://example.com/jobs/backend-engineer"
        return httpx.Response(
            status_code=200,
            text=html,
            headers={"Content-Type": "text/html; charset=utf-8"},
            request=request,
        )

    transport = httpx.MockTransport(handler)
    app.dependency_overrides[get_job_parsing_service] = lambda: _override_job_parsing_service(
        transport
    )

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/jobs/parse",
                json={"url": "https://example.com/jobs/backend-engineer"},
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {
        "source_url": "https://example.com/jobs/backend-engineer",
        "page_title": "Backend Engineer at Example GmbH",
        "raw_text": (
            "Backend Engineer (m/w/d)\n"
            "Example GmbH in Berlin is hiring for a backend engineering role.\n"
            "Python\n"
            "FastAPI\n"
            "Deutsch C1"
        ),
        "detected_source": None,
        "extraction_warnings": [],
    }


def test_parse_job_posting_page_returns_502_when_fetch_fails() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("connection failed", request=request)

    transport = httpx.MockTransport(handler)
    app.dependency_overrides[get_job_parsing_service] = lambda: _override_job_parsing_service(
        transport
    )

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/jobs/parse",
                json={"url": "https://example.com/unreachable-job"},
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 502
    assert response.json() == {
        "detail": "Failed to fetch job posting page from 'https://example.com/unreachable-job'."
    }


def test_parse_job_posting_page_detects_known_source() -> None:
    html = """
    <html>
      <head><title>LinkedIn Job Posting</title></head>
      <body>
        <article>
          <h1>Product Manager</h1>
          <p>Join Example AG in Munich.</p>
          <p>Requirements include communication and ownership.</p>
        </article>
      </body>
    </html>
    """.strip()

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(status_code=200, text=html, request=request)

    transport = httpx.MockTransport(handler)
    app.dependency_overrides[get_job_parsing_service] = lambda: _override_job_parsing_service(
        transport
    )

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/jobs/parse",
                json={"url": "https://www.linkedin.com/jobs/view/12345"},
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    payload = response.json()
    assert payload["source_url"] == "https://www.linkedin.com/jobs/view/12345"
    assert payload["page_title"] == "LinkedIn Job Posting"
    assert payload["detected_source"] == "linkedin"
    assert "Product Manager" in payload["raw_text"]
