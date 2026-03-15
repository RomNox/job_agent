from __future__ import annotations

import sqlite3
from datetime import datetime

from app.models.session import Session
from app.repositories.sqlite_database import SQLiteDatabase


class SessionRepository:
    def __init__(self, database: SQLiteDatabase) -> None:
        self._database = database

    def create(self, session: Session) -> Session:
        with self._database.connect() as connection:
            connection.execute(
                """
                INSERT INTO sessions (
                    id,
                    user_id,
                    session_token_hash,
                    created_at,
                    expires_at,
                    user_agent,
                    ip_address
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    session.id,
                    session.user_id,
                    session.session_token_hash,
                    _serialize_datetime(session.created_at),
                    _serialize_datetime(session.expires_at),
                    session.user_agent,
                    session.ip_address,
                ),
            )

        return session

    def get_by_token_hash(self, session_token_hash: str) -> Session | None:
        with self._database.connect() as connection:
            row = connection.execute(
                """
                SELECT
                    id,
                    user_id,
                    session_token_hash,
                    created_at,
                    expires_at,
                    user_agent,
                    ip_address
                FROM sessions
                WHERE session_token_hash = ?
                """,
                (session_token_hash,),
            ).fetchone()

        return _row_to_session(row)

    def delete_by_token_hash(self, session_token_hash: str) -> bool:
        with self._database.connect() as connection:
            cursor = connection.execute(
                "DELETE FROM sessions WHERE session_token_hash = ?",
                (session_token_hash,),
            )
            return cursor.rowcount > 0

    def delete_by_id(self, session_id: str) -> bool:
        with self._database.connect() as connection:
            cursor = connection.execute(
                "DELETE FROM sessions WHERE id = ?",
                (session_id,),
            )
            return cursor.rowcount > 0


def _row_to_session(row: sqlite3.Row | None) -> Session | None:
    if row is None:
        return None

    return Session(
        id=row["id"],
        user_id=row["user_id"],
        session_token_hash=row["session_token_hash"],
        created_at=datetime.fromisoformat(row["created_at"]),
        expires_at=datetime.fromisoformat(row["expires_at"]),
        user_agent=row["user_agent"],
        ip_address=row["ip_address"],
    )


def _serialize_datetime(value: datetime) -> str:
    return value.isoformat()
