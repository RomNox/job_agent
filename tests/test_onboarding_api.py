from __future__ import annotations

from collections.abc import Generator
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.dependencies import (
    get_app_settings,
    get_auth_service,
    get_onboarding_service,
)
from app.main import app
from app.repositories.onboarding_repository import OnboardingRepository
from app.repositories.session_repository import SessionRepository
from app.repositories.sqlite_database import SQLiteDatabase
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.onboarding_service import OnboardingService
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
    onboarding_service = OnboardingService(repository=OnboardingRepository(database))

    app.dependency_overrides[get_app_settings] = lambda: settings
    app.dependency_overrides[get_auth_service] = lambda: auth_service
    app.dependency_overrides[get_onboarding_service] = lambda: onboarding_service

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def test_get_onboarding_returns_default_state_for_authenticated_user(
    client: TestClient,
) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert register_response.status_code == 201

    response = client.get("/api/v1/onboarding")

    assert response.status_code == 200
    assert response.json() == {
        "user_id": register_response.json()["id"],
        "current_step": 0,
        "furthest_step": 0,
        "completed": False,
        "created_at": None,
        "updated_at": None,
    }


def test_put_onboarding_updates_progress(client: TestClient) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert register_response.status_code == 201

    response = client.put(
        "/api/v1/onboarding",
        json={
            "current_step": 3,
            "completed": False,
        },
    )

    assert response.status_code == 200
    assert response.json()["current_step"] == 3
    assert response.json()["furthest_step"] == 3
    assert response.json()["completed"] is False


def test_put_onboarding_preserves_furthest_step_when_navigating_back(
    client: TestClient,
) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert register_response.status_code == 201

    advance_response = client.put(
        "/api/v1/onboarding",
        json={
            "current_step": 4,
            "completed": False,
        },
    )
    assert advance_response.status_code == 200

    back_response = client.put(
        "/api/v1/onboarding",
        json={
            "current_step": 2,
            "completed": False,
        },
    )

    assert back_response.status_code == 200
    assert back_response.json()["current_step"] == 2
    assert back_response.json()["furthest_step"] == 4


def test_put_onboarding_can_mark_completion(client: TestClient) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert register_response.status_code == 201

    response = client.put(
        "/api/v1/onboarding",
        json={
            "current_step": 10,
            "completed": True,
        },
    )

    assert response.status_code == 200
    assert response.json()["current_step"] == 10
    assert response.json()["furthest_step"] == 10
    assert response.json()["completed"] is True


def test_get_onboarding_rejects_unauthenticated_access(client: TestClient) -> None:
    response = client.get("/api/v1/onboarding")

    assert response.status_code == 401
    assert response.json() == {"detail": "Authentication required."}
