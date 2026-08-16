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


def test_cloudinary_storage_deletes_remote_asset(monkeypatch) -> None:
    monkeypatch.setattr(images.settings, "cloudinary_cloud_name", "demo")
    monkeypatch.setattr(images.settings, "cloudinary_api_key", "key")
    monkeypatch.setattr(images.settings, "cloudinary_api_secret", "secret")
    calls = []
    monkeypatch.setattr(
        images.cloudinary.uploader,
        "destroy",
        lambda public_id, **kwargs: calls.append((public_id, kwargs)),
    )

    images.CloudinaryImageStorage().delete(images.ImageAsset("https://example.test/a", "asset-1"))

    assert calls == [("asset-1", {"resource_type": "image", "invalidate": True})]


def test_cloudinary_storage_requires_credentials(monkeypatch) -> None:
    monkeypatch.setattr(images.settings, "cloudinary_cloud_name", None)
    monkeypatch.setattr(images.settings, "cloudinary_api_key", None)
    monkeypatch.setattr(images.settings, "cloudinary_api_secret", None)

    try:
        images.CloudinaryImageStorage()
    except RuntimeError as exc:
        assert "missing configuration" in str(exc)
    else:
        raise AssertionError("Expected missing Cloudinary configuration to fail")
