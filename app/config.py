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
    anthropic_model: str = Field(default="claude-3-5-sonnet-latest", alias="ANTHROPIC_MODEL")
    claude_skills_dir: Path = PROJECT_ROOT / ".claude" / "skills"

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

    @classmethod
    def from_env(cls) -> "Settings":
        return cls.model_validate(
            {
                "APP_ENV": os.getenv("APP_ENV", "development"),
                "ANTHROPIC_API_KEY": os.getenv("ANTHROPIC_API_KEY") or None,
                "ANTHROPIC_MODEL": os.getenv(
                    "ANTHROPIC_MODEL",
                    "claude-3-5-sonnet-latest",
                ),
            }
        )


@lru_cache
def get_settings() -> Settings:
    return Settings.from_env()
