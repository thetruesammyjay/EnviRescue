import pytest

from scripts.classification_worker import MAX_ATTEMPTS


def test_worker_has_bounded_retry_policy() -> None:
    assert MAX_ATTEMPTS == 3


@pytest.mark.parametrize("attempts", [1, 2])
def test_retry_attempts_are_below_terminal_limit(attempts: int) -> None:
    assert attempts < MAX_ATTEMPTS
