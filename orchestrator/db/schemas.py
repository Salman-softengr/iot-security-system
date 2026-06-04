from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class DeviceSchema(BaseModel):
    device_id: str
    mac_address: str
    ip_address: Optional[str]
    hostname: Optional[str]
    vlan_tag: int
    is_active: bool
    last_seen: datetime
    risk_score: float

    class Config:
        from_attributes = True

class AnomalyEvent(BaseModel):
    device_id: str
    mac_address: str
    ip_address: Optional[str]
    score: float
    is_anomaly: bool
    mse: float
    iforest: float
    timestamp: Optional[datetime] = None

class AlertSchema(BaseModel):
    id: int
    timestamp: datetime
    device_id: str
    severity: str
    message: str
    resolved: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
