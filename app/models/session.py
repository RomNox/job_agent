from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class Session(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    session_token_hash: str
    created_at: datetime
    expires_at: datetime
    user_agent: str | None = None
    ip_address: str | None = None
