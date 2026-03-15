from __future__ import annotations

from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, Field, field_validator


class SearchSelectedJob(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    id: str = Field(..., min_length=1)
    source: str = Field(..., min_length=1)
    external_id: str | None = None
    title: str = Field(..., min_length=1)
    company: str | None = None
    location: str | None = None
    salary: str | None = None
    employment_type: str | None = None
    posted_at: str | None = None
    url: str = Field(..., min_length=1)
    snippet: str | None = None

    @field_validator("url")
    @classmethod
    def validate_url(cls, value: str) -> str:
        parsed = urlparse(value)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("url must be a valid http or https URL.")
        return value
