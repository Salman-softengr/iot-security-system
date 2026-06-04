import pytest
import httpx
import time
import json
import os

ORCHESTRATOR_URL = "http://localhost:8000/api/v1"

@pytest.mark.asyncio
async def test_anomaly_to_quarantine_flow():
    # This test assumes the orchestrator is running (e.g. via docker-compose)
    # or mocked if running in isolation.
    
    anomaly_data = {
        "device_id": "dev_4d5e",
        "mac_address": "00:1A:2B:3C:4D:5E",
        "ip_address": "192.168.1.10",
        "score": 0.95,
        "is_anomaly": True,
        "mse": 0.8,
        "iforest": 0.9
    }
    
    async with httpx.AsyncClient() as client:
        # 1. Report Anomaly
        resp = await client.post(f"{ORCHESTRATOR_URL}/events/anomaly", json=anomaly_data)
        assert resp.status_code == 200
        
        # 2. Check Device Status (Give it a second to process)
        time.sleep(1)
        
        # Need token for this
        login_data = {"username": "admin", "password": "admin123"}
        token_resp = await client.post(f"http://localhost:8000/api/v1/auth/token", data=login_data)
        token = token_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        dev_resp = await client.get(f"{ORCHESTRATOR_URL}/devices/dev_4d5e", headers=headers)
        assert dev_resp.status_code == 200
        assert dev_resp.json()["vlan_tag"] == 999
        
        # 3. Verify Alert created
        alert_resp = await client.get(f"{ORCHESTRATOR_URL}/alerts/", headers=headers)
        alerts = alert_resp.json()
        assert any(a["device_id"] == "dev_4d5e" for a in alerts)
