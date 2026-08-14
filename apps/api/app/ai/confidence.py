def requires_manual_review(confidence: float, threshold: float) -> bool:
    if not 0 <= confidence <= 1:
        raise ValueError("Confidence must be between 0 and 1.")
    return confidence < threshold
