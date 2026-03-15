from __future__ import annotations

import sqlite3
from datetime import datetime

from app.models.user import User
from app.repositories.sqlite_database import SQLiteDatabase


class DuplicateEmailError(RuntimeError):
    pass


class UserRepository:
    def __init__(self, database: SQLiteDatabase) -> None:
        self._database = database

    def create(self, user: User) -> User:
        try:
            with self._database.connect() as connection:
                connection.execute(
                    """
                    INSERT INTO users (
                        id,
                        full_name,
                        email,
                        password_hash,
                        is_active,
                        created_at,
                        updated_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        user.id,
                        user.full_name,
                        user.email,
                        user.password_hash,
                        int(user.is_active),
                        _serialize_datetime(user.created_at),
                        _serialize_datetime(user.updated_at),
                    ),
                )
        except sqlite3.IntegrityError as exc:
            raise DuplicateEmailError("An account with this email already exists.") from exc

        return user

    def get_by_email(self, email: str) -> User | None:
        with self._database.connect() as connection:
            row = connection.execute(
                """
                SELECT
                    id,
                    full_name,
                    email,
                    password_hash,
                    is_active,
                    created_at,
                    updated_at
                FROM users
                WHERE email = ?
                """,
                (email,),
            ).fetchone()

        return _row_to_user(row)

    def get_by_id(self, user_id: str) -> User | None:
        with self._database.connect() as connection:
            row = connection.execute(
                """
                SELECT
                    id,
                    full_name,
                    email,
                    password_hash,
                    is_active,
                    created_at,
                    updated_at
                FROM users
                WHERE id = ?
                """,
                (user_id,),
            ).fetchone()

        return _row_to_user(row)


def _row_to_user(row: sqlite3.Row | None) -> User | None:
    if row is None:
        return None

    return User(
        id=row["id"],
        full_name=row["full_name"],
        email=row["email"],
        password_hash=row["password_hash"],
        is_active=bool(row["is_active"]),
        created_at=datetime.fromisoformat(row["created_at"]),
        updated_at=datetime.fromisoformat(row["updated_at"]),
    )


def _serialize_datetime(value: datetime) -> str:
    return value.isoformat()
