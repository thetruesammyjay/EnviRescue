from app.storage import images


def test_cloudinary_storage_returns_secure_asset(monkeypatch) -> None:
    monkeypatch.setattr(images.settings, "cloudinary_cloud_name", "demo")
    monkeypatch.setattr(images.settings, "cloudinary_api_key", "key")
    monkeypatch.setattr(images.settings, "cloudinary_api_secret", "secret")
    monkeypatch.setattr(
        images.cloudinary.uploader,
        "upload",
        lambda *_args, **_kwargs: {
            "secure_url": "https://res.cloudinary.com/demo/image/upload/test.jpg",
            "public_id": "envirescue/waste/test",
        },
    )

    storage = images.CloudinaryImageStorage()
    asset = storage.save(b"image", "jpg")

    assert asset.url.startswith("https://res.cloudinary.com/")
    assert asset.public_id == "envirescue/waste/test"
