import os
import time
import yaml
import logging
import random
import threading
from datetime import datetime
from collections import deque, defaultdict
from typing import Dict, Any

# Scapy might fail on some systems or without root
try:
    from scapy.all import sniff, IP, TCP, UDP, Ether
    SCAPY_AVAILABLE = True
except ImportError:
    SCAPY_AVAILABLE = False

from schemas import NetworkFrame
from kafka_producer import TelemetryProducer
from dotenv import load_dotenv

load_dotenv()

# Configure Logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("EdgeCollector")

class EdgeCollector:
    def __init__(self, config_path: str = "config.yaml"):
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        self.interface = os.getenv("MONITOR_INTERFACE", self.config.get("interface", "eth0"))
        self.kafka_broker = os.getenv("KAFKA_BOOTSTRAP_SERVERS", self.config.get("kafka_broker", "localhost:9092"))
        self.kafka_topic = os.getenv("KAFKA_TOPIC", self.config.get("kafka_topic", "network-telemetry"))
        self.simulation_mode = os.getenv("SIMULATION_MODE", "true").lower() == "true"
        
        self.producer = TelemetryProducer(self.kafka_broker, self.kafka_topic)
        self.flow_buffer = defaultdict(lambda: {
            "bytes_out": 0, 
            "packets_in": 0, 
            "start_time": time.time(),
            "ip": None,
            "mac": None
        })
        self.lock = threading.Lock()

    def process_packet(self, packet):
        if not Ether in packet:
            return

        mac = packet[Ether].src
        ip = packet[IP].src if IP in packet else "0.0.0.0"
        
        with self.lock:
            flow = self.flow_buffer[mac]
            flow["mac"] = mac
            flow["ip"] = ip
            flow["packets_in"] += 1
            if IP in packet:
                flow["bytes_out"] += len(packet[IP])
            
            # If window expired (e.g. 10s), emit and reset
            now = time.time()
            if now - flow["start_time"] >= self.config.get("window_size_sec", 10):
                self.emit_flow(mac, flow)
                del self.flow_buffer[mac]

    def emit_flow(self, mac: str, flow: Dict[str, Any]):
        try:
            frame = NetworkFrame(
                timestamp=datetime.utcnow(),
                device_id=f"dev_{mac.replace(':', '')[-6:]}",
                mac_address=mac,
                ip_address=flow["ip"],
                flow_duration_ms=(time.time() - flow["start_time"]) * 1000,
                bytes_out=flow["bytes_out"],
                packets_in=flow["packets_in"],
                protocol="TCP" if "TCP" in flow else "UDP", # Simplified
                src_port=None,
                dst_port=None
            )
            self.producer.send_frame(frame.model_dump())
        except Exception as e:
            logger.error(f"Error emitting flow: {e}")

    def run_simulation(self):
        logger.info("Starting Edge Collector in SIMULATION mode...")
        mock_devices = [
            {"mac": "00:1A:2B:3C:4D:5E", "ip": "192.168.1.10"},
            {"mac": "00:1A:2B:3C:4D:5F", "ip": "192.168.1.11"},
            {"mac": "AA:BB:CC:DD:EE:FF", "ip": "192.168.1.50"}
        ]
        
        while True:
            device = random.choice(mock_devices)
            # Normal traffic
            packets = random.randint(10, 100)
            bytes_sent = packets * random.randint(64, 1500)
            
            # Occasional anomaly simulation
            if random.random() < 0.05:
                packets *= 10
                bytes_sent *= 15
                logger.warning(f"Simulating anomaly for {device['mac']}")

            frame = NetworkFrame(
                timestamp=datetime.utcnow(),
                device_id=f"dev_{device['mac'].replace(':', '')[-6:]}",
                mac_address=device['mac'],
                ip_address=device['ip'],
                flow_duration_ms=10000,
                bytes_out=bytes_sent,
                packets_in=packets,
                protocol="TCP",
                src_port=random.randint(1024, 65535),
                dst_port=80
            )
            self.producer.send_frame(frame.model_dump())
            time.sleep(2)

    def start(self):
        if self.simulation_mode or not SCAPY_AVAILABLE:
            if not SCAPY_AVAILABLE:
                logger.warning("Scapy not available. Falling back to simulation mode.")
            self.run_simulation()
        else:
            logger.info(f"Starting Edge Collector on interface {self.interface}...")
            try:
                sniff(iface=self.interface, prn=self.process_packet, store=0)
            except Exception as e:
                logger.error(f"Failed to start sniffing: {e}. Falling back to simulation.")
                self.run_simulation()

if __name__ == "__main__":
    collector = EdgeCollector()
    collector.start()
