import tensorflow as tf
from tensorflow.keras import layers, models

class Autoencoder:
    def __init__(self, input_dim=3):
        self.input_dim = input_dim
        self.model = self._build_model()

    def _build_model(self):
        model = models.Sequential([
            # Encoder
            layers.Dense(8, activation='relu', input_shape=(self.input_dim,)),
            layers.Dense(3, activation='relu'),
            # Decoder
            layers.Dense(8, activation='relu'),
            layers.Dense(self.input_dim, activation='sigmoid')
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def train(self, x_train, epochs=50, batch_size=32):
        return self.model.fit(x_train, x_train, epochs=epochs, batch_size=batch_size, verbose=0)

    def save(self, path):
        self.model.save(path)

    def load(self, path):
        self.model = tf.keras.models.load_model(path)

    def get_reconstruction_error(self, x):
        reconstructions = self.model.predict(x, verbose=0)
        mse = tf.reduce_mean(tf.square(x - reconstructions), axis=1)
        return mse.numpy()
