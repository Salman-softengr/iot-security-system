# AI-Powered Real-Time IoT Security & Automated Threat Isolation

This project is an end-to-end IoT security system that uses machine learning to detect anomalies in network traffic and automatically isolates compromised devices using Ansible.

## Architecture

- **Edge Collector**: Captures network traffic (Scapy) and sends telemetry to Kafka.
- **Message Bus**: Apache Kafka for real-time data streaming.
- **Inference Engine**: TensorFlow Autoencoder & Isolation Forest for anomaly detection.
- **Orchestrator**: FastAPI backend for device management, alerts, and Ansible-based isolation.
- **Database**: TimescaleDB (PostgreSQL) for time-series flow events and audit logs.
- **Dashboard**: React-based cybersecurity dashboard for real-time monitoring.

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Python 3.11+ (for local development)

### Quick Start
1. Clone the repository.
2. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Start the stack:
   ```bash
   make up
   ```
4. Train the ML model (optional, starts with synthetic baseline):
   ```bash
   make train
   ```
5. Access the Dashboard: http://localhost:3000
6. API Documentation: http://localhost:8000/docs

### Credentials
- **Admin**: `admin` / `admin123`

## Development
- `make test`: Run all tests.
- `make logs`: View service logs.
- `make build`: Rebuild Docker images.

## License
MIT
