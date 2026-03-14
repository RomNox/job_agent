from fastapi import APIRouter, Depends

from app.config import Settings
from app.dependencies import get_app_settings

router = APIRouter(tags=["health"])


@router.get("/health", summary="Service health check")
async def health_check(
    settings: Settings = Depends(get_app_settings),
) -> dict[str, str]:
    return {"status": "ok", "environment": settings.app_env}
