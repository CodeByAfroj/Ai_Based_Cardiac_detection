import numpy as np
import tensorflow as tf
import joblib

# Load model
model = tf.keras.models.load_model("models/cardiac_model.keras")

# Load encoder
encoder = joblib.load("models/label_encoder.pkl")


def predict_heartbeat(signal):

    signal = np.array(signal)

    # normalize
    signal = (signal - np.mean(signal)) / np.std(signal)

    signal = signal.reshape(1,180,1)

    prediction = model.predict(signal)

    class_index = np.argmax(prediction)

    label = encoder.inverse_transform([class_index])

    return label[0]