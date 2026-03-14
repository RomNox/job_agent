from pydantic import BaseModel, Field, model_validator

from app.models.candidate_profile import CandidateProfile
from app.models.job_analysis import JobAnalysisResponse


class CVTailoringRequest(BaseModel):
    candidate_profile: CandidateProfile
    job_posting: JobAnalysisResponse | None = Field(
        default=None,
        description="Structured job analysis payload, for example from /api/v1/jobs/analyze.",
    )
    raw_text: str | None = Field(
        default=None,
        min_length=1,
        description="Raw job posting text to analyze before tailoring the CV.",
    )
    source_url: str | None = Field(
        default=None,
        description="Optional source URL when raw job posting text is provided.",
    )

    @model_validator(mode="after")
    def validate_job_input(self) -> "CVTailoringRequest":
        has_structured_job = self.job_posting is not None
        has_raw_text = self.raw_text is not None

        if has_structured_job == has_raw_text:
            raise ValueError("Provide exactly one of job_posting or raw_text.")

        if self.source_url is not None and not has_raw_text:
            raise ValueError("source_url can only be used with raw_text.")

        return self


class CVTailoringResponse(BaseModel):
    tailored_summary: str
    highlighted_skills: list[str] = Field(default_factory=list)
    suggested_experience_points: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
