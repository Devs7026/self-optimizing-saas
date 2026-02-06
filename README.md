# AI-Powered Self-Optimizing SaaS Analytics Platform

A production-style, event-driven SaaS analytics platform that ingests real-time user activity, generates live operational metrics, predicts traffic spikes using machine learning, and proactively scales microservices using AI-based scaling decisions.

This project demonstrates distributed systems, real-time streaming pipelines, production ML inference, and cloud-native scalability.

---

## System Architecture

<img width="1440" height="1024" alt="saas analyser" src="https://github.com/user-attachments/assets/acf1cdf0-903a-418a-bf76-c1d47be9272e" />


---

## Key Features

- **Event-driven microservices architecture** with clear separation between ingestion, streaming, processing, and analytics.
- **Real-time event ingestion** using **Apache Kafka** (`user-events` topic) for high-throughput streaming.
- **Persistent analytics storage** using **PostgreSQL**, enabling both real-time and historical queries.
- **Machine learning traffic forecasting** using **LSTM models** (TensorFlow/Keras) served through an inference API.
- **AI-driven auto-scaling controller** that scales Kubernetes workloads proactively based on predicted load and system health.
- **Live monitoring dashboard** built with **React**, visualizing metrics, predictions, and scaling decisions.
- **Observability-first setup** using **Prometheus + Grafana** for metrics monitoring.

---

## Tech Stack

### Backend / Streaming
- Node.js + Express (API Gateway, Event Producer)
- Apache Kafka (Streaming Layer)
- PostgreSQL (Event + Metrics Storage)

### Processing / Intelligence
- Analytics Service (real-time aggregation)
- ML Inference Service (FastAPI)
- AI Auto-Scaling Controller

### Frontend
- React + TypeScript (Monitoring Dashboard)

### Infrastructure / DevOps
- Docker + Docker Compose (local infra)
- Kubernetes (deployment + scaling)
- Prometheus + Grafana (monitoring)

---

## Repository Structure

```txt
self-optimizing-saas/
├── frontend/                 # React dashboard
├── services/                 # Microservices (producer, consumer, analytics, ML, autoscaler)
├── infra/                    # Docker + Kubernetes configs
├── docs/                     # Architecture diagram + documentation
├── monitoring/               # Prometheus + Grafana setup
├── scripts/                  # Local setup + testing scripts
└── docker-compose.yml        # Kafka + Postgres local environment
