
import ECGChart from "./components/ECGChart";
import MetricCard from "./components/MetricCard";
import Recommendation from "./components/RecommendationPanel";
import Hospitals from "./components/HospitalPanel";
import HeartSection from "./components/HeartSection";

import { generateReport } from "./services/reportGenerator";
import { getHeartRegion } from "./utils/HeartMapping";

import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [signal, setSignal] = useState([]);
  const [heartbeat, setHeartbeat] = useState("-");
  const [bpm, setBpm] = useState("-");
  const [hrv, setHrv] = useState("-");
  const [risk, setRisk] = useState("Low");

  const [history, setHistory] = useState([]);
  const [reports, setReports] = useState([]);

  const [region, setRegion] = useState("normal");

  // TIMER STATE
  const [seconds, setSeconds] = useState(0);

  // -----------------------------
  // Fake ECG generator
  // -----------------------------
  const generateSignal = () => {

    let data = [];

    for (let i = 0; i < 180; i++) {

      let value = Math.sin(i / 10) + Math.random() * 0.05;

      if (i === 80) value = -0.4;
      if (i === 82) value = 1.2;
      if (i === 84) value = -0.3;

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

      const counts = result.counts;

      let abnormalBeat = "N";
      let max = 0;

      Object.entries(counts).forEach(([beat, count]) => {

        if (beat !== "N" && count > max) {

          max = count;
          abnormalBeat = beat;

        }

      });

      const affectedRegion = getHeartRegion(abnormalBeat);

      setRegion(affectedRegion);

    }

  }, [history]);

  // -----------------------------
  // FETCH PREDICTION
  // -----------------------------
  const fetchPrediction = async () => {

    const ecg = generateSignal();

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        { signal: ecg }
      );

      const beat = res.data.heartbeat;

      setHeartbeat(beat);
      setBpm(res.data.bpm);
      setHrv(res.data.hrv);
      setRisk(res.data.risk);

      setSignal(ecg);

      setHistory(prev => [...prev, beat]);

    } catch (err) {

      console.log("API error");

    }

  };

  // -----------------------------
  // MAIN INTERVAL
  // -----------------------------
  useEffect(() => {

    const interval = setInterval(() => {

      fetchPrediction();
      setSeconds(prev => prev + 1);

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  // -----------------------------
  // NEXT REPORT COUNTDOWN
  // -----------------------------
  const nextReport = () => {

    if (seconds < 60) return 60 - seconds;
    if (seconds < 300) return 300 - seconds;
    if (seconds < 600) return 600 - seconds;

    return 0;

  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-center mb-10">
        AI Cardiac Monitoring Dashboard
      </h1>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* TIMER PANEL */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          <div className="flex justify-between items-center">

            <h2 className="text-lg font-semibold">
              Monitoring Time
            </h2>

            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(seconds / 60)}m {seconds % 60}s
            </div>

          </div>

          <p className="text-gray-600 mt-2">
            Next report in: {Math.floor(nextReport() / 60)}m {nextReport() % 60}s
          </p>

        </div>

        {/* ECG CHART */}

        <ECGChart signal={signal} />

        {/* METRICS */}

        <div className="grid grid-cols-4 gap-6">

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

        {/* RECOMMENDATION + HOSPITAL */}

        <div className="grid grid-cols-2 gap-6">

          <Recommendation risk={risk} />

          <Hospitals />

        </div>

        {/* HEART VISUALIZATION */}

        {reports.length > 0 && (

          <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-4">
              AI Heart Visualization
            </h2>

            <p className="mb-4 text-gray-600">
              Highlighted region shows where abnormal electrical activity is detected.
            </p>

            <HeartSection region={region} />

          </div>

        )}

        {/* REPORTS */}

        {reports.map((report, index) => (

          <div key={index} className="bg-white shadow-lg rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              {report.duration} Heart Report
            </h2>

            <p>Total Beats Analyzed: {report.total}</p>

            <div className="grid grid-cols-5 gap-4 mt-4">

              <div>Normal: {report.counts.N}</div>
              <div>Atrial: {report.counts.A}</div>
              <div>Ventricular: {report.counts.V}</div>
              <div>LBBB: {report.counts.L}</div>
              <div>RBBB: {report.counts.R}</div>

            </div>

            <p className="mt-6 text-xl font-semibold text-red-500">
              Conclusion: {report.conclusion}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default App;

