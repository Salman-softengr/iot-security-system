import pytest
import numpy as np
from inference.model.scorer import Scorer

def test_scorer_initialization():
    scorer = Scorer()
    assert scorer.ae is not None
    assert scorer.iforest is not None

def test_score_range():
    scorer = Scorer()
    features = [10000, 50000, 100] # Normal-ish
    result = scorer.score(features)
    assert 0 <= result["score"] <= 1
    assert "is_anomaly" in result

def test_anomaly_detection():
    scorer = Scorer()
    # High values should trigger anomaly
    high_features = [60000, 1000000, 10000] 
    result = scorer.score(high_features)
    assert result["score"] > 0.5
