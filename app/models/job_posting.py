from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class JobPosting(BaseModel):
    id: str | None = Field(default=None, description="Internal or external posting ID.")
    title: str
    employer: str
    location: str
    employment_type: str = Field(default="full-time")
    description: str
    requirements: list[str] = Field(default_factory=list)
    source_url: str | None = None
    posted_at: datetime | None = None
    language: str = Field(default="de")
