import pytest

from app.ai.confidence import requires_manual_review


def test_low_confidence_requires_review() -> None:
    assert requires_manual_review(0.6, 0.8) is True


def test_threshold_confidence_is_accepted() -> None:
    assert requires_manual_review(0.8, 0.8) is False


def test_invalid_confidence_is_rejected() -> None:
    with pytest.raises(ValueError):
        requires_manual_review(1.1, 0.8)
