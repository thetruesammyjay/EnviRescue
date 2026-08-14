from app.utils.image_hash import image_content_hash


def test_image_hash_is_deterministic() -> None:
    assert image_content_hash(b"same image") == image_content_hash(b"same image")
    assert image_content_hash(b"same image") != image_content_hash(b"different image")
