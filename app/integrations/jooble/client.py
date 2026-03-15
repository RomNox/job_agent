from __future__ import annotations

import httpx

from app.models.search_query import SearchQuery


class JoobleClient:
    def __init__(self, api_key: str | None, timeout_seconds: float = 10.0) -> None:
        self._api_key = api_key
        self._timeout = httpx.Timeout(timeout_seconds)

    async def search_jobs(self, query: SearchQuery) -> dict:
        if not self._api_key:
            raise RuntimeError("JOOBLE_API_KEY is not configured.")

        payload = {
            "keywords": query.keywords,
            "location": query.location or "",
            "page": query.page,
        }

        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.post(
                    f"https://de.jooble.org/api/{self._api_key}",
                    json=payload,
                )
                response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise ValueError(
                f"Jooble API request failed with status {exc.response.status_code}."
            ) from exc
        except httpx.HTTPError as exc:
            raise ValueError("Unable to reach the Jooble API.") from exc

        try:
            response_payload = response.json()
        except ValueError as exc:
            raise ValueError("Jooble API returned an invalid JSON payload.") from exc

        if not isinstance(response_payload, dict):
            raise ValueError("Jooble API returned an unexpected response payload.")

        return response_payload
