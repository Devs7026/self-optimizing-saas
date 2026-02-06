from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import psycopg2
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


conn = psycopg2.connect(
    host="localhost",
    port=5433,
    user="admin",
    password="admin",
    dbname="saas"
)

@app.post("/predict/traffic")
def predict_traffic():
    cur = conn.cursor()

    cur.execute("""
        SELECT date_trunc('minute', timestamp) AS minute, COUNT(*) AS events
        FROM events
        WHERE timestamp >= NOW() - INTERVAL '10 minutes'
        GROUP BY minute
        ORDER BY minute;
    """)

    rows = cur.fetchall()

    if len(rows) < 3:
        cur.execute("""
            SELECT COUNT(*)
            FROM events
            WHERE timestamp >= NOW() - INTERVAL '5 minutes'
        """)
        count_5min = cur.fetchone()[0]

        return {
            "window": "next_5_minutes",
            "current_events": count_5min,
            "predicted_events": count_5min,
            "model": "fallback_recent_count_v1"
        }

    counts = np.array([r[1] for r in rows], dtype=float)

    avg_per_min = counts.mean()

    predicted_next_5 = int(round(avg_per_min * 5))

    cur.execute("""
        SELECT COUNT(*)
        FROM events
        WHERE timestamp >= NOW() - INTERVAL '5 minutes'
    """)
    current_5 = cur.fetchone()[0]

    return {
        "window": "next_5_minutes",
        "current_events": current_5,
        "predicted_events": predicted_next_5,
        "avg_events_per_min": round(float(avg_per_min), 2),
        "model": "rolling_average_v1"
    }
