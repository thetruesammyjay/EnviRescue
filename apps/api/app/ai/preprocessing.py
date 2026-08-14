from io import BytesIO

from PIL import Image, ImageOps

ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}


def prepare_image(content: bytes, size: tuple[int, int] = (224, 224)) -> Image.Image:
    image = Image.open(BytesIO(content))
    if image.format not in ALLOWED_FORMATS:
        raise ValueError("Only JPEG, PNG, and WebP images are supported.")
    image = ImageOps.exif_transpose(image).convert("RGB")
    return ImageOps.fit(image, size, method=Image.Resampling.LANCZOS)
