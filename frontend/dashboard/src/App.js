import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function App() {
  const [metrics, setMetrics] = useState({
    requests_per_min: 0,
    avg_latency: 0,
    login_events: 0,
  });
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);


  async function fetchPrediction() {
  try {
    const res = await fetch("http://localhost:5000/predict/traffic", {
      method: "POST",
    });
    const data = await res.json();
    setPrediction(data);
  } catch (err) {
    console.error("Prediction fetch failed", err);
  }
}


  async function fetchMetrics() {
    try {
      const res = await fetch("http://localhost:4000/metrics/realtime");
      const data = await res.json();
      setMetrics(data);

      setHistory((prev) => [
      ...prev.slice(-20),
      {
        time: new Date().toLocaleTimeString(),
        requests: data.requests_per_min,
      },
    ]);
    } catch (err) {
      console.error("Failed to fetch metrics", err);
    }
  }

  useEffect(() => {
    fetchMetrics();
    fetchPrediction();
    const interval = setInterval(() => {
    fetchMetrics();
    fetchPrediction();
  }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <h1>📊 SaaS Analytics Dashboard</h1>

      <div style={styles.cards}>
        <Card title="Requests / Min" value={metrics.requests_per_min} />
        <Card title="Avg Latency (ms)" value={metrics.avg_latency} />
        <Card title="Login Events" value={metrics.login_events} />
        <Card
  title="🔮 Predicted Events (Next 5 min)"
  value={prediction ? prediction.predicted_events : "Loading..."}
/>

        <h2 style={{ marginTop: "60px" }}>📈 Traffic Over Time</h2>

        <LineChart
          width={700}
          height={300}
          data={history}
          style={{ margin: "0 auto" }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="requests"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p style={styles.value}>{value}</p>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial",
    padding: "40px",
    textAlign: "center",
  },
  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "40px",
  },
  card: {
    background: "#f4f4f4",
    padding: "20px",
    width: "200px",
    borderRadius: "10px",
  },
  value: {
    fontSize: "32px",
    fontWeight: "bold",
  },
};

export default App;
