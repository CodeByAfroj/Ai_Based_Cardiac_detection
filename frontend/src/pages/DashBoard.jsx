import ECGChart from "../components/ECGChart";
import MetricCard from "../components/MetricCard";
import Recommendation from "../components/RecommendationPanel";
import Hospitals from "../components/HospitalPanel";
import HeartSection from "../components/HeartSection";
import Emergency from "./Emergency";
import { generateReport } from "../services/reportGenerator";
import { getHeartRegion } from "../utils/HeartMapping";

import { useState, useEffect } from "react";
import axios from "axios";

function DashBoard() {

  const [signal, setSignal] = useState([]);
  const [heartbeat, setHeartbeat] = useState("-");
  const [bpm, setBpm] = useState("-");
  const [hrv, setHrv] = useState("-");
  const [risk, setRisk] = useState("Low");

  const [history, setHistory] = useState([]);
  const [reports, setReports] = useState([]);

  const [region, setRegion] = useState("normal");
  const [seconds, setSeconds] = useState(0);

  const [bpmHistory, setBpmHistory] = useState([]);

  // -----------------------------
  // ECG Generator
  // -----------------------------
  const generateSignal = () => {
    let data = [];
    for (let i = 0; i < 180; i++) {
      let value = Math.sin(i / 10) + Math.random() * 0.05;
      if (i === 80) value = -0.4;
     
      data.push(value);
    }
    return data;
  };

  // -----------------------------
  // REPORT GENERATION
  // -----------------------------
  useEffect(() => {

    let duration = null;

    if (history.length === 60) duration = "1 Minute";
    if (history.length === 300) duration = "5 Minutes";
    if (history.length === 600) duration = "10 Minutes";

    if (duration) {

      const result = generateReport(history, duration);
      setReports(prev => [...prev, result]);

      let abnormalBeat = "N";
      let max = 0;

      Object.entries(result.counts).forEach(([beat, count]) => {
        if (beat !== "N" && count > max) {
          max = count;
          abnormalBeat = beat;
        }
      });

      setRegion(getHeartRegion(abnormalBeat));
    }

  }, [history]);

  // -----------------------------
  // FETCH DATA
  // -----------------------------
  const fetchPrediction = async () => {

    const ecg = generateSignal();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        { signal: ecg }
      );

      setHeartbeat(res.data.heartbeat);
      setBpm(res.data.bpm);
      setHrv(res.data.hrv);
      setRisk(res.data.risk);

      setSignal(ecg);
      setHistory(prev => [...prev, res.data.heartbeat]);

      // 🔥 Trend tracking
      setBpmHistory(prev => [...prev.slice(-20), res.data.bpm]);

    } catch {
      console.log("API error");
    }
  };

  // -----------------------------
  // INTERVAL
  // -----------------------------
  useEffect(() => {

    const interval = setInterval(() => {
      fetchPrediction();
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  // -----------------------------
  // AI INSIGHT
  // -----------------------------
  const getInsight = () => {
    if (risk === "High") return "⚠ Critical abnormal rhythm detected";
    if (risk === "Medium") return "⚡ Mild irregularities observed";
    return "✅ Heart functioning normally";
  };

  return (

    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Cardiac Monitor</h1>

        <div className="flex items-center gap-4">
          <span className="text-green-400 animate-pulse">● LIVE</span>
          <span className="text-gray-400">
            {Math.floor(seconds / 60)}m {seconds % 60}s
          </span>
        </div>
      </div>

    

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="col-span-2 space-y-6">

          {/* ECG */}
          <div className="bg-black rounded-2xl p-4 shadow-[0_0_25px_#00ffcc33]">
            <ECGChart signal={signal} />
          </div>

          {/* METRICS */}
          <div className="grid grid-cols-4 gap-4">

           <MetricCard title="Heartbeat" value={heartbeat} color="text-blue-500" />

          <MetricCard title="BPM" value={bpm} color="text-green-500" />

          <MetricCard title="HRV" value={hrv} color="text-purple-500" />

          <MetricCard
            title="Risk"
            value={risk}
            color={
              risk === "Low"
                ? "text-green-500"
                : risk === "Medium"
                ? "text-yellow-500"
                : "text-red-500"
            }
          />

          </div>

          {/* BPM TREND */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4">
            <h3 className="mb-2 font-semibold">BPM Trend</h3>
            <p className="text-sm text-gray-400">
              {bpmHistory.join(" → ")}
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* AI INSIGHTS */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4">
            <h3 className="font-semibold mb-2">AI Insight</h3>
            <p>{getInsight()}</p>
          </div>

          <Recommendation risk={risk} />

          <HeartSection region={region} />

          <Emergency risk={risk} />

        </div>

      </div>

      {/* REPORTS */}
      <div className="mt-6 space-y-4">

        {reports.map((report, index) => (

          <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4">

            <h2 className="text-xl font-bold mb-2">
              {report.duration} Report
            </h2>

            <p>Total Beats: {report.total}</p>

            <div className="grid grid-cols-5 gap-2 mt-2 text-sm">
              <div>N: {report.counts.N}</div>
              <div>A: {report.counts.A}</div>
              <div>V: {report.counts.V}</div>
              <div>L: {report.counts.L}</div>
              <div>R: {report.counts.R}</div>
            </div>

            <p className="mt-3 text-red-400 font-semibold">
              {report.conclusion}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default DashBoard;