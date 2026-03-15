from __future__ import annotations

from app.integrations.jooble.client import JoobleClient
from app.integrations.jooble.normalizer import normalize_jooble_response
from app.models.search_query import SearchQuery
from app.models.search_result import JobSearchResult


class JoobleAdapter:
    def __init__(self, client: JoobleClient) -> None:
        self._client = client

    async def search_jobs(self, query: SearchQuery) -> list[JobSearchResult]:
        payload = await self._client.search_jobs(query)
        return normalize_jooble_response(payload)
