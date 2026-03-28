import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Emergency = ({ risk }) => {

  const [location, setLocation] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [nearestHospital, setNearestHospital] = useState([]);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const highStartTimeRef = useRef(null);

  const THRESHOLD_TIME = 10;

  // -----------------------------
  // LOAD LOCATION (NON-BLOCKING)
  // -----------------------------
  useEffect(() => {
    const saved = localStorage.getItem("user_location");
    if (saved) setLocation(JSON.parse(saved));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(loc);
        localStorage.setItem("user_location", JSON.stringify(loc));
      },
      () => console.log("Location error")
    );
  }, []);

  // -----------------------------
  // TRACK HIGH RISK
  // -----------------------------
  useEffect(() => {
    if (risk === "High") {
      if (!highStartTimeRef.current) {
        highStartTimeRef.current = Date.now();
      }
    } else {
      highStartTimeRef.current = null;
      setElapsedTime(0);
    }
  }, [risk]);

  // -----------------------------
  // TIMER ENGINE (REAL-TIME)
  // -----------------------------
  useEffect(() => {

    const interval = setInterval(() => {

      if (!highStartTimeRef.current) return;

      const now = Date.now();
      const elapsed = (now - highStartTimeRef.current) / 1000;

      setElapsedTime(Math.floor(elapsed));

      // 🚑 EMERGENCY TRIGGER
      if (elapsed >= THRESHOLD_TIME && !alertTriggered && !cooldown) {

        console.log("🚑 EMERGENCY TRIGGERED");

        setAlertTriggered(true);
        setCooldown(true);

        fetchHospitalFast();

        // 🔊 Voice alert
        const msg = new SpeechSynthesisUtterance(
          "Emergency detected. Please go to nearest cardiac hospital."
        );
        window.speechSynthesis.speak(msg);

        // ⏳ Cooldown 60 sec
        setTimeout(() => {
          setCooldown(false);
          setAlertTriggered(false);
          highStartTimeRef.current = null;
          setElapsedTime(0);
        }, 60000);
      }

    }, 500); // fast detection

    return () => clearInterval(interval);

  }, [alertTriggered, cooldown]);

  // -----------------------------
  // FAST API CALL
  // -----------------------------
  const fetchHospitalFast = async () => {

    let loc = location;

    if (!loc) {
      const saved = localStorage.getItem("user_location");
      if (saved) loc = JSON.parse(saved);
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/nearest-hospital",
        loc || { lat: 0, lng: 0 }
      );

      setNearestHospital(res.data);

    } catch (err) {
      console.log("Hospital fetch error:", err);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  const remaining = THRESHOLD_TIME - elapsedTime;

  return (
    <div className="mt-4">

      <div className="text-xs text-yellow-400">
        Risk: {risk} | Time: {elapsedTime}s | Cooldown: {cooldown ? "ON" : "OFF"}
      </div>

      <div className="text-xs text-gray-400 mb-2">
        {highStartTimeRef.current
          ? `🚨 Emergency in ${remaining}s`
          : "✅ Stable"}
      </div>

      {nearestHospital.length > 0 && (
        <div className="bg-red-500/20 border border-red-500 p-4 rounded-xl animate-pulse">

          <h3 className="text-red-400 font-bold text-lg mb-2">
            🚑 Emergency Assistance Activated
          </h3>

          {nearestHospital.map((h, i) => (
            <div key={i} className="mb-3">
              <h4 className="text-white font-semibold">🏥 {h.name}</h4>
              <p className="text-sm text-gray-300">📍 {h.distance} km</p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${h.location.lat},${h.location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline"
              >
                Open in Maps
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Emergency;