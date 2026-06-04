import os
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Device, FlowEvent, Alert, AuditLog

def seed_data():
    db = SessionLocal()
    try:
        # 1. Clear existing data
        db.query(FlowEvent).delete()
        db.query(Alert).delete()
        db.query(AuditLog).delete()
        db.query(Device).delete()
        
        # 2. Add 20+ Diverse IoT Devices
        device_templates = [
            ("SmartPlug", "TP-Link", "192.168.1."),
            ("IPCamera", "Hikvision", "192.168.1."),
            ("Industrial-Sensor", "Siemens", "10.0.0."),
            ("SmartLock", "August", "192.168.1."),
            ("HVAC-Controller", "Honeywell", "10.0.0."),
            ("Smart-Thermostat", "Nest", "192.168.1."),
            ("Medical-Monitor", "GE-Health", "10.5.0."),
            ("Voice-Assistant", "Amazon", "192.168.1."),
            ("Smart-Bulb", "Philips", "192.168.1."),
            ("EV-Charger", "Tesla", "10.0.0."),
        ]

        devices = []
        for i in range(25):
            name, vendor, subnet = random.choice(device_templates)
            mac = f"{random.randint(0,255):02X}:{random.randint(0,255):02X}:{random.randint(0,255):02X}:{random.randint(0,255):02X}:{random.randint(0,255):02X}:{random.randint(0,255):02X}"
            ip = f"{subnet}{100 + i}"
            dev_id = f"dev_{mac.replace(':', '')[-6:].lower()}"
            
            # Mix of healthy and suspicious devices
            risk = random.uniform(0, 0.4)
            if i % 7 == 0: risk = random.uniform(0.6, 0.95)
            
            devices.append(Device(
                device_id=dev_id,
                mac_address=mac,
                ip_address=ip,
                hostname=f"{vendor}-{name}-{i+1}",
                vlan_tag=999 if risk > 0.9 else 1,
                risk_score=risk
            ))
        
        db.add_all(devices)
        db.commit()

        # 3. Add 500+ Historical Flow Events
        now = datetime.utcnow()
        for device in devices:
            # Generate a "baseline" for each device
            for i in range(48): # 48 data points (every 30 mins for 24h)
                timestamp = now - timedelta(minutes=30 * i)
                
                # Introduce occasional spikes
                is_spike = random.random() < 0.05
                multiplier = 10 if is_spike else 1
                
                score = device.risk_score
                if is_spike: score = min(1.0, score + 0.3)

                event = FlowEvent(
                    time=timestamp,
                    device_id=device.device_id,
                    flow_duration_ms=random.randint(2000, 5000) * multiplier,
                    bytes_out=random.randint(500, 5000) * multiplier,
                    packets_in=random.randint(10, 100) * multiplier,
                    anomaly_score=score,
                    is_anomaly=(score > 0.7)
                )
                db.add(event)
        
        # 4. Add dynamic Alerts
        alert_msgs = [
            "Port scanning behavior detected",
            "Brute force attempt on SSH service",
            "Unauthorized outbound connection to known malicious C2",
            "DNS tunneling signature identified",
            "Anomalous flow volume detected in quiet period",
            "Multiple failed authentication attempts from internal source"
        ]
        
        high_risk_devs = [d for d in devices if d.risk_score > 0.6]
        for dev in high_risk_devs:
            for _ in range(random.randint(1, 3)):
                db.add(Alert(
                    device_id=dev.device_id,
                    severity="CRITICAL" if dev.risk_score > 0.85 else "HIGH",
                    message=random.choice(alert_msgs),
                    timestamp=now - timedelta(minutes=random.randint(10, 600))
                ))

        db.commit()
        print(f"Database successfully seeded with 25 devices and {25*48} events.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
