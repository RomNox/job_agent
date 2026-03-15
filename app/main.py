from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.api.routes.health import router as health_router
from app.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    application = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="AI job search agent skeleton for the German market.",
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.frontend_origins),
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "OPTIONS"],
        allow_headers=["*"],
    )
    application.include_router(health_router)
    application.include_router(api_router, prefix=settings.api_prefix)

    @application.get("/", tags=["meta"])
    async def root() -> dict[str, str]:
        return {"service": settings.app_name, "docs_url": "/docs"}

    return application


app = create_app()
