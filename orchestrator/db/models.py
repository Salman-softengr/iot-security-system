from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, BigInteger, JSON, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Device(Base):
    __tablename__ = "device_registry"
    device_id = Column(String, primary_key=True)
    mac_address = Column(String, unique=True, nullable=False)
    ip_address = Column(String)
    hostname = Column(String)
    vlan_tag = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    last_seen = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
    risk_score = Column(Float, default=0.0)

class FlowEvent(Base):
    __tablename__ = "flow_events"
    time = Column(DateTime(timezone=True), primary_key=True)
    device_id = Column(String, ForeignKey("device_registry.device_id"))
    flow_duration_ms = Column(Float)
    bytes_out = Column(BigInteger)
    packets_in = Column(Integer)
    anomaly_score = Column(Float)
    is_anomaly = Column(Boolean)

class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime(timezone=True), default=func.now())
    actor = Column(String)
    action = Column(String)
    target = Column(String)
    details = Column(Text)
    status = Column(String)

class Alert(Base):
    __tablename__ = "alert_queue"
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime(timezone=True), default=func.now())
    device_id = Column(String)
    severity = Column(String)
    message = Column(Text)
    resolved = Column(Boolean, default=False)
