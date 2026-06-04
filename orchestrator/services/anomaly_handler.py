import os
import json
import logging
import ansible_runner
from sqlalchemy.orm import Session
from db.models import Device, AuditLog, Alert
from .siem import SIEMDispatcher

logger = logging.getLogger(__name__)

class AnomalyHandler:
    def __init__(self, db: Session):
        self.db = db
        self.siem = SIEMDispatcher()
        self.simulation = os.getenv("ANSIBLE_SIMULATION", "true").lower() == "true"
        self.switch_state_file = os.getenv("SWITCH_STATE_FILE", "/tmp/switch_state.json")

    async def handle_anomaly(self, event_data: dict):
        device_id = event_data["device_id"]
        score = event_data["score"]
        
        # 1. Update Device Risk Score
        device = self.db.query(Device).filter(Device.device_id == device_id).first()
        if device:
            device.risk_score = score
            self.db.commit()

        # 2. Trigger Isolation if score > 0.70
        if score >= 0.70:
            await self.quarantine_device(device)

        # 3. Create Alert
        new_alert = Alert(
            device_id=device_id,
            severity="HIGH" if score > 0.85 else "MEDIUM",
            message=f"Anomaly detected for {device_id} with score {score:.2f}",
        )
        self.db.add(new_alert)
        self.db.commit()

        # 4. Dispatch SIEM
        self.siem.dispatch(new_alert)

    async def quarantine_device(self, device: Device):
        if not device: return
        
        logger.info(f"QUARANTINING DEVICE: {device.device_id} (MAC: {device.mac_address})")
        
        if self.simulation:
            # Simulate Ansible by writing to a local JSON
            self.simulate_ansible(device.mac_address, 999)
        else:
            # Run real Ansible playbook
            ansible_runner.run(
                playbook='ansible/quarantine.yml',
                inventory='ansible/inventory.ini',
                extravars={'target_mac': device.mac_address}
            )

        # Update DB
        device.vlan_tag = 999
        self.db.add(AuditLog(
            actor="SYSTEM",
            action="QUARANTINE",
            target=device.device_id,
            details=f"Moved to VLAN 999 due to high risk score",
            status="SUCCESS"
        ))
        self.db.commit()

    def simulate_ansible(self, mac: str, vlan: int):
        state = {}
        if os.path.exists(self.switch_state_file):
            with open(self.switch_state_file, 'r') as f:
                state = json.load(f)
        
        state[mac] = vlan
        with open(self.switch_state_file, 'w') as f:
            json.dump(state, f)
        logger.info(f"[SIMULATION] Updated switch_state.json: {mac} -> VLAN {vlan}")
