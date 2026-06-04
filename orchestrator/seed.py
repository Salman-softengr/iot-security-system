import os
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Device, FlowEvent, Alert, AuditLog

def seed_data():
    db = SessionLocal()
    try:
        # 1. Clear existing data (optional, but good for a clean seed)
        db.query(FlowEvent).delete()
        db.query(Alert).delete()
        db.query(AuditLog).delete()
        db.query(Device).delete()
        
        # 2. Add Diverse IoT Devices
        devices = [
            Device(device_id="dev_4d5e", mac_address="00:1A:2B:3C:4D:5E", ip_address="192.168.1.10", hostname="LivingRoom-SmartPlug", vlan_tag=1, risk_score=0.12),
            Device(device_id="dev_4d5f", mac_address="00:1A:2B:3C:4D:5F", ip_address="192.168.1.11", hostname="FrontDoor-IPCamera", vlan_tag=1, risk_score=0.45),
            Device(device_id="dev_eeff", mac_address="AA:BB:CC:DD:EE:FF", ip_address="192.168.1.50", hostname="Industrial-Sensor-01", vlan_tag=1, risk_score=0.05),
            Device(device_id="dev_bc12", mac_address="12:34:56:78:90:AB", ip_address="192.168.1.102", hostname="Office-SmartLock", vlan_tag=1, risk_score=0.88),
            Device(device_id="dev_ef34", mac_address="FE:DC:BA:98:76:54", ip_address="192.168.1.105", hostname="HVAC-Controller", vlan_tag=999, risk_score=0.92),
            Device(device_id="dev_a1b2", mac_address="A1:B2:C3:D4:E5:F6", ip_address="192.168.1.110", hostname="Smart-Thermostat", vlan_tag=1, risk_score=0.15),
        ]
        db.add_all(devices)
        db.commit()

        # 3. Add Historical Flow Events (last 24 hours)
        now = datetime.utcnow()
        for device in devices:
            for i in range(24): # 24 hourly data points
                timestamp = now - timedelta(hours=i)
                # Normal behavior with some variance
                base_score = device.risk_score
                score = max(0, min(1, base_score + random.uniform(-0.1, 0.1)))
                
                event = FlowEvent(
                    time=timestamp,
                    device_id=device.device_id,
                    flow_duration_ms=random.randint(5000, 15000),
                    bytes_out=random.randint(1000, 100000),
                    packets_in=random.randint(50, 500),
                    anomaly_score=score,
                    is_anomaly=(score > 0.7)
                )
                db.add(event)
        
        # 4. Add some Alerts
        alerts = [
            Alert(device_id="dev_bc12", severity="HIGH", message="Unusual outbound traffic detected from Office-SmartLock", timestamp=now - timedelta(minutes=45)),
            Alert(device_id="dev_ef34", severity="CRITICAL", message="Unauthorized access attempt blocked for HVAC-Controller", timestamp=now - timedelta(hours=2)),
            Alert(device_id="dev_4d5f", severity="MEDIUM", message="Firmware update signature mismatch for FrontDoor-IPCamera", timestamp=now - timedelta(hours=5)),
        ]
        db.add_all(alerts)

        # 5. Add Audit Logs
        logs = [
            AuditLog(actor="SYSTEM", action="AUTO_QUARANTINE", target="dev_ef34", details="High risk score (0.92) triggered isolation", status="SUCCESS", timestamp=now - timedelta(hours=2)),
            AuditLog(actor="admin", action="MANUAL_SCAN", target="dev_4d5f", details="Scheduled security audit", status="SUCCESS", timestamp=now - timedelta(hours=6)),
        ]
        db.add_all(logs)

        db.commit()
        print("Database successfully seeded with dummy data.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
