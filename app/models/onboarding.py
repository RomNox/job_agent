from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class OnboardingStateResponse(BaseModel):
    user_id: str
    current_step: int = Field(default=0, ge=0)
    furthest_step: int = Field(default=0, ge=0)
    completed: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None


class UpdateOnboardingStateRequest(BaseModel):
    current_step: int = Field(ge=0)
    completed: bool = False


class OnboardingStateRecord(OnboardingStateResponse):
    created_at: datetime
    updated_at: datetime
