const express = require("express");
const { Client } = require("pg");

const app = express();
app.use(express.json());

const db = new Client({
  user: "admin",
  password: "admin",
  host: "127.0.0.1",
  port: 5433,
  database: "saas",
  ssl: false
});

db.connect().then(() => {
  console.log("Analytics service connected to Postgres");
});


app.get("/metrics/realtime", async (req, res) => {
  try {

    const query = `
      SELECT 
        COUNT(*) AS total_events,
        AVG(latency) AS avg_latency,
        COUNT(*) FILTER (WHERE event_type = 'login') AS login_events
      FROM events
      WHERE timestamp >= NOW() - INTERVAL '1 minute'
    `;

    const result = await db.query(query);
    const row = result.rows[0];

    res.json({
      requests_per_min: parseInt(row.total_events),
      avg_latency: Math.round(row.avg_latency || 0),
      login_events: parseInt(row.login_events)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

app.listen(4000, () => {
  console.log("Analytics service running on port 4000");
});
