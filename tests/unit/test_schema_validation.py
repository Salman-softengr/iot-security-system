from edge.schemas import NetworkFrame
from datetime import datetime
import pytest
from pydantic import ValidationError

def test_valid_network_frame():
    data = {
        "timestamp": datetime.now(),
        "device_id": "dev_123",
        "mac_address": "00:11:22:33:44:55",
        "ip_address": "192.168.1.1",
        "flow_duration_ms": 1000.0,
        "bytes_out": 500,
        "packets_in": 10,
        "protocol": "TCP"
    }
    frame = NetworkFrame(**data)
    assert frame.device_id == "dev_123"

def test_invalid_network_frame():
    data = {
        "timestamp": "not-a-date",
        "device_id": "dev_123"
    }
    with pytest.raises(ValidationError):
        NetworkFrame(**data)
