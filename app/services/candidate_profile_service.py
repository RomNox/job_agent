from __future__ import annotations

from datetime import UTC, datetime

from app.models.candidate_profile import (
    CandidateProfileRecord,
    CandidateProfileResponse,
    ResumeAddress,
    ResumeLanguageEntry,
    ResumePreferences,
    ResumeProfile,
    ResumeUserProfile,
    UpsertCandidateProfileRequest,
)
from app.models.user import User
from app.repositories.candidate_profile_repository import CandidateProfileRepository


class CandidateProfileService:
    def __init__(self, repository: CandidateProfileRepository) -> None:
        self._repository = repository

    def get_profile_for_user(self, user: User) -> CandidateProfileResponse:
        existing_profile = self._repository.get_by_user_id(user.id)
        if existing_profile is None:
            default_user_profile = _default_user_profile(user)
            default_resume = ResumeProfile()
            default_resume = default_resume.model_copy(
                update={
                    "summary": _build_resume_summary(
                        user_profile=default_user_profile,
                        resume=default_resume,
                    )
                }
            )
            return CandidateProfileResponse(
                user_id=user.id,
                full_name=_compose_full_name(
                    default_user_profile.first_name,
                    default_user_profile.last_name,
                ),
                email=default_user_profile.email,
                cv_text=_render_resume_text(default_user_profile, default_resume),
                user=default_user_profile,
                resume=default_resume,
            )

        normalized_profile = _normalize_record(existing_profile, auth_user=user)
        return CandidateProfileResponse.model_validate(normalized_profile.model_dump())

    def upsert_profile_for_user(
        self,
        user: User,
        payload: UpsertCandidateProfileRequest,
    ) -> CandidateProfileResponse:
        existing_profile = self._repository.get_by_user_id(user.id)
        normalized_existing = (
            _normalize_record(existing_profile, auth_user=user)
            if existing_profile is not None
            else None
        )
        now = datetime.now(UTC)

        base_user_profile = (
            normalized_existing.user
            if normalized_existing is not None
            else _default_user_profile(user)
        )
        base_resume = (
            normalized_existing.resume if normalized_existing is not None else ResumeProfile()
        )

        next_user_profile = (
            _apply_nested_user_payload(payload=payload, auth_user=user)
            if payload.user is not None
            else _apply_flat_user_payload(
                base_user_profile=base_user_profile,
                payload=payload,
                auth_user=user,
            )
        )
        next_resume = (
            _apply_nested_resume_payload(payload=payload, base_resume=base_resume)
            if payload.resume is not None
            else _apply_flat_resume_payload(base_resume=base_resume, payload=payload)
        )

        summary = next_resume.summary.strip() or payload.professional_summary.strip()
        if not summary:
            summary = _build_resume_summary(
                user_profile=next_user_profile,
                resume=next_resume,
            )
        next_resume = next_resume.model_copy(update={"summary": summary})

        cv_text = payload.cv_text.strip() or _render_resume_text(
            next_user_profile,
            next_resume,
        )

        profile = CandidateProfileRecord(
            user_id=user.id,
            full_name=_compose_full_name(
                next_user_profile.first_name,
                next_user_profile.last_name,
            )
            or payload.full_name.strip()
            or user.full_name,
            email=next_user_profile.email or payload.email.strip() or user.email,
            phone=next_user_profile.phone,
            location=_format_location(next_user_profile.address),
            target_role=next_resume.professional_title,
            years_of_experience=next_resume.preferences.years_of_experience,
            skills=_join_csv(next_resume.skills),
            languages=_format_languages(next_resume.languages),
            work_authorization=next_resume.preferences.work_authorization_status,
            remote_preference=next_resume.preferences.work_mode,
            preferred_locations=_join_csv(next_resume.preferences.preferred_locations),
            salary_expectation=next_resume.preferences.salary_expectation,
            professional_summary=summary,
            cv_text=cv_text,
            user=next_user_profile,
            resume=next_resume,
            created_at=existing_profile.created_at if existing_profile else now,
            updated_at=now,
        )
        saved_profile = self._repository.upsert(profile)
        normalized_saved_profile = _normalize_record(saved_profile, auth_user=user)
        return CandidateProfileResponse.model_validate(
            normalized_saved_profile.model_dump()
        )


def _normalize_record(
    profile: CandidateProfileRecord,
    *,
    auth_user: User,
) -> CandidateProfileRecord:
    normalized_user = _normalize_user_profile(profile=profile, auth_user=auth_user)
    normalized_resume = _normalize_resume_profile(profile)

    summary = normalized_resume.summary.strip() or profile.professional_summary.strip()
    if not summary:
        summary = _build_resume_summary(
            user_profile=normalized_user,
            resume=normalized_resume,
        )

    normalized_resume = normalized_resume.model_copy(update={"summary": summary})
    cv_text = profile.cv_text.strip() or _render_resume_text(
        normalized_user,
        normalized_resume,
    )

    return CandidateProfileRecord(
        user_id=profile.user_id,
        full_name=_compose_full_name(
            normalized_user.first_name,
            normalized_user.last_name,
        )
        or profile.full_name
        or auth_user.full_name,
        email=normalized_user.email or profile.email or auth_user.email,
        phone=normalized_user.phone or profile.phone,
        location=_format_location(normalized_user.address) or profile.location,
        target_role=normalized_resume.professional_title or profile.target_role,
        years_of_experience=(
            normalized_resume.preferences.years_of_experience
            if normalized_resume.preferences.years_of_experience is not None
            else profile.years_of_experience
        ),
        skills=_join_csv(normalized_resume.skills) or profile.skills,
        languages=_format_languages(normalized_resume.languages) or profile.languages,
        work_authorization=(
            normalized_resume.preferences.work_authorization_status
            or profile.work_authorization
        ),
        remote_preference=normalized_resume.preferences.work_mode or profile.remote_preference,
        preferred_locations=(
            _join_csv(normalized_resume.preferences.preferred_locations)
            or profile.preferred_locations
        ),
        salary_expectation=(
            normalized_resume.preferences.salary_expectation or profile.salary_expectation
        ),
        professional_summary=summary,
        cv_text=cv_text,
        user=normalized_user,
        resume=normalized_resume,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )


def _default_user_profile(auth_user: User) -> ResumeUserProfile:
    first_name, last_name = _split_full_name(auth_user.full_name)
    return ResumeUserProfile(
        first_name=first_name,
        last_name=last_name,
        email=auth_user.email,
    )


def _normalize_user_profile(
    *,
    profile: CandidateProfileRecord,
    auth_user: User,
) -> ResumeUserProfile:
    default_user_profile = _default_user_profile(auth_user)
    flat_first_name, flat_last_name = _split_full_name(profile.full_name or auth_user.full_name)
    flat_city, flat_country = _split_location(profile.location)

    return ResumeUserProfile(
        first_name=(
            profile.user.first_name
            or flat_first_name
            or default_user_profile.first_name
        ),
        last_name=(
            profile.user.last_name
            or flat_last_name
            or default_user_profile.last_name
        ),
        birth_year=profile.user.birth_year,
        email=profile.user.email or profile.email or auth_user.email,
        phone=profile.user.phone or profile.phone,
        address=ResumeAddress(
            street=profile.user.address.street,
            city=profile.user.address.city or flat_city,
            postal_code=profile.user.address.postal_code,
            country=profile.user.address.country or flat_country,
        ),
    )


def _normalize_resume_profile(profile: CandidateProfileRecord) -> ResumeProfile:
    preferences = profile.resume.preferences
    return ResumeProfile(
        professional_title=profile.resume.professional_title or profile.target_role,
        summary=profile.resume.summary or profile.professional_summary,
        experience=profile.resume.experience,
        education=profile.resume.education,
        skills=profile.resume.skills or _split_csv(profile.skills),
        languages=profile.resume.languages or _parse_languages(profile.languages),
        preferences=ResumePreferences(
            work_authorization_status=(
                preferences.work_authorization_status or profile.work_authorization
            ),
            years_of_experience=(
                preferences.years_of_experience
                if preferences.years_of_experience is not None
                else profile.years_of_experience
            ),
            preferred_locations=(
                preferences.preferred_locations or _split_csv(profile.preferred_locations)
            ),
            work_mode=preferences.work_mode or profile.remote_preference,
            salary_expectation=(
                preferences.salary_expectation or profile.salary_expectation
            ),
            availability=preferences.availability,
        ),
    )


def _apply_flat_user_payload(
    *,
    base_user_profile: ResumeUserProfile,
    payload: UpsertCandidateProfileRequest,
    auth_user: User,
) -> ResumeUserProfile:
    next_first_name = base_user_profile.first_name
    next_last_name = base_user_profile.last_name

    if payload.full_name.strip():
        next_first_name, next_last_name = _split_full_name(payload.full_name)

    next_address = base_user_profile.address.model_copy(deep=True)
    if payload.location.strip():
        city, country = _split_location(payload.location)
        next_address = next_address.model_copy(
            update={
                "city": city,
                "country": country or next_address.country,
            }
        )

    return ResumeUserProfile(
        first_name=next_first_name or _default_user_profile(auth_user).first_name,
        last_name=next_last_name or _default_user_profile(auth_user).last_name,
        birth_year=base_user_profile.birth_year,
        email=payload.email.strip() or auth_user.email,
        phone=payload.phone.strip(),
        address=next_address,
    )


def _apply_nested_user_payload(
    *,
    payload: UpsertCandidateProfileRequest,
    auth_user: User,
) -> ResumeUserProfile:
    user_payload = payload.user or ResumeUserProfile()
    next_first_name = user_payload.first_name.strip()
    next_last_name = user_payload.last_name.strip()
    if not next_first_name and not next_last_name and payload.full_name.strip():
        next_first_name, next_last_name = _split_full_name(payload.full_name)

    address = user_payload.address
    if not address.city and payload.location.strip():
        city, country = _split_location(payload.location)
        address = address.model_copy(update={"city": city, "country": address.country or country})

    return ResumeUserProfile(
        first_name=next_first_name or _default_user_profile(auth_user).first_name,
        last_name=next_last_name or _default_user_profile(auth_user).last_name,
        birth_year=user_payload.birth_year,
        email=user_payload.email.strip() or payload.email.strip() or auth_user.email,
        phone=user_payload.phone.strip() or payload.phone.strip(),
        address=address,
    )


def _apply_flat_resume_payload(
    *,
    base_resume: ResumeProfile,
    payload: UpsertCandidateProfileRequest,
) -> ResumeProfile:
    return ResumeProfile(
        professional_title=payload.target_role.strip(),
        summary=payload.professional_summary.strip(),
        experience=base_resume.experience,
        education=base_resume.education,
        skills=_split_csv(payload.skills),
        languages=_parse_languages(payload.languages),
        preferences=ResumePreferences(
            work_authorization_status=payload.work_authorization.strip(),
            years_of_experience=payload.years_of_experience,
            preferred_locations=_split_csv(payload.preferred_locations),
            work_mode=payload.remote_preference.strip(),
            salary_expectation=payload.salary_expectation.strip(),
            availability=base_resume.preferences.availability,
        ),
    )


def _apply_nested_resume_payload(
    *,
    payload: UpsertCandidateProfileRequest,
    base_resume: ResumeProfile,
) -> ResumeProfile:
    resume_payload = payload.resume or ResumeProfile()
    preferences = resume_payload.preferences
    return ResumeProfile(
        professional_title=resume_payload.professional_title.strip()
        or payload.target_role.strip(),
        summary=resume_payload.summary.strip() or payload.professional_summary.strip(),
        experience=resume_payload.experience,
        education=resume_payload.education,
        skills=resume_payload.skills or _split_csv(payload.skills),
        languages=resume_payload.languages or _parse_languages(payload.languages),
        preferences=ResumePreferences(
            work_authorization_status=(
                preferences.work_authorization_status.strip()
                or payload.work_authorization.strip()
            ),
            years_of_experience=(
                preferences.years_of_experience
                if preferences.years_of_experience is not None
                else payload.years_of_experience
            ),
            preferred_locations=(
                preferences.preferred_locations or _split_csv(payload.preferred_locations)
            ),
            work_mode=preferences.work_mode.strip() or payload.remote_preference.strip(),
            salary_expectation=(
                preferences.salary_expectation.strip()
                or payload.salary_expectation.strip()
            ),
            availability=preferences.availability.strip()
            or base_resume.preferences.availability.strip(),
        ),
    )


def _build_resume_summary(
    *,
    user_profile: ResumeUserProfile,
    resume: ResumeProfile,
) -> str:
    title = resume.professional_title.strip()
    years_of_experience = resume.preferences.years_of_experience
    top_skills = resume.skills[:4]
    preferred_locations = resume.preferences.preferred_locations[:2]

    fragments: list[str] = []
    if title and years_of_experience is not None:
        fragments.append(
            f"{title} with {years_of_experience} years of professional experience."
        )
    elif title:
        fragments.append(f"Candidate targeting {title} roles.")

    if top_skills:
        fragments.append(f"Core skills include {', '.join(top_skills)}.")

    if preferred_locations:
        fragments.append(
            f"Focused on opportunities in {', '.join(preferred_locations)}."
        )

    if resume.preferences.work_authorization_status.strip():
        fragments.append(
            f"Work authorization: {resume.preferences.work_authorization_status.strip()}."
        )

    if not fragments and user_profile.first_name:
        return f"{user_profile.first_name}'s resume profile for the German job market."

    return " ".join(fragments)


def _render_resume_text(
    user_profile: ResumeUserProfile,
    resume: ResumeProfile,
) -> str:
    lines: list[str] = []

    full_name = _compose_full_name(user_profile.first_name, user_profile.last_name)
    if full_name:
        lines.append(full_name)

    if resume.professional_title:
        lines.append(resume.professional_title)

    location = _format_location(user_profile.address)
    if location:
        lines.append(location)

    if resume.summary:
        lines.append("")
        lines.append("Summary")
        lines.append(resume.summary)

    if resume.skills:
        lines.append("")
        lines.append(f"Skills: {', '.join(resume.skills)}")

    if resume.languages:
        lines.append("")
        lines.append(f"Languages: {_format_languages(resume.languages)}")

    if resume.experience:
        lines.append("")
        lines.append("Experience")
        for entry in resume.experience:
            parts = [entry.job_title, entry.company]
            header = " | ".join(part for part in parts if part)
            if header:
                lines.append(header)
            date_range = " - ".join(part for part in [entry.start_date, entry.end_date] if part)
            if date_range:
                lines.append(date_range)
            if entry.location:
                lines.append(entry.location)
            if entry.responsibilities:
                lines.append(entry.responsibilities)
            if entry.technologies_used:
                lines.append(f"Technologies: {', '.join(entry.technologies_used)}")
            lines.append("")

    if resume.education:
        lines.append("Education")
        for entry in resume.education:
            parts = [entry.degree, entry.field_of_study, entry.institution]
            lines.append(" | ".join(part for part in parts if part))
            years = " - ".join(
                str(value) for value in [entry.start_year, entry.end_year] if value is not None
            )
            if years:
                lines.append(years)
            lines.append("")

    rendered = "\n".join(lines).strip()
    if rendered:
        return rendered

    return "Resume profile not provided yet."


def _compose_full_name(first_name: str, last_name: str) -> str:
    return " ".join(part for part in [first_name.strip(), last_name.strip()] if part)


def _split_full_name(value: str) -> tuple[str, str]:
    parts = [item for item in value.strip().split() if item]
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:])


def _split_location(value: str) -> tuple[str, str]:
    parts = [item.strip() for item in value.split(",") if item.strip()]
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], parts[-1]


def _format_location(address: ResumeAddress) -> str:
    return ", ".join(part for part in [address.city.strip(), address.country.strip()] if part)


def _split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def _join_csv(values: list[str]) -> str:
    return ", ".join(item for item in values if item.strip())


def _parse_languages(value: str) -> list[ResumeLanguageEntry]:
    languages: list[ResumeLanguageEntry] = []
    for item in _split_csv(value):
        name, level = _split_language_level(item)
        languages.append(
            ResumeLanguageEntry(
                language=name,
                level=level,
            )
        )
    return languages


def _split_language_level(value: str) -> tuple[str, str]:
    parts = value.rsplit(" ", 1)
    if len(parts) == 2 and parts[1]:
        return parts[0].strip(), parts[1].strip()
    return value.strip(), ""


def _format_languages(values: list[ResumeLanguageEntry]) -> str:
    formatted_values = []
    for entry in values:
        language = entry.language.strip()
        level = entry.level.strip()
        if language and level:
            formatted_values.append(f"{language} {level}")
        elif language:
            formatted_values.append(language)

    return ", ".join(formatted_values)
