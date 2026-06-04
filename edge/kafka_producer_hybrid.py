import os
import json
import logging
from kafka import KafkaProducer
from typing import Dict, Any

logger = logging.getLogger(__name__)

class TelemetryProducer:
    def __init__(self):
        self.topic = os.getenv("KAFKA_TOPIC", "network-telemetry")
        bootstrap_servers = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
        
        # Hybrid Cloud (Upstash) specific config
        sasl_mechanism = os.getenv("KAFKA_SASL_MECHANISM")
        security_protocol = os.getenv("KAFKA_SECURITY_PROTOCOL")
        user = os.getenv("KAFKA_USER")
        password = os.getenv("KAFKA_PASS")

        kafka_kwargs = {
            "bootstrap_servers": bootstrap_servers,
            "value_serializer": lambda v: json.dumps(v, default=str).encode('utf-8'),
            "retries": 5,
            "retry_backoff_ms": 1000
        }

        if user and password:
            kafka_kwargs.update({
                "sasl_plain_username": user,
                "sasl_plain_password": password,
                "sasl_mechanism": sasl_mechanism or "SCRAM-SHA-256",
                "security_protocol": security_protocol or "SASL_SSL"
            })

        try:
            self.producer = KafkaProducer(**kafka_kwargs)
            logger.info(f"Connected to Kafka at {bootstrap_servers}")
        except Exception as e:
            logger.error(f"Failed to connect to Kafka: {e}")
            self.producer = None

    def send_frame(self, frame: Dict[str, Any]):
        if self.producer:
            try:
                self.producer.send(self.topic, frame)
            except Exception as e:
                logger.error(f"Error sending frame to Kafka: {e}")

    def flush(self):
        if self.producer:
            self.producer.flush()
