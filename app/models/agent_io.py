from typing import Any

from pydantic import BaseModel, Field


class AgentRequest(BaseModel):
    prompt: str = Field(
        ...,
        min_length=1,
        description="The user request for the job agent.",
    )
    context: dict[str, Any] = Field(
        default_factory=dict,
        description="Structured context passed to Claude.",
    )
    skills: list[str] = Field(
        default_factory=list,
        description="Claude Agent Skills to inject into the request.",
    )


class AgentResponse(BaseModel):
    text: str
    model: str
    skills_used: list[str] = Field(default_factory=list)
    usage: dict[str, Any] | None = None
