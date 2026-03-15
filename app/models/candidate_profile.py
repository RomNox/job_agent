from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


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


class UpsertCandidateProfileRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    full_name: str
    email: str = ""
    phone: str = ""
    location: str = ""
    target_role: str = ""
    years_of_experience: int | None = Field(default=None, ge=0)
    skills: str = ""
    languages: str = ""
    work_authorization: str = ""
    remote_preference: str = ""
    preferred_locations: str = ""
    salary_expectation: str = ""
    professional_summary: str = ""
    cv_text: str = ""

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        if not value:
            raise ValueError("Full name is required.")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if not value:
            return ""

        normalized = value.strip().lower()
        if "@" not in normalized:
            raise ValueError("Enter a valid email address.")

        local_part, _, domain = normalized.partition("@")
        if not local_part or not domain or "." not in domain:
            raise ValueError("Enter a valid email address.")

        return normalized


class CandidateProfileResponse(BaseModel):
    user_id: str
    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    target_role: str = ""
    years_of_experience: int | None = None
    skills: str = ""
    languages: str = ""
    work_authorization: str = ""
    remote_preference: str = ""
    preferred_locations: str = ""
    salary_expectation: str = ""
    professional_summary: str = ""
    cv_text: str = ""
    created_at: datetime | None = None
    updated_at: datetime | None = None


class CandidateProfileRecord(CandidateProfileResponse):
    created_at: datetime
    updated_at: datetime
