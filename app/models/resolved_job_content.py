from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ResolvedJobContent(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(..., min_length=1)
    company: str | None = None
    location: str | None = None
    salary: str | None = None
    employment_type: str | None = None
    posted_at: str | None = None
    source: str = Field(..., min_length=1)
    source_url: str = Field(..., min_length=1)
    raw_text: str = Field(..., min_length=1)
    content_quality: Literal["full", "partial", "preview"]
    fetch_method: Literal["page_parse", "search_preview"]
    resolution_notes: str | None = None
