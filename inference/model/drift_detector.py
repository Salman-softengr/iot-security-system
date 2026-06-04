import collections
import numpy as np

class DriftDetector:
    def __init__(self, window_size=100, threshold_multiplier=3):
        self.window = collections.deque(maxlen=window_size)
        self.threshold_multiplier = threshold_multiplier

    def add_score(self, score):
        self.window.append(score)

    def is_drifting(self):
        if len(self.window) < self.window.maxlen:
            return False
        
        recent = list(self.window)[-10:]
        baseline = list(self.window)[:-10]
        
        if np.mean(recent) > np.mean(baseline) + (self.threshold_multiplier * np.std(baseline)):
            return True
        return False
