import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

function App() {

  const [ecgData, setEcgData] = useState([]);
  const [heartbeat, setHeartbeat] = useState("Waiting...");
  const [bpm, setBpm] = useState("--");
  const [hrv, setHrv] = useState("--");
  const [risk, setRisk] = useState("--");

  // Fake ECG generator (P-QRS-T pattern)
  const generateSignal = () => {

    let signal = [];

    for (let i = 0; i < 180; i++) {

      let value = Math.random() * 0.02;

    if(i==80) value += 1; // R peak
      signal.push(value);
    }



      // if (i >= 40 && i <= 50)
      //   value += Math.sin((i - 40) / 10 * Math.PI) * 0.15;

      // if (i === 80) value = -0.25;
      // if (i === 82) value = 1.2;
      // if (i === 84) value = -0.35;

      // if (i >= 110 && i <= 125)
      //   value += Math.sin((i - 110) / 15 * Math.PI) * 0.35;


    return signal;
  };

  const fetchPrediction = async () => {

    try {

      const signal = generateSignal();

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ signal })
      });

      const data = await response.json();
      console.log("API response:", data);

      setHeartbeat(data.heartbeat || "Unknown");
      setBpm(data.bpm || "--");
      setHrv(data.hrv || "--");
      setRisk(data.risk || "--");

      setEcgData(signal);

    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {

    const interval = setInterval(fetchPrediction, 1000);

    return () => clearInterval(interval);

  }, []);

  // Heartbeat color logic
  let heartbeatColor = "white";

  if (heartbeat === "N") heartbeatColor = "#00ff90";
  else if (heartbeat === "A") heartbeatColor = "#ffae00";
  else if (heartbeat === "V") heartbeatColor = "#ff3b3b";
  else if (heartbeat === "!") heartbeatColor = "#888";

  // Risk color
  let riskColor = "#00ff90";

  if (risk === "Medium") riskColor = "#ffae00";
  if (risk === "High") riskColor = "#ff3b3b";

  const chartData = {
    labels: ecgData.map((_, i) => i),
    datasets: [
      {
        label: "ECG Signal",
        data: ecgData,
        borderColor: "#00ff90",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    animation: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  };

  return (

    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "white",
      fontFamily: "Arial",
      padding: "40px"
    }}>

      <h1 style={{
        textAlign: "center",
        marginBottom: "40px",
        letterSpacing: "2px"
      }}>
        AI Cardiac Monitor
      </h1>

      <div style={{
        display: "flex",
        justifyContent: "space-around",
        marginBottom: "40px",
        flexWrap: "wrap",
        gap: "20px"
      }}>

        <div style={cardStyle}>
          <h3>Heartbeat</h3>
          <h2 style={{ color: heartbeatColor }}>{heartbeat}</h2>
        </div>

        <div style={cardStyle}>
          <h3>BPM</h3>
          <h2>{bpm}</h2>
        </div>

        <div style={cardStyle}>
          <h3>HRV</h3>
          <h2>{hrv}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Risk Level</h3>
          <h2 style={{ color: riskColor }}>{risk}</h2>
        </div>

      </div>

      <div style={{
        background: "#111",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 20px #00ff9040"
      }}>
        <Line data={chartData} options={chartOptions} />
      </div>

    </div>
  );
}

const cardStyle = {
  background: "#111",
  padding: "20px",
  borderRadius: "10px",
  minWidth: "150px",
  textAlign: "center",
  boxShadow: "0 0 10px #00ff9040"
};

export default App;