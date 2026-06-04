import json
import logging
from kafka import KafkaProducer
from typing import Dict, Any

logger = logging.getLogger(__name__)

class TelemetryProducer:
    def __init__(self, bootstrap_servers: str, topic: str):
        self.topic = topic
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=bootstrap_servers,
                value_serializer=lambda v: json.dumps(v, default=str).encode('utf-8'),
                retries=5,
                retry_backoff_ms=1000
            )
            logger.info(f"Connected to Kafka at {bootstrap_servers}")
        except Exception as e:
            logger.error(f"Failed to connect to Kafka: {e}")
            self.producer = None

    def send_frame(self, frame: Dict[str, Any]):
        if self.producer:
            try:
                self.producer.send(self.topic, frame)
                # logger.debug(f"Sent frame for device {frame.get('device_id')}")
            except Exception as e:
                logger.error(f"Error sending frame to Kafka: {e}")
        else:
            logger.warning("Producer not initialized, skipping send.")

    def flush(self):
        if self.producer:
            self.producer.flush()
