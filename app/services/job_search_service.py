from __future__ import annotations

import json
from dataclasses import dataclass
from threading import Lock
from time import monotonic

from app.integrations.jooble.adapter import JoobleAdapter
from app.models.search_query import SearchQuery
from app.models.search_result import JobSearchResult


@dataclass
class _CacheEntry:
    expires_at: float
    results: list[JobSearchResult]


class JobSearchService:
    def __init__(
        self,
        jooble_adapter: JoobleAdapter,
        cache_ttl_seconds: int = 180,
    ) -> None:
        self._jooble_adapter = jooble_adapter
        self._cache_ttl_seconds = cache_ttl_seconds
        self._cache: dict[str, _CacheEntry] = {}
        self._cache_lock = Lock()

    async def search_jobs(self, query: SearchQuery) -> list[JobSearchResult]:
        if query.source != "jooble":
            raise ValueError(f"Unsupported search source: {query.source}.")

        cache_key = self._build_cache_key(query)
        cached_results = self._get_cached_results(cache_key)
        if cached_results is not None:
            return cached_results

        results = await self._jooble_adapter.search_jobs(query)
        filtered_results = self._filter_results(results, query)
        self._set_cached_results(cache_key, filtered_results)
        return self._clone_results(filtered_results)

    def _build_cache_key(self, query: SearchQuery) -> str:
        return json.dumps(query.model_dump(mode="json"), sort_keys=True)

    def _get_cached_results(self, cache_key: str) -> list[JobSearchResult] | None:
        with self._cache_lock:
            self._prune_expired_cache_entries()
            cache_entry = self._cache.get(cache_key)
            if cache_entry is None:
                return None

            return self._clone_results(cache_entry.results)

    def _set_cached_results(
        self,
        cache_key: str,
        results: list[JobSearchResult],
    ) -> None:
        with self._cache_lock:
            self._prune_expired_cache_entries()
            self._cache[cache_key] = _CacheEntry(
                expires_at=monotonic() + self._cache_ttl_seconds,
                results=self._clone_results(results),
            )

    def _prune_expired_cache_entries(self) -> None:
        now = monotonic()
        expired_keys = [
            cache_key
            for cache_key, cache_entry in self._cache.items()
            if cache_entry.expires_at <= now
        ]
        for cache_key in expired_keys:
            self._cache.pop(cache_key, None)

    def _filter_results(
        self,
        results: list[JobSearchResult],
        query: SearchQuery,
    ) -> list[JobSearchResult]:
        filtered_results = list(results)

        if query.remote_only:
            filtered_results = [
                result for result in filtered_results if _looks_remote(result)
            ]

        if query.employment_type:
            filtered_results = [
                result
                for result in filtered_results
                if _employment_type_matches(
                    candidate=result.employment_type,
                    expected=query.employment_type,
                )
            ]

        return filtered_results[: query.results_per_page]

    def _clone_results(
        self,
        results: list[JobSearchResult],
    ) -> list[JobSearchResult]:
        return [result.model_copy(deep=True) for result in results]


def _looks_remote(result: JobSearchResult) -> bool:
    remote_markers = ("remote", "home office", "homeoffice", "remote-first")
    haystack = " ".join(
        part.lower()
        for part in (result.title, result.location, result.snippet)
        if isinstance(part, str)
    )
    return any(marker in haystack for marker in remote_markers)


def _employment_type_matches(candidate: str | None, expected: str) -> bool:
    if not candidate:
        return False

    normalized_candidate = candidate.strip().lower()
    normalized_expected = expected.strip().lower()
    return (
        normalized_candidate == normalized_expected
        or normalized_expected in normalized_candidate
        or normalized_candidate in normalized_expected
    )
