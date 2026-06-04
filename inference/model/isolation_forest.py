from sklearn.ensemble import IsolationForest
import joblib
import numpy as np

class IForestWrapper:
    def __init__(self, contamination=0.1):
        self.model = IsolationForest(contamination=contamination, random_state=42)

    def train(self, x_train):
        self.model.fit(x_train)

    def save(self, path):
        joblib.dump(self.model, path)

    def load(self, path):
        self.model = joblib.load(path)

    def get_anomaly_score(self, x):
        # Decision function returns opposite of the anomaly score (lower is more anomalous)
        # We normalize it so higher is more anomalous
        scores = self.model.decision_function(x)
        # Shift and scale to roughly [0, 1]
        return 1 - (scores + 0.5) 
