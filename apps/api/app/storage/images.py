import uuid
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path

import cloudinary
import cloudinary.uploader

from app.core.config import settings

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}


@dataclass(frozen=True)
class ImageAsset:
    url: str
    public_id: str | None = None


class LocalImageStorage:
    def __init__(self, base_path: Path | None = None) -> None:
        self.base_path = base_path or settings.image_storage_path

    def save(self, content: bytes, extension: str) -> ImageAsset:
        self.base_path.mkdir(parents=True, exist_ok=True)
        safe_extension = extension.lower().lstrip(".")
        if safe_extension not in ALLOWED_EXTENSIONS:
            raise ValueError("Unsupported image extension.")
        filename = f"{uuid.uuid4()}.{safe_extension}"
        target = self.base_path / filename
        target.write_bytes(content)
        return ImageAsset(url=str(target.as_posix()), public_id=str(target))

    def delete(self, asset: ImageAsset) -> None:
        if asset.public_id:
            Path(asset.public_id).unlink(missing_ok=True)


class CloudinaryImageStorage:
    def __init__(self) -> None:
        missing = [
            name
            for name, value in {
                "CLOUDINARY_CLOUD_NAME": settings.cloudinary_cloud_name,
                "CLOUDINARY_API_KEY": settings.cloudinary_api_key,
                "CLOUDINARY_API_SECRET": settings.cloudinary_api_secret,
            }.items()
            if not value
        ]
        if missing:
            raise RuntimeError(f"Cloudinary storage is missing configuration: {', '.join(missing)}")
        cloudinary.config(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret,
            secure=True,
        )

    def save(self, content: bytes, extension: str) -> ImageAsset:
        safe_extension = extension.lower().lstrip(".")
        if safe_extension not in ALLOWED_EXTENSIONS:
            raise ValueError("Unsupported image extension.")
        result = cloudinary.uploader.upload(
            BytesIO(content),
            resource_type="image",
            folder=settings.cloudinary_folder,
            format="jpg" if safe_extension == "jpeg" else safe_extension,
        )
        return ImageAsset(url=str(result["secure_url"]), public_id=str(result["public_id"]))

    def delete(self, asset: ImageAsset) -> None:
        if asset.public_id:
            cloudinary.uploader.destroy(
                asset.public_id,
                resource_type="image",
                invalidate=True,
            )


def build_image_storage() -> LocalImageStorage | CloudinaryImageStorage:
    if settings.image_storage_provider == "cloudinary":
        return CloudinaryImageStorage()
    return LocalImageStorage()


image_storage = build_image_storage()
