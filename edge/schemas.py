from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NetworkFrame(BaseModel):
    timestamp: datetime
    device_id: str
    mac_address: str
    ip_address: Optional[str]
    flow_duration_ms: float
    bytes_out: int
    packets_in: int
    protocol: str
    src_port: Optional[int]
    dst_port: Optional[int]
