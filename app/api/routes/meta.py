from typing import Any

from fastapi import APIRouter, Depends

from app.config import Settings
from app.dependencies import get_app_settings, get_skill_registry
from app.services.skill_registry import ClaudeSkillRegistry

router = APIRouter(tags=["meta"])


@router.get("/info", summary="Service metadata")
async def get_info(
    settings: Settings = Depends(get_app_settings),
    skill_registry: ClaudeSkillRegistry = Depends(get_skill_registry),
) -> dict[str, Any]:
    return {
        "service": settings.app_name,
        "environment": settings.app_env,
        "available_skills": skill_registry.available_skills(),
    }
