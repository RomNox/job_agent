from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    email: str
    password_hash: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
