import uuid
from pathlib import Path

from app.core.config import settings


class LocalImageStorage:
    def __init__(self, base_path: Path | None = None) -> None:
        self.base_path = base_path or settings.image_storage_path

    def save(self, content: bytes, extension: str) -> str:
        self.base_path.mkdir(parents=True, exist_ok=True)
        safe_extension = extension.lower().lstrip(".")
        if safe_extension not in {"jpg", "jpeg", "png", "webp"}:
            raise ValueError("Unsupported image extension.")
        filename = f"{uuid.uuid4()}.{safe_extension}"
        target = self.base_path / filename
        target.write_bytes(content)
        return str(target.as_posix())


image_storage = LocalImageStorage()
