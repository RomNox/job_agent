from __future__ import annotations

import sqlite3
from datetime import datetime

from app.models.onboarding import OnboardingStateRecord
from app.repositories.sqlite_database import SQLiteDatabase


class OnboardingRepository:
    def __init__(self, database: SQLiteDatabase) -> None:
        self._database = database

    def get_by_user_id(self, user_id: str) -> OnboardingStateRecord | None:
        with self._database.connect() as connection:
            row = connection.execute(
                """
                SELECT
                    user_id,
                    current_step,
                    furthest_step,
                    completed,
                    created_at,
                    updated_at
                FROM onboarding_progress
                WHERE user_id = ?
                """,
                (user_id,),
            ).fetchone()

        return _row_to_onboarding_state(row)

    def upsert(self, state: OnboardingStateRecord) -> OnboardingStateRecord:
        with self._database.connect() as connection:
            connection.execute(
                """
                INSERT INTO onboarding_progress (
                    user_id,
                    current_step,
                    furthest_step,
                    completed,
                    created_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    current_step = excluded.current_step,
                    furthest_step = excluded.furthest_step,
                    completed = excluded.completed,
                    updated_at = excluded.updated_at
                """,
                (
                    state.user_id,
                    state.current_step,
                    state.furthest_step,
                    int(state.completed),
                    _serialize_datetime(state.created_at),
                    _serialize_datetime(state.updated_at),
                ),
            )

        saved_state = self.get_by_user_id(state.user_id)
        if saved_state is None:
            raise RuntimeError("Failed to persist onboarding progress.")

        return saved_state


def _row_to_onboarding_state(
    row: sqlite3.Row | None,
) -> OnboardingStateRecord | None:
    if row is None:
        return None

    return OnboardingStateRecord(
        user_id=row["user_id"],
        current_step=row["current_step"],
        furthest_step=row["furthest_step"],
        completed=bool(row["completed"]),
        created_at=datetime.fromisoformat(row["created_at"]),
        updated_at=datetime.fromisoformat(row["updated_at"]),
    )


def _serialize_datetime(value: datetime) -> str:
    return value.isoformat()
