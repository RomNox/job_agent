from __future__ import annotations

from typing import Any, Mapping, Sequence

from app.models.agent_io import AgentResponse
from app.services.claude_service import ClaudeService

DEFAULT_SYSTEM_PROMPT = (
    "You are JobAgent, an AI assistant that helps users find jobs and Ausbildung "
    "positions in Germany. Provide structured, actionable guidance and call out "
    "missing information."
)


class JobAgent:
    def __init__(self, claude_service: ClaudeService) -> None:
        self._claude_service = claude_service

    async def run(
        self,
        prompt: str,
        *,
        context: Mapping[str, Any] | None = None,
        skills: Sequence[str] | None = None,
    ) -> AgentResponse:
        result = await self._claude_service.generate_response(
            prompt=prompt,
            system_prompt=DEFAULT_SYSTEM_PROMPT,
            context=context,
            skills=skills,
        )
        return AgentResponse(
            text=result["text"],
            model=result["model"],
            skills_used=list(skills or []),
            usage=result["usage"],
        )
