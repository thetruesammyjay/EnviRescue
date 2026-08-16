from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.routes import api_router
from app.core.config import settings
from app.core.database import SessionLocal


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Initialize and release application resources."""
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="API for AI-assisted waste reporting and recycling guidance.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(settings.frontend_url)],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/", tags=["system"])
async def root() -> dict[str, str]:
    return {"name": settings.app_name, "status": "healthy"}


@app.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    return {"status": "healthy", "service": "envirescue-api"}


@app.get("/health/live", tags=["system"])
async def liveness() -> dict[str, str]:
    """Confirm that the process is running without requiring external services."""
    return {"status": "alive", "service": "envirescue-api"}


@app.get("/health/ready", tags=["system"])
async def readiness() -> dict[str, str]:
    """Confirm that the API can reach its required PostgreSQL dependency."""
    try:
        async with SessionLocal() as session:
            await session.execute(text("SELECT 1"))
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Database is not ready.") from exc
    return {"status": "ready", "service": "envirescue-api"}
