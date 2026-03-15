from pydantic import BaseModel, Field


class JobSearchResult(BaseModel):
    id: str
    source: str
    external_id: str | None = None
    title: str
    company: str | None = None
    location: str | None = None
    salary: str | None = None
    employment_type: str | None = None
    posted_at: str | None = None
    url: str
    snippet: str | None = None
    fit_score: float | None = None
    fit_reason: str | None = None


class JobSearchResponse(BaseModel):
    source: str
    count: int
    results: list[JobSearchResult] = Field(default_factory=list)
