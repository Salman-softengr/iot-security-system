import os
import json
import logging
import requests
from kafka import KafkaConsumer
from model.scorer import Scorer
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("InferenceWorker")

ORCHESTRATOR_URL = os.getenv("ORCHESTRATOR_URL", "http://orchestrator:8000/api/v1")

class InferenceWorker:
    def __init__(self):
        self.bootstrap_servers = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
        self.topic = os.getenv("KAFKA_TOPIC", "network-telemetry")
        self.scorer = Scorer()
        
        try:
            self.consumer = KafkaConsumer(
                self.topic,
                bootstrap_servers=self.bootstrap_servers,
                group_id='ml-workers',
                value_deserializer=lambda x: json.loads(x.decode('utf-8')),
                auto_offset_reset='latest'
            )
            logger.info(f"Connected to Kafka at {self.bootstrap_servers}")
        except Exception as e:
            logger.error(f"Failed to connect to Kafka: {e}")
            self.consumer = None

    def run(self):
        if not self.consumer:
            logger.error("Consumer not initialized. Exiting.")
            return

        logger.info(f"Inference Worker listening on {self.topic}...")
        for message in self.consumer:
            try:
                data = message.value
                features = [
                    data.get("flow_duration_ms", 0),
                    data.get("bytes_out", 0),
                    data.get("packets_in", 0)
                ]
                
                result = self.scorer.score(features)
                
                # Enrich with metadata
                result.update({
                    "device_id": data.get("device_id"),
                    "mac_address": data.get("mac_address"),
                    "ip_address": data.get("ip_address"),
                    "timestamp": data.get("timestamp")
                })
                
                if result["is_anomaly"]:
                    logger.warning(f"ANOMALY DETECTED for {result['device_id']}: Score {result['score']:.4f}")
                    self.report_anomaly(result)
                else:
                    logger.debug(f"Normal traffic for {result['device_id']}: Score {result['score']:.4f}")
                
            except Exception as e:
                logger.error(f"Error processing message: {e}")

    def report_anomaly(self, anomaly_data):
        try:
            resp = requests.post(
                f"{ORCHESTRATOR_URL}/events/anomaly",
                json=anomaly_data,
                timeout=2
            )
            if resp.status_code != 200:
                logger.error(f"Failed to report anomaly: {resp.text}")
        except Exception as e:
            logger.error(f"Error calling orchestrator: {e}")

if __name__ == "__main__":
    worker = InferenceWorker()
    worker.run()
