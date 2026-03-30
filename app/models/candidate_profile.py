from __future__ import annotations

from datetime import datetime
from typing import Any

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


class ResumeAddress(BaseModel):
    street: str = ""
    city: str = ""
    postal_code: str = ""
    country: str = ""


class ResumeUserProfile(BaseModel):
    first_name: str = ""
    last_name: str = ""
    birth_year: int | None = Field(default=None, ge=1900, le=2100)
    email: str = ""
    phone: str = ""
    address: ResumeAddress = Field(default_factory=ResumeAddress)


class ResumeExperienceEntry(BaseModel):
    job_title: str = ""
    company: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    responsibilities: str = ""
    technologies_used: list[str] = Field(default_factory=list)

    @field_validator("technologies_used", mode="before")
    @classmethod
    def validate_technologies_used(cls, value: Any) -> list[str]:
        if value is None:
            return []
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        if isinstance(value, list):
            return [
                str(item).strip()
                for item in value
                if isinstance(item, str) and item.strip()
            ]
        raise ValueError("Technologies used must be provided as a list of strings.")


class ResumeEducationEntry(BaseModel):
    institution: str = ""
    degree: str = ""
    field_of_study: str = ""
    start_year: int | None = Field(default=None, ge=1900, le=2100)
    end_year: int | None = Field(default=None, ge=1900, le=2100)


class ResumeLanguageEntry(BaseModel):
    language: str = ""
    level: str = ""


class ResumePreferences(BaseModel):
    work_authorization_status: str = ""
    years_of_experience: int | None = Field(default=None, ge=0)
    preferred_locations: list[str] = Field(default_factory=list)
    work_mode: str = ""
    salary_expectation: str = ""
    availability: str = ""

    @field_validator("preferred_locations", mode="before")
    @classmethod
    def validate_preferred_locations(cls, value: Any) -> list[str]:
        if value is None:
            return []
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        if isinstance(value, list):
            return [
                str(item).strip()
                for item in value
                if isinstance(item, str) and item.strip()
            ]
        raise ValueError("Preferred locations must be provided as a list of strings.")


class ResumeProfile(BaseModel):
    professional_title: str = ""
    summary: str = ""
    experience: list[ResumeExperienceEntry] = Field(default_factory=list)
    education: list[ResumeEducationEntry] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    languages: list[ResumeLanguageEntry] = Field(default_factory=list)
    preferences: ResumePreferences = Field(default_factory=ResumePreferences)

    @field_validator("skills", mode="before")
    @classmethod
    def validate_skills(cls, value: Any) -> list[str]:
        if value is None:
            return []
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        if isinstance(value, list):
            return [
                str(item).strip()
                for item in value
                if isinstance(item, str) and item.strip()
            ]
        raise ValueError("Skills must be provided as a list of strings.")


class UpsertCandidateProfileRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    full_name: str = ""
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
    user: ResumeUserProfile | None = None
    resume: ResumeProfile | None = None

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
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
    user: ResumeUserProfile = Field(default_factory=ResumeUserProfile)
    resume: ResumeProfile = Field(default_factory=ResumeProfile)
    created_at: datetime | None = None
    updated_at: datetime | None = None


class CandidateProfileRecord(CandidateProfileResponse):
    created_at: datetime
    updated_at: datetime
