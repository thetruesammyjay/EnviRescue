from app.ai.remote import _ClassifierCircuit
from app.core.config import settings


def test_classifier_circuit_opens_after_repeated_failures(monkeypatch) -> None:
    monkeypatch.setattr(settings, "ai_circuit_failure_threshold", 2)
    circuit = _ClassifierCircuit()

    circuit.failure()
    assert circuit.allow_request() is True
    circuit.failure()

    assert circuit.allow_request() is False


def test_classifier_circuit_resets_after_success(monkeypatch) -> None:
    monkeypatch.setattr(settings, "ai_circuit_failure_threshold", 1)
    circuit = _ClassifierCircuit()

    circuit.failure()
    assert circuit.allow_request() is False
    circuit.success()

    assert circuit.allow_request() is True
