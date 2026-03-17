
import numpy as np
import tensorflow as tf
import joblib
from huggingface_hub import hf_hub_download

# Download model
model_path = hf_hub_download(
    repo_id="mulaniafroj/arrhythmia",
    filename="best_cardiac_model.keras"
)

# Download encoder
encoder_path = hf_hub_download(
    repo_id="mulaniafroj/arrhythmia",
    filename="label_encoder.pkl"
)

# Load model
model = tf.keras.models.load_model(model_path)

# Load encoder
encoder = joblib.load(encoder_path)


def predict_heartbeat(ecg_signal):

    ecg_signal = np.array(ecg_signal)

    ecg_signal = (ecg_signal - np.mean(ecg_signal)) / np.std(ecg_signal)

    ecg_signal = ecg_signal.reshape(1,180,1)

    prediction = model.predict(ecg_signal)

    class_index = np.argmax(prediction)

    label = encoder.inverse_transform([class_index])

    return label[0]