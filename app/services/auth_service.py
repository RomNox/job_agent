from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from app.models.auth import AuthUserResponse
from app.models.user import User
from app.repositories.user_repository import DuplicateEmailError, UserRepository
from app.services.password_service import PasswordService
from app.services.session_service import SessionService


class InvalidCredentialsError(RuntimeError):
    pass


class InactiveUserError(RuntimeError):
    pass


class AuthService:
    def __init__(
        self,
        user_repository: UserRepository,
        password_service: PasswordService,
        session_service: SessionService,
    ) -> None:
        self._user_repository = user_repository
        self._password_service = password_service
        self._session_service = session_service

    def register_user(
        self,
        *,
        full_name: str,
        email: str,
        password: str,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> tuple[AuthUserResponse, str]:
        now = datetime.now(UTC)
        user = User(
            id=uuid4().hex,
            full_name=full_name.strip(),
            email=_normalize_email(email),
            password_hash=self._password_service.hash_password(password),
            is_active=True,
            created_at=now,
            updated_at=now,
        )
        created_user = self._user_repository.create(user)
        session_token = self._session_service.create_session(
            created_user,
            user_agent=user_agent,
            ip_address=ip_address,
        )
        return self.to_auth_user_response(created_user), session_token

    def login_user(
        self,
        *,
        email: str,
        password: str,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> tuple[AuthUserResponse, str]:
        normalized_email = _normalize_email(email)
        user = self._user_repository.get_by_email(normalized_email)
        if user is None or not self._password_service.verify_password(
            password,
            user.password_hash,
        ):
            raise InvalidCredentialsError("Invalid email or password.")

        if not user.is_active:
            raise InactiveUserError("This account is inactive.")

        session_token = self._session_service.create_session(
            user,
            user_agent=user_agent,
            ip_address=ip_address,
        )
        return self.to_auth_user_response(user), session_token

    def logout_user(self, session_token: str | None) -> bool:
        return self._session_service.invalidate_session(session_token)

    def get_current_user(self, session_token: str | None) -> User | None:
        return self._session_service.get_user_for_session(session_token)

    def to_auth_user_response(self, user: User) -> AuthUserResponse:
        return AuthUserResponse(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
        )


__all__ = [
    "AuthService",
    "DuplicateEmailError",
    "InactiveUserError",
    "InvalidCredentialsError",
]


def _normalize_email(value: str) -> str:
    return value.strip().lower()
