from pydantic import BaseModel, Field


class CandidateProfile(BaseModel):
    full_name: str
    email: str | None = None
    phone: str | None = None
    summary: str = ""
    skills: list[str] = Field(default_factory=list)
    experience_years: int | None = None
    desired_roles: list[str] = Field(default_factory=list)
    desired_locations: list[str] = Field(default_factory=lambda: ["Germany"])
    languages: list[str] = Field(default_factory=list)
    education: list[str] = Field(default_factory=list)
