from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "EnviRescue API"
    app_env: Literal["development", "test", "production"] = "development"
    api_v1_prefix: str = "/api/v1"

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/envirescue"
    upstash_redis_rest_url: str | None = None
    upstash_redis_rest_token: str | None = None

    jwt_secret: str = Field(default="development-only-change-me", min_length=16)
    access_token_expire_minutes: int = Field(default=30, ge=5, le=1440)

    ai_model_name: str | None = None
    ai_confidence_threshold: float = Field(default=0.80, ge=0, le=1)

    frontend_url: AnyHttpUrl = AnyHttpUrl("http://localhost:3000")
    image_storage_provider: Literal["local", "cloud"] = "local"
    image_storage_path: Path = Path("uploads")
    max_image_size_mb: int = Field(default=5, ge=1, le=20)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
