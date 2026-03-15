from __future__ import annotations

from collections.abc import Generator
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.dependencies import get_app_settings, get_auth_service
from app.main import app
from app.repositories.session_repository import SessionRepository
from app.repositories.sqlite_database import SQLiteDatabase
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.password_service import PasswordService
from app.services.session_service import SessionService


@pytest.fixture
def client(tmp_path) -> Generator[TestClient, None, None]:
    settings = Settings(
        auth_db_path=tmp_path / "auth.sqlite3",
        auth_session_cookie_name="job_agent_session",
        auth_session_max_age_seconds=60 * 60,
    )
    database = SQLiteDatabase(settings.auth_db_path)
    auth_service = AuthService(
        user_repository=UserRepository(database),
        password_service=PasswordService(),
        session_service=SessionService(
            session_repository=SessionRepository(database),
            user_repository=UserRepository(database),
            session_ttl=timedelta(seconds=settings.auth_session_max_age_seconds),
        ),
    )

    app.dependency_overrides[get_app_settings] = lambda: settings
    app.dependency_overrides[get_auth_service] = lambda: auth_service

    with TestClient(app) as test_client:
        test_client.app.state.auth_cookie_name = settings.auth_session_cookie_name
        yield test_client

    app.dependency_overrides.clear()


def test_register_creates_user_and_session(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )

    assert response.status_code == 201
    assert response.json() == {
        "id": response.json()["id"],
        "full_name": "Anna Schmidt",
        "email": "anna@example.com",
    }
    assert client.cookies.get(client.app.state.auth_cookie_name)
    assert response.headers["cache-control"] == "no-store"
    assert response.headers["vary"] == "Cookie"
    set_cookie = response.headers["set-cookie"]
    assert "HttpOnly" in set_cookie
    assert "SameSite=lax" in set_cookie
    assert "Secure" not in set_cookie


def test_register_rejects_duplicate_email(client: TestClient) -> None:
    first_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert first_response.status_code == 201

    second_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Another Anna",
            "email": "ANNA@example.com",
            "password": "supersecret123",
        },
    )

    assert second_response.status_code == 409
    assert second_response.json() == {
        "detail": "An account with this email already exists."
    }


def test_login_succeeds_with_valid_credentials(client: TestClient) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert register_response.status_code == 201

    logout_response = client.post("/api/v1/auth/logout")
    assert logout_response.status_code == 200

    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )

    assert login_response.status_code == 200
    assert login_response.json()["email"] == "anna@example.com"
    assert client.cookies.get(client.app.state.auth_cookie_name)


def test_login_rejects_invalid_credentials(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "missing@example.com",
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid email or password."}


def test_me_returns_authenticated_user_with_valid_session(client: TestClient) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert register_response.status_code == 201

    response = client.get("/api/v1/auth/me")

    assert response.status_code == 200
    assert response.json()["email"] == "anna@example.com"


def test_me_returns_401_without_session(client: TestClient) -> None:
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 401
    assert response.json() == {"detail": "Authentication required."}


def test_logout_invalidates_session(client: TestClient) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert register_response.status_code == 201

    logout_response = client.post("/api/v1/auth/logout")
    assert logout_response.status_code == 200
    assert logout_response.json() == {
        "authenticated": False,
        "user": None,
    }
    assert logout_response.headers["cache-control"] == "no-store"
    assert "Max-Age=0" in logout_response.headers["set-cookie"]

    me_response = client.get("/api/v1/auth/me")
    assert me_response.status_code == 401


def test_auth_me_sets_cache_control_headers(client: TestClient) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert register_response.status_code == 201

    response = client.get("/api/v1/auth/me")

    assert response.status_code == 200
    assert response.headers["cache-control"] == "no-store"
    assert response.headers["pragma"] == "no-cache"
    assert response.headers["vary"] == "Cookie"


def test_auth_cors_allows_explicit_frontend_origin() -> None:
    with TestClient(app) as cors_client:
        response = cors_client.options(
            "/api/v1/auth/me",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
            },
        )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert response.headers["access-control-allow-credentials"] == "true"
