import pytest

from app.utils.image_validation import validate_image_bytes


def test_invalid_image_bytes_are_rejected() -> None:
    with pytest.raises(ValueError, match="valid"):
        validate_image_bytes(b"not-an-image")
