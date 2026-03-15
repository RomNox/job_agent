from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.config import Settings
from app.dependencies import (
    get_app_settings,
    get_auth_service,
    get_current_user,
    get_optional_session_token,
)
from app.models.auth import (
    AuthStatusResponse,
    AuthUserResponse,
    LoginRequest,
    RegisterRequest,
)
from app.models.user import User
from app.repositories.user_repository import DuplicateEmailError
from app.services.auth_service import (
    AuthService,
    InactiveUserError,
    InvalidCredentialsError,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=AuthUserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
async def register_user(
    payload: RegisterRequest,
    request: Request,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service),
    settings: Settings = Depends(get_app_settings),
) -> AuthUserResponse:
    _set_auth_response_headers(response)

    try:
        auth_user, session_token = auth_service.register_user(
            full_name=payload.full_name,
            email=payload.email,
            password=payload.password,
            user_agent=request.headers.get("user-agent"),
            ip_address=_read_client_ip(request),
        )
    except DuplicateEmailError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    _set_session_cookie(response, session_token, settings=settings)
    return auth_user


@router.post(
    "/login",
    response_model=AuthUserResponse,
    summary="Authenticate a user with email and password",
)
async def login_user(
    payload: LoginRequest,
    request: Request,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service),
    settings: Settings = Depends(get_app_settings),
) -> AuthUserResponse:
    _set_auth_response_headers(response)

    try:
        auth_user, session_token = auth_service.login_user(
            email=payload.email,
            password=payload.password,
            user_agent=request.headers.get("user-agent"),
            ip_address=_read_client_ip(request),
        )
    except (InactiveUserError, InvalidCredentialsError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    _set_session_cookie(response, session_token, settings=settings)
    return auth_user


@router.post(
    "/logout",
    response_model=AuthStatusResponse,
    summary="Log out the current session",
)
async def logout_user(
    response: Response,
    session_token: str | None = Depends(get_optional_session_token),
    auth_service: AuthService = Depends(get_auth_service),
    settings: Settings = Depends(get_app_settings),
) -> AuthStatusResponse:
    _set_auth_response_headers(response)
    auth_service.logout_user(session_token)
    _clear_session_cookie(response, settings=settings)
    return AuthStatusResponse(authenticated=False, user=None)


@router.get(
    "/me",
    response_model=AuthUserResponse,
    summary="Return the currently authenticated user",
)
async def get_authenticated_user(
    response: Response,
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
) -> AuthUserResponse:
    _set_auth_response_headers(response)
    return auth_service.to_auth_user_response(current_user)


def _set_session_cookie(
    response: Response,
    session_token: str,
    *,
    settings: Settings,
) -> None:
    response.set_cookie(
        key=settings.auth_session_cookie_name,
        value=session_token,
        httponly=True,
        secure=settings.is_production,
        samesite="lax",
        max_age=settings.auth_session_max_age_seconds,
        expires=settings.auth_session_max_age_seconds,
        path="/",
    )


def _clear_session_cookie(response: Response, *, settings: Settings) -> None:
    response.delete_cookie(
        key=settings.auth_session_cookie_name,
        httponly=True,
        secure=settings.is_production,
        samesite="lax",
        path="/",
    )


def _set_auth_response_headers(response: Response) -> None:
    response.headers["Cache-Control"] = "no-store"
    response.headers["Pragma"] = "no-cache"
    response.headers["Vary"] = "Cookie"


def _read_client_ip(request: Request) -> str | None:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        first_ip = forwarded_for.split(",")[0].strip()
        if first_ip:
            return first_ip

    return request.client.host if request.client is not None else None
