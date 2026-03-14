from pydantic import BaseModel, Field


class JobParsingRequest(BaseModel):
    url: str = Field(..., min_length=1, description="The URL of the job posting page.")


class JobParsingResponse(BaseModel):
    source_url: str
    page_title: str | None = None
    raw_text: str
    detected_source: str | None = None
    extraction_warnings: list[str] = Field(default_factory=list)
