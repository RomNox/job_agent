from pydantic import BaseModel, Field


class JobAnalysisRequest(BaseModel):
    raw_text: str = Field(
        ...,
        min_length=1,
        description="The raw text of a job or Ausbildung posting.",
    )
    source_url: str | None = Field(
        default=None,
        description="Optional source URL for the posting.",
    )


class JobAnalysisResponse(BaseModel):
    title: str
    employer: str
    location: str
    employment_type: str
    language: str
    requirements: list[str] = Field(default_factory=list)
    summary: str
    missing_information: list[str] = Field(default_factory=list)
