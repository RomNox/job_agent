from __future__ import annotations

import sqlite3
from datetime import datetime

from app.models.candidate_profile import CandidateProfileRecord
from app.repositories.sqlite_database import SQLiteDatabase


class CandidateProfileRepository:
    def __init__(self, database: SQLiteDatabase) -> None:
        self._database = database

    def get_by_user_id(self, user_id: str) -> CandidateProfileRecord | None:
        with self._database.connect() as connection:
            row = connection.execute(
                """
                SELECT
                    user_id,
                    full_name,
                    email,
                    phone,
                    location,
                    target_role,
                    years_of_experience,
                    skills,
                    languages,
                    work_authorization,
                    remote_preference,
                    preferred_locations,
                    salary_expectation,
                    professional_summary,
                    cv_text,
                    created_at,
                    updated_at
                FROM candidate_profiles
                WHERE user_id = ?
                """,
                (user_id,),
            ).fetchone()

        return _row_to_candidate_profile(row)

    def upsert(self, profile: CandidateProfileRecord) -> CandidateProfileRecord:
        with self._database.connect() as connection:
            connection.execute(
                """
                INSERT INTO candidate_profiles (
                    user_id,
                    full_name,
                    email,
                    phone,
                    location,
                    target_role,
                    years_of_experience,
                    skills,
                    languages,
                    work_authorization,
                    remote_preference,
                    preferred_locations,
                    salary_expectation,
                    professional_summary,
                    cv_text,
                    created_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    full_name = excluded.full_name,
                    email = excluded.email,
                    phone = excluded.phone,
                    location = excluded.location,
                    target_role = excluded.target_role,
                    years_of_experience = excluded.years_of_experience,
                    skills = excluded.skills,
                    languages = excluded.languages,
                    work_authorization = excluded.work_authorization,
                    remote_preference = excluded.remote_preference,
                    preferred_locations = excluded.preferred_locations,
                    salary_expectation = excluded.salary_expectation,
                    professional_summary = excluded.professional_summary,
                    cv_text = excluded.cv_text,
                    updated_at = excluded.updated_at
                """,
                (
                    profile.user_id,
                    profile.full_name,
                    profile.email,
                    profile.phone,
                    profile.location,
                    profile.target_role,
                    profile.years_of_experience,
                    profile.skills,
                    profile.languages,
                    profile.work_authorization,
                    profile.remote_preference,
                    profile.preferred_locations,
                    profile.salary_expectation,
                    profile.professional_summary,
                    profile.cv_text,
                    _serialize_datetime(profile.created_at),
                    _serialize_datetime(profile.updated_at),
                ),
            )

        saved_profile = self.get_by_user_id(profile.user_id)
        if saved_profile is None:
            raise RuntimeError("Failed to persist candidate profile.")

        return saved_profile


def _row_to_candidate_profile(
    row: sqlite3.Row | None,
) -> CandidateProfileRecord | None:
    if row is None:
        return None

    return CandidateProfileRecord(
        user_id=row["user_id"],
        full_name=row["full_name"],
        email=row["email"],
        phone=row["phone"],
        location=row["location"],
        target_role=row["target_role"],
        years_of_experience=row["years_of_experience"],
        skills=row["skills"],
        languages=row["languages"],
        work_authorization=row["work_authorization"],
        remote_preference=row["remote_preference"],
        preferred_locations=row["preferred_locations"],
        salary_expectation=row["salary_expectation"],
        professional_summary=row["professional_summary"],
        cv_text=row["cv_text"],
        created_at=datetime.fromisoformat(row["created_at"]),
        updated_at=datetime.fromisoformat(row["updated_at"]),
    )


def _serialize_datetime(value: datetime) -> str:
    return value.isoformat()
