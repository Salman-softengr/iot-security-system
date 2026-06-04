import pandas as pd
import numpy as np
import os
from autoencoder import Autoencoder
from isolation_forest import IForestWrapper

def generate_synthetic_data(n_samples=1000):
    # Features: flow_duration_ms, bytes_out, packets_in
    data = {
        'flow_duration_ms': np.random.normal(10000, 1000, n_samples),
        'bytes_out': np.random.normal(50000, 5000, n_samples),
        'packets_in': np.random.normal(100, 10, n_samples)
    }
    return pd.DataFrame(data)

def train():
    print("Generating training data...")
    df = generate_synthetic_data()
    
    # Normalize
    x_train = df.values / [60000, 1000000, 10000]
    x_train = np.clip(x_train, 0, 1)

    print("Training Autoencoder...")
    ae = Autoencoder(input_dim=3)
    ae.train(x_train, epochs=20)
    
    print("Training Isolation Forest...")
    iforest = IForestWrapper()
    iforest.train(x_train)

    # Save
    os.makedirs("model/saved", exist_ok=True)
    ae.save("model/saved/autoencoder.keras")
    iforest.save("model/saved/iforest.joblib")
    print("Models saved to model/saved/")

if __name__ == "__main__":
    train()
