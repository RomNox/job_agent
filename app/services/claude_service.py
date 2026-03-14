from __future__ import annotations

import json
from typing import Any, Mapping, Sequence

from anthropic import AsyncAnthropic

from app.config import Settings
from app.services.skill_registry import ClaudeSkillRegistry


class ClaudeService:
    def __init__(
        self,
        settings: Settings,
        skill_registry: ClaudeSkillRegistry,
    ) -> None:
        self._settings = settings
        self._skill_registry = skill_registry
        self._client = None

        if settings.anthropic_api_key is not None:
            self._client = AsyncAnthropic(
                api_key=settings.anthropic_api_key.get_secret_value(),
            )

    async def generate_response(
        self,
        prompt: str,
        *,
        system_prompt: str | None = None,
        context: Mapping[str, Any] | None = None,
        skills: Sequence[str] | None = None,
        max_tokens: int = 1024,
    ) -> dict[str, Any]:
        if self._client is None:
            raise RuntimeError("ANTHROPIC_API_KEY is not configured.")

        response = await self._client.messages.create(
            model=self._settings.anthropic_model,
            max_tokens=max_tokens,
            system=self._build_system_prompt(
                system_prompt=system_prompt,
                context=context,
                skills=skills,
            ),
            messages=[{"role": "user", "content": prompt}],
        )

        text_blocks = [
            block.text
            for block in response.content
            if getattr(block, "type", None) == "text"
        ]

        usage = None
        if getattr(response, "usage", None) is not None:
            usage = (
                response.usage.model_dump()
                if hasattr(response.usage, "model_dump")
                else dict(response.usage)
            )

        return {
            "text": "\n".join(text_blocks).strip(),
            "model": response.model,
            "usage": usage,
        }

    def _build_system_prompt(
        self,
        *,
        system_prompt: str | None,
        context: Mapping[str, Any] | None,
        skills: Sequence[str] | None,
    ) -> str:
        sections = [system_prompt or "You are a helpful job search assistant."]

        if context:
            sections.append(
                "Execution context:\n"
                + json.dumps(context, indent=2, ensure_ascii=False, default=str)
            )

        if skills:
            sections.append(
                "Claude Agent Skills:\n"
                + self._skill_registry.render_skill_context(skills)
            )

        return "\n\n".join(sections)
