import os
import json
import logging
import requests
from kafka import KafkaConsumer
from model.scorer import Scorer
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("InferenceWorker")

class InferenceWorker:
    def __init__(self):
        self.scorer = Scorer()
        
        kafka_kwargs = {
            "bootstrap_servers": os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092"),
            "group_id": 'ml-workers',
            "value_deserializer": lambda x: json.loads(x.decode('utf-8')),
            "auto_offset_reset": 'latest'
        }

        user = os.getenv("KAFKA_USER")
        if user:
            kafka_kwargs.update({
                "sasl_plain_username": user,
                "sasl_plain_password": os.getenv("KAFKA_PASS"),
                "sasl_mechanism": os.getenv("KAFKA_SASL_MECHANISM", "SCRAM-SHA-256"),
                "security_protocol": os.getenv("KAFKA_SECURITY_PROTOCOL", "SASL_SSL")
            })

        try:
            self.consumer = KafkaConsumer(os.getenv("KAFKA_TOPIC", "network-telemetry"), **kafka_kwargs)
            logger.info("Connected to Hybrid Kafka")
        except Exception as e:
            logger.error(f"Kafka Error: {e}")
            self.consumer = None

    def run(self):
        if not self.consumer: return
        for message in self.consumer:
            data = message.value
            result = self.scorer.score([data.get("flow_duration_ms", 0), data.get("bytes_out", 0), data.get("packets_in", 0)])
            if result["is_anomaly"]:
                requests.post(f"{os.getenv('ORCHESTRATOR_URL')}/events/anomaly", json={**result, "device_id": data.get("device_id")})

if __name__ == "__main__":
    InferenceWorker().run()
