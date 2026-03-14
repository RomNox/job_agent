from fastapi import APIRouter

from app.api.routes.agent import router as agent_router
from app.api.routes.applications import router as applications_router
from app.api.routes.jobs import router as jobs_router
from app.api.routes.meta import router as meta_router

api_router = APIRouter()
api_router.include_router(meta_router)
api_router.include_router(agent_router)
api_router.include_router(jobs_router)
api_router.include_router(applications_router)
