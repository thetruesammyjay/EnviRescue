import io

from PIL import Image, UnidentifiedImageError


def validate_image_bytes(content: bytes) -> None:
    """Reject files that are not decodable raster images, regardless of MIME type."""
    try:
        with Image.open(io.BytesIO(content)) as image:
            image.verify()
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("Please upload a valid JPEG, PNG, or WebP image.") from exc
