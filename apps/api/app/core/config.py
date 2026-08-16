from functools import lru_cache
from pathlib import Path
from typing import Literal
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from pydantic import AnyHttpUrl, Field, field_validator
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

    ai_provider: Literal["remote", "fallback"] = "fallback"
    ai_model_name: str | None = None
    ai_classifier_url: AnyHttpUrl | None = None
    hf_api_token: str | None = None
    ai_request_timeout_seconds: float = Field(default=30, ge=1, le=120)
    ai_max_retries: int = Field(default=2, ge=0, le=5)
    ai_retry_backoff_seconds: float = Field(default=0.5, ge=0, le=10)
    ai_circuit_failure_threshold: int = Field(default=3, ge=1, le=20)
    ai_circuit_recovery_seconds: float = Field(default=30, ge=1, le=600)
    ai_confidence_threshold: float = Field(default=0.80, ge=0, le=1)

    frontend_url: AnyHttpUrl = AnyHttpUrl("http://localhost:3000")
    cors_origins: list[AnyHttpUrl] = []
    rate_limit_window_seconds: int = Field(default=60, ge=1, le=3600)
    rate_limit_max_requests: int = Field(default=30, ge=1, le=1000)
    image_storage_provider: Literal["local", "cloudinary"] = "local"
    image_storage_path: Path = Path("uploads")
    max_image_size_mb: int = Field(default=5, ge=1, le=20)
    cloudinary_cloud_name: str | None = None
    cloudinary_api_key: str | None = None
    cloudinary_api_secret: str | None = None
    cloudinary_folder: str = "envirescue/waste"

    @field_validator("ai_classifier_url", mode="before")
    @classmethod
    def empty_classifier_url_is_none(cls, value: object) -> object:
        return None if value == "" else value

    @field_validator(
        "upstash_redis_rest_url",
        "upstash_redis_rest_token",
        "hf_api_token",
        "cloudinary_cloud_name",
        "cloudinary_api_key",
        "cloudinary_api_secret",
        mode="before",
    )
    @classmethod
    def clean_optional_secret_values(cls, value: object) -> object:
        if value is None:
            return None
        cleaned = str(value).strip()
        return cleaned.strip("\"'“”‘’") or None

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_async_database_url(cls, value: object) -> object:
        if not isinstance(value, str):
            return value
        normalized = value.replace("postgres://", "postgresql://", 1)
        if normalized.startswith("postgresql://"):
            normalized = normalized.replace("postgresql://", "postgresql+asyncpg://", 1)
        parts = urlsplit(normalized)
        query = dict(parse_qsl(parts.query, keep_blank_values=True))
        if query.pop("sslmode", None) == "require":
            query["ssl"] = "require"
        query.pop("channel_binding", None)
        query.pop("connect_timeout", None)
        return urlunsplit(
            (parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment)
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
