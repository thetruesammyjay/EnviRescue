import uuid

from app.schemas.classification import ClassificationResult


def test_classifier_failure_is_represented_without_a_category() -> None:
    result = ClassificationResult(
        waste_report_id=uuid.uuid4(),
        requires_review=True,
        status="failed",
        source="ai",
        error_message="AI classification is unavailable; choose a category manually.",
    )

    assert result.category is None
    assert result.confidence is None
    assert result.status == "failed"
    assert result.requires_review is True


def test_manual_classification_is_accepted() -> None:
    result = ClassificationResult(
        waste_report_id=uuid.uuid4(),
        category="Plastic",
        confidence=1,
        requires_review=False,
        status="accepted",
        source="manual",
    )

    assert result.category == "Plastic"
    assert result.source == "manual"
    assert result.status == "accepted"
