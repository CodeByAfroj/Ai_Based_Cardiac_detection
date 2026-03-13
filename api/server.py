from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import random

from src.inference.predict import predict_heartbeat
from src.inference.risk_analysis import analyze_risk
from src.inference.heart_metrics import calculate_bpm, calculate_hrv

app = FastAPI()

# Allow React requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class ECGSignal(BaseModel):
    signal: list[float]

rr_history = []

@app.post("/predict")
def predict(data: ECGSignal):

    signal = data.signal

    if len(signal) != 180:
        raise HTTPException(
            status_code=400,
            detail="Signal must contain exactly 180 values"
        )

    signal = np.array(signal)

    heartbeat = predict_heartbeat(signal)

    rr_interval = random.uniform(0.6,1.0)

    bpm = calculate_bpm(rr_interval)

    rr_history.append(rr_interval)

    if len(rr_history) > 10:
        rr_history.pop(0)

    hrv = calculate_hrv(rr_history)

    condition, risk = analyze_risk(heartbeat)

    return {
        "heartbeat": heartbeat,
        "bpm": bpm,
        "hrv": hrv,
        "condition": condition,
        "risk": risk
    }

    signal = np.array(data.signal)

    heartbeat = predict_heartbeat(signal)

    rr_interval = random.uniform(0.6, 1.0)

    bpm = calculate_bpm(rr_interval)

    rr_history.append(rr_interval)
    if len(rr_history) > 10:
        rr_history.pop(0)

    hrv = calculate_hrv(rr_history)

    condition, risk = analyze_risk(heartbeat)

    return {
        "heartbeat": heartbeat,
        "bpm": bpm,
        "hrv": hrv,
        "condition": condition,
        "risk": risk
    }