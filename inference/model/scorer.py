import os
import numpy as np
import logging
from .autoencoder import Autoencoder
from .isolation_forest import IForestWrapper

logger = logging.getLogger(__name__)

class Scorer:
    def __init__(self, model_dir="model/saved"):
        self.ae = Autoencoder(input_dim=3)
        self.iforest = IForestWrapper()
        self.model_dir = model_dir
        self.threshold = float(os.getenv("ANOMALY_THRESHOLD", 0.70))
        
        self.load_models()

    def load_models(self):
        ae_path = os.path.join(self.model_dir, "autoencoder.keras")
        iforest_path = os.path.join(self.model_dir, "iforest.joblib")
        
        try:
            if os.path.exists(ae_path):
                self.ae.load(ae_path)
                logger.info("Loaded Autoencoder model.")
            if os.path.exists(iforest_path):
                self.iforest.load(iforest_path)
                logger.info("Loaded Isolation Forest model.")
        except Exception as e:
            logger.error(f"Error loading models: {e}")

    def score(self, features):
        # features: [flow_duration_ms, bytes_out, packets_in]
        x = np.array([features])
        
        # Simple normalization (in production, use a fitted scaler)
        x_norm = x / [60000, 1000000, 10000] 
        x_norm = np.clip(x_norm, 0, 1)

        ae_mse = self.ae.get_reconstruction_error(x_norm)[0]
        iforest_score = self.iforest.get_anomaly_score(x_norm)[0]
        
        # Composite score: 0.7*MSE + 0.3*IForest
        composite = (0.7 * ae_mse) + (0.3 * np.clip(iforest_score, 0, 1))
        
        return {
            "score": float(composite),
            "is_anomaly": bool(composite > self.threshold),
            "mse": float(ae_mse),
            "iforest": float(iforest_score)
        }
