import logging

logger = logging.getLogger(__name__)

class SIEMDispatcher:
    def __init__(self):
        self.webhook_url = None # Could be from env

    def dispatch(self, alert):
        # In a real system, this sends to Splunk, ELK, or Email
        msg = f"[SIEM ALERT] {alert.severity}: {alert.message} (Device: {alert.device_id})"
        logger.info(msg)
        
        # Mock Email/Webhook call
        if self.webhook_url:
            pass
