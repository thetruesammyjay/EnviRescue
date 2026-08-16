import time
from collections import defaultdict, deque
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from app.ai.remote import _circuit
from app.api.routes import api_router
from app.core.cache import cache
from app.core.config import settings
from app.core.database import SessionLocal
from app.core.observability import RequestLoggingMiddleware
from app.core.security_headers import SecurityHeadersMiddleware


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
    allow_origins=[str(settings.frontend_url), *(str(origin) for origin in settings.cors_origins)],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class _RequestRateLimiter(BaseHTTPMiddleware):
    """Small process-local limiter; use Redis counters when running multiple replicas."""

    protected_paths = {
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/classifications/image",
    }

    def __init__(self, app) -> None:
        super().__init__(app)
        self._requests: defaultdict[str, deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint):
        if request.url.path not in self.protected_paths:
            return await call_next(request)
        now = time.monotonic()
        key = f"{request.client.host if request.client else 'unknown'}:{request.url.path}"
        redis_count = cache.increment_with_window(
            f"rate-limit:{key}", settings.rate_limit_window_seconds
        )
        if redis_count is not None:
            if redis_count > settings.rate_limit_max_requests:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests. Please try again later."},
                    headers={"Retry-After": str(settings.rate_limit_window_seconds)},
                )
            return await call_next(request)
        timestamps = self._requests[key]
        cutoff = now - settings.rate_limit_window_seconds
        while timestamps and timestamps[0] <= cutoff:
            timestamps.popleft()
        if len(timestamps) >= settings.rate_limit_max_requests:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."},
                headers={"Retry-After": str(settings.rate_limit_window_seconds)},
            )
        timestamps.append(now)
        return await call_next(request)


app.add_middleware(_RequestRateLimiter)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

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


@app.get("/health/ai", tags=["system"])
async def ai_health() -> dict[str, str | bool | None]:
    """Report classifier configuration and circuit state without invoking the model."""
    configured = settings.ai_provider == "fallback" or settings.ai_classifier_url is not None
    circuit_open = not _circuit.allow_request() if settings.ai_provider == "remote" else False
    return {
        "status": "healthy" if configured and not circuit_open else "degraded",
        "provider": settings.ai_provider,
        "configured": configured,
        "circuit_open": circuit_open,
        "model": settings.ai_model_name,
    }
