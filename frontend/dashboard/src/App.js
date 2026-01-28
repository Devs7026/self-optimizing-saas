import { useEffect, useState } from "react";

function App() {
  const [metrics, setMetrics] = useState({
    requests_per_min: 0,
    avg_latency: 0,
    login_events: 0,
  });

  async function fetchMetrics() {
    try {
      const res = await fetch("http://localhost:4000/metrics/realtime");
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to fetch metrics", err);
    }
  }

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <h1>📊 SaaS Analytics Dashboard</h1>

      <div style={styles.cards}>
        <Card title="Requests / Min" value={metrics.requests_per_min} />
        <Card title="Avg Latency (ms)" value={metrics.avg_latency} />
        <Card title="Login Events" value={metrics.login_events} />
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
