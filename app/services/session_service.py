from __future__ import annotations

import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from uuid import uuid4

from app.models.session import Session
from app.models.user import User
from app.repositories.session_repository import SessionRepository
from app.repositories.user_repository import UserRepository


class SessionService:
    def __init__(
        self,
        session_repository: SessionRepository,
        user_repository: UserRepository,
        session_ttl: timedelta,
    ) -> None:
        self._session_repository = session_repository
        self._user_repository = user_repository
        self._session_ttl = session_ttl

    def create_session(
        self,
        user: User,
        *,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> str:
        now = datetime.now(UTC)
        raw_token = secrets.token_urlsafe(32)
        session = Session(
            id=uuid4().hex,
            user_id=user.id,
            session_token_hash=_hash_session_token(raw_token),
            created_at=now,
            expires_at=now + self._session_ttl,
            user_agent=_clean_optional_value(user_agent),
            ip_address=_clean_optional_value(ip_address),
        )
        self._session_repository.create(session)
        return raw_token

    def get_user_for_session(self, raw_token: str | None) -> User | None:
        if not raw_token:
            return None

        session = self._session_repository.get_by_token_hash(_hash_session_token(raw_token))
        if session is None:
            return None

        if session.expires_at <= datetime.now(UTC):
            self._session_repository.delete_by_id(session.id)
            return None

        user = self._user_repository.get_by_id(session.user_id)
        if user is None or not user.is_active:
            self._session_repository.delete_by_id(session.id)
            return None

        return user

    def invalidate_session(self, raw_token: str | None) -> bool:
        if not raw_token:
            return False

        return self._session_repository.delete_by_token_hash(_hash_session_token(raw_token))


def _hash_session_token(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _clean_optional_value(value: str | None) -> str | None:
    if value is None:
        return None

    normalized = value.strip()
    return normalized or None
