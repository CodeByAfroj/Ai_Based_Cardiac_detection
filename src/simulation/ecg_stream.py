import time
import numpy as np
from src.data.create_dataset import create_dataset
from src.inference.predict import predict_heartbeat
from src.inference.risk_analysis import analyze_risk
from src.inference.heart_metrics import calculate_bpm, calculate_hrv

def stream_ecg():

    X, y = create_dataset()

    print("Starting ECG stream...")

    rr_history = []

    for beat in X[:50]:

        prediction = predict_heartbeat(beat)

        rr_interval = np.random.uniform(0.6, 1.0)

        bpm = calculate_bpm(rr_interval)

        rr_history.append(rr_interval)

        if len(rr_history) > 10:
            rr_history.pop(0)

        hrv = calculate_hrv(rr_history)

        status, risk = analyze_risk(prediction)

        print("Heartbeat:", prediction)
        print("BPM:", bpm)
        print("HRV:", hrv)
        print("Condition:", status)
        print("Risk Level:", risk)
        print("--------------------------")

        time.sleep(1)

if __name__ == "__main__":
    stream_ecg()