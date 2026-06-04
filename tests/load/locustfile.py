import random
from locust import HttpUser, task, between

class SecuritySystemUser(HttpUser):
    wait_time = between(0.1, 1)

    @task(3)
    def post_anomaly(self):
        self.client.post("/api/v1/events/anomaly", json={
            "device_id": f"dev_{random.randint(100, 999)}",
            "mac_address": f"00:1A:2B:3C:4D:{random.randint(10, 99)}",
            "ip_address": "192.168.1.100",
            "score": random.uniform(0.1, 0.99),
            "is_anomaly": True,
            "mse": 0.5,
            "iforest": 0.5
        })

    @task(1)
    def get_alerts(self):
        self.client.get("/api/v1/alerts/")

    @task(2)
    def get_devices(self):
        # Requires auth in production, but we test the endpoint load
        self.client.get("/api/v1/devices/")
