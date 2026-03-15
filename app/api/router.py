from fastapi import APIRouter

from app.api.routes.auth import router as auth_router
from app.api.routes.agent import router as agent_router
from app.api.routes.applications import router as applications_router
from app.api.routes.jobs import router as jobs_router
from app.api.routes.meta import router as meta_router
from app.api.routes.onboarding import router as onboarding_router
from app.api.routes.profile import router as profile_router
from app.api.routes.search import router as search_router

api_router = APIRouter()
api_router.include_router(meta_router)
api_router.include_router(auth_router)
api_router.include_router(onboarding_router)
api_router.include_router(profile_router)
api_router.include_router(agent_router)
api_router.include_router(jobs_router)
api_router.include_router(applications_router)
api_router.include_router(search_router)
