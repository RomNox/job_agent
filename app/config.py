from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict, Field, SecretStr

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")


class Settings(BaseModel):
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

    app_name: str = "job-agent"
    app_env: str = Field(default="development", alias="APP_ENV")
    api_prefix: str = "/api/v1"
    anthropic_api_key: SecretStr | None = Field(default=None, alias="ANTHROPIC_API_KEY")
    jooble_api_key: SecretStr | None = Field(default=None, alias="JOOBLE_API_KEY")
    anthropic_model: str = Field(default="claude-3-5-sonnet-latest", alias="ANTHROPIC_MODEL")
    claude_skills_dir: Path = PROJECT_ROOT / ".claude" / "skills"
    auth_db_path: Path = Field(
        default=PROJECT_ROOT / "data" / "auth.sqlite3",
        alias="AUTH_DB_PATH",
    )
    auth_session_cookie_name: str = Field(
        default="job_agent_session",
        alias="AUTH_SESSION_COOKIE_NAME",
    )
    auth_session_max_age_seconds: int = Field(
        default=60 * 60 * 24 * 7,
        alias="AUTH_SESSION_MAX_AGE_SECONDS",
    )
    frontend_origins: tuple[str, ...] = Field(
        default=(
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3001",
        ),
        alias="FRONTEND_ORIGINS",
    )

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

    @classmethod
    def from_env(cls) -> "Settings":
        return cls.model_validate(
            {
                "APP_ENV": os.getenv("APP_ENV", "development"),
                "ANTHROPIC_API_KEY": os.getenv("ANTHROPIC_API_KEY") or None,
                "JOOBLE_API_KEY": os.getenv("JOOBLE_API_KEY") or None,
                "ANTHROPIC_MODEL": os.getenv(
                    "ANTHROPIC_MODEL",
                    "claude-3-5-sonnet-latest",
                ),
                "AUTH_DB_PATH": os.getenv("AUTH_DB_PATH")
                or (PROJECT_ROOT / "data" / "auth.sqlite3"),
                "AUTH_SESSION_COOKIE_NAME": os.getenv(
                    "AUTH_SESSION_COOKIE_NAME",
                    "job_agent_session",
                ),
                "AUTH_SESSION_MAX_AGE_SECONDS": os.getenv(
                    "AUTH_SESSION_MAX_AGE_SECONDS",
                    str(60 * 60 * 24 * 7),
                ),
                "FRONTEND_ORIGINS": _read_frontend_origins(
                    os.getenv("FRONTEND_ORIGINS")
                ),
            }
        )


@lru_cache
def get_settings() -> Settings:
    return Settings.from_env()


def _read_frontend_origins(value: str | None) -> tuple[str, ...]:
    if not value:
        return (
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3001",
        )

    origins = tuple(item.strip() for item in value.split(",") if item.strip())
    return origins or (
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    )
