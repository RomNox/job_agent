from __future__ import annotations

from collections.abc import Generator
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.dependencies import (
    get_app_settings,
    get_auth_service,
    get_candidate_profile_service,
)
from app.main import app
from app.repositories.candidate_profile_repository import CandidateProfileRepository
from app.repositories.session_repository import SessionRepository
from app.repositories.sqlite_database import SQLiteDatabase
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.candidate_profile_service import CandidateProfileService
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
    candidate_profile_service = CandidateProfileService(
        repository=CandidateProfileRepository(database)
    )

    app.dependency_overrides[get_app_settings] = lambda: settings
    app.dependency_overrides[get_auth_service] = lambda: auth_service
    app.dependency_overrides[get_candidate_profile_service] = (
        lambda: candidate_profile_service
    )

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def test_get_profile_returns_default_profile_for_authenticated_user(
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

    response = client.get("/api/v1/profile")

    assert response.status_code == 200
    assert response.json() == {
        "user_id": register_response.json()["id"],
        "full_name": "Anna Schmidt",
        "email": "anna@example.com",
        "phone": "",
        "location": "",
        "target_role": "",
        "years_of_experience": None,
        "skills": "",
        "languages": "",
        "work_authorization": "",
        "remote_preference": "",
        "preferred_locations": "",
        "salary_expectation": "",
        "professional_summary": "",
        "cv_text": "",
        "created_at": None,
        "updated_at": None,
    }


def test_put_profile_creates_profile_for_authenticated_user(
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

    response = client.put(
        "/api/v1/profile",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "phone": "+49 170 1234567",
            "location": "Berlin",
            "target_role": "Python Developer",
            "years_of_experience": 4,
            "skills": "Python, FastAPI, SQL",
            "languages": "German C1, English C1",
            "work_authorization": "EU citizen",
            "remote_preference": "Hybrid",
            "preferred_locations": "Berlin, Remote",
            "salary_expectation": "EUR 75,000",
            "professional_summary": "Backend engineer focused on Python services.",
            "cv_text": "Professional experience in backend engineering.",
        },
    )

    payload = response.json()
    assert response.status_code == 200
    assert payload["user_id"] == register_response.json()["id"]
    assert payload["target_role"] == "Python Developer"
    assert payload["skills"] == "Python, FastAPI, SQL"
    assert payload["created_at"] is not None
    assert payload["updated_at"] is not None


def test_put_profile_updates_existing_profile(client: TestClient) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert register_response.status_code == 201

    first_response = client.put(
        "/api/v1/profile",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "phone": "",
            "location": "Berlin",
            "target_role": "Python Developer",
            "years_of_experience": 4,
            "skills": "Python",
            "languages": "German C1",
            "work_authorization": "EU citizen",
            "remote_preference": "Hybrid",
            "preferred_locations": "Berlin",
            "salary_expectation": "EUR 75,000",
            "professional_summary": "Backend engineer",
            "cv_text": "Backend engineer CV",
        },
    )
    assert first_response.status_code == 200

    second_response = client.put(
        "/api/v1/profile",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "phone": "+49 170 1234567",
            "location": "Hamburg",
            "target_role": "Senior Backend Engineer",
            "years_of_experience": 5,
            "skills": "Python, FastAPI, PostgreSQL",
            "languages": "German C1, English C1",
            "work_authorization": "EU citizen",
            "remote_preference": "Remote",
            "preferred_locations": "Hamburg, Remote",
            "salary_expectation": "EUR 85,000",
            "professional_summary": "Senior backend engineer",
            "cv_text": "Updated CV text",
        },
    )

    assert second_response.status_code == 200
    assert second_response.json()["location"] == "Hamburg"
    assert second_response.json()["target_role"] == "Senior Backend Engineer"
    assert second_response.json()["skills"] == "Python, FastAPI, PostgreSQL"
    assert second_response.json()["created_at"] == first_response.json()["created_at"]
    assert second_response.json()["updated_at"] != first_response.json()["updated_at"]


def test_get_profile_rejects_unauthenticated_access(client: TestClient) -> None:
    response = client.get("/api/v1/profile")

    assert response.status_code == 401
    assert response.json() == {"detail": "Authentication required."}


def test_profile_persistence_is_isolated_per_user(client: TestClient) -> None:
    first_register = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert first_register.status_code == 201

    first_profile = client.put(
        "/api/v1/profile",
        json={
            "full_name": "Anna Schmidt",
            "email": "anna@example.com",
            "phone": "",
            "location": "Berlin",
            "target_role": "Python Developer",
            "years_of_experience": 4,
            "skills": "Python, FastAPI",
            "languages": "German C1",
            "work_authorization": "EU citizen",
            "remote_preference": "Hybrid",
            "preferred_locations": "Berlin",
            "salary_expectation": "EUR 75,000",
            "professional_summary": "Backend engineer",
            "cv_text": "Anna CV",
        },
    )
    assert first_profile.status_code == 200
    client.post("/api/v1/auth/logout")

    second_register = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Markus Weber",
            "email": "markus@example.com",
            "password": "supersecret123",
        },
    )
    assert second_register.status_code == 201

    second_profile = client.put(
        "/api/v1/profile",
        json={
            "full_name": "Markus Weber",
            "email": "markus@example.com",
            "phone": "",
            "location": "Munich",
            "target_role": "Data Analyst",
            "years_of_experience": 2,
            "skills": "SQL, Excel",
            "languages": "German B2, English C1",
            "work_authorization": "Blue Card",
            "remote_preference": "On-site",
            "preferred_locations": "Munich",
            "salary_expectation": "EUR 55,000",
            "professional_summary": "Junior analyst",
            "cv_text": "Markus CV",
        },
    )
    assert second_profile.status_code == 200
    client.post("/api/v1/auth/logout")

    login_first_user = client.post(
        "/api/v1/auth/login",
        json={
            "email": "anna@example.com",
            "password": "supersecret123",
        },
    )
    assert login_first_user.status_code == 200

    response = client.get("/api/v1/profile")

    assert response.status_code == 200
    assert response.json()["location"] == "Berlin"
    assert response.json()["target_role"] == "Python Developer"
    assert response.json()["cv_text"] == "Anna CV"
