from fastapi import APIRouter, HTTPException

import requests
from math import radians, sin, cos, sqrt, atan2

import numpy as np
import random



from app.schemas.ecg_schema import ECGSignal
from src.inference.predict import predict_heartbeat
from src.inference.risk_analysis import analyze_risk
from src.inference.heart_metrics import calculate_bpm, calculate_hrv

router = APIRouter()

rr_history = []

# =========================================
# 🔵 ECG PREDICTION API
# =========================================
@router.post("/predict")
def predict(data: ECGSignal):

    signal = data.signal

    if len(signal) != 180:
        raise HTTPException(
            status_code=400,
            detail="Signal must contain exactly 180 values"
        )

    signal = np.array(signal)

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



@router.post("/nearest-hospital")
def get_hospitals(data: dict):

    lat = data.get("lat")
    lng = data.get("lng")

    if lat is None or lng is None:
        raise HTTPException(status_code=400, detail="lat/lng required")

    overpass_url = "https://overpass-api.de/api/interpreter"

    # 🔥 Cardiac hospitals
    query = f"""
    [out:json];
    node["amenity"="hospital"]["name"~"cardiac|heart|cardio",i](around:10000,{lat},{lng});
    out;
    """

    res = requests.post(overpass_url, data=query).json()
    elements = res.get("elements", [])

    # 🔁 fallback
    if not elements:
        query = f"""
        [out:json];
        node["amenity"="hospital"](around:10000,{lat},{lng});
        out;
        """
        res = requests.post(overpass_url, data=query).json()
        elements = res.get("elements", [])

    if not elements:
        raise HTTPException(status_code=404, detail="No hospitals found")

    def dist(a,b,c,d):
        R=6371
        dlat=radians(c-a)
        dlon=radians(d-b)
        x=sin(dlat/2)**2+cos(radians(a))*cos(radians(c))*sin(dlon/2)**2
        return R*2*atan2(sqrt(x),sqrt(1-x))

    hospitals = []

    for h in elements:
        h_lat = h["lat"]
        h_lng = h["lon"]

        hospitals.append({
            "name": h.get("tags", {}).get("name", "Hospital"),
            "distance": round(dist(lat,lng,h_lat,h_lng),2),
            "location": {"lat": h_lat, "lng": h_lng}
        })

    hospitals.sort(key=lambda x: x["distance"])

    return hospitals[:3]

    lat = data.get("lat")
    lng = data.get("lng")

    if lat is None or lng is None:
        raise HTTPException(status_code=400, detail="Latitude and Longitude required")

    overpass_url = "https://overpass-api.de/api/interpreter"

    # 🔥 STEP 1: CARDIAC HOSPITAL SEARCH
    cardiac_query = f"""
    [out:json];
    (
      node["amenity"="hospital"]["name"~"cardiac|heart|cardio",i](around:10000,{lat},{lng});
    );
    out;
    """

    response = requests.post(overpass_url, data=cardiac_query).json()
    elements = response.get("elements", [])

    # 🔁 STEP 2: FALLBACK → GENERAL HOSPITALS
    if not elements:
        general_query = f"""
        [out:json];
        (
          node["amenity"="hospital"](around:10000,{lat},{lng});
        );
        out;
        """

        response = requests.post(overpass_url, data=general_query).json()
        elements = response.get("elements", [])

    if not elements:
        raise HTTPException(status_code=404, detail="No hospitals found nearby")

    # =========================================
    # 📏 DISTANCE CALCULATION (HAVERSINE)
    # =========================================
    def calculate_distance(lat1, lon1, lat2, lon2):
        R = 6371  # Earth radius (km)

        dlat = radians(lat2 - lat1)
        dlon = radians(lon2 - lon1)

        a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return R * c

    hospitals = []

    # =========================================
    # 🔥 PROCESS HOSPITAL DATA
    # =========================================
    for h in elements:

        # ✅ Only node → exact coordinates
        h_lat = h["lat"]
        h_lng = h["lon"]

        distance = calculate_distance(lat, lng, h_lat, h_lng)

        hospitals.append({
            "name": h.get("tags", {}).get("name", "Nearby Hospital"),
            "distance": round(distance, 2),
            "location": {
                "lat": h_lat,
                "lng": h_lng
            }
        })

    # =========================================
    # 🔥 SORT + RETURN TOP 3
    # =========================================
    hospitals.sort(key=lambda x: x["distance"])

    return hospitals[:3]