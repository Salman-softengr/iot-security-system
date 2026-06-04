# Final Deployment Instructions - Hybrid Cloud Strategy

This setup uses specialized free-tier services for maximum reliability and 8+ months of uptime.

### 1. Database (PostgreSQL) -> Neon.tech
- Sign up at [neon.tech](https://neon.tech).
- Create a project and copy the **Connection String**.
- Update `DATABASE_URL` in your environment.

### 2. Message Bus (Kafka) -> Upstash
- Sign up at [upstash.com](https://upstash.com).
- Create a Kafka Cluster and a Topic named `network-telemetry`.
- Copy the **Bootstrap Server**, **Username**, and **Password**.

### 3. API (Orchestrator) -> Koyeb
- Sign up at [koyeb.com](https://koyeb.com).
- Deploy using the "GitHub" option. Point it to the `orchestrator/` folder.
- Add your environment variables (DATABASE_URL, REDIS_URL, etc.).

### 4. Dashboard (React) -> Vercel / Netlify
- Point to the `dashboard/` folder.
- Set `VITE_API_URL` to your Koyeb API URL.

### 5. ML Inference -> Hugging Face Spaces
- Create a "Docker" space on [huggingface.co](https://huggingface.co).
- Upload the `inference/` folder.
- It provides a free T4 GPU/CPU environment that never sleeps.

### 6. Edge Collector -> Local Laptop / Raspberry Pi
- Since this needs to "sniff" traffic, it usually stays local.
- Run it using `python edge/edge_collector.py` pointing to your Upstash Kafka.
