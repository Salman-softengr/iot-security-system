-- Enable TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Device Registry
CREATE TABLE IF NOT EXISTS device_registry (
    device_id VARCHAR(50) PRIMARY KEY,
    mac_address VARCHAR(17) UNIQUE NOT NULL,
    ip_address VARCHAR(15),
    hostname VARCHAR(100),
    vlan_tag INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    risk_score FLOAT DEFAULT 0.0
);

-- Flow Events (Hypertable)
CREATE TABLE IF NOT EXISTS flow_events (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    device_id VARCHAR(50) NOT NULL,
    flow_duration_ms FLOAT,
    bytes_out BIGINT,
    packets_in INTEGER,
    anomaly_score FLOAT,
    is_anomaly BOOLEAN
);

SELECT create_hypertable('flow_events', 'time', if_not_exists => TRUE);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actor VARCHAR(50),
    action VARCHAR(100),
    target VARCHAR(100),
    details TEXT,
    status VARCHAR(20)
);

-- Model Metadata
CREATE TABLE IF NOT EXISTS model_metadata (
    version VARCHAR(20) PRIMARY KEY,
    trained_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accuracy FLOAT,
    parameters JSONB
);

-- Alert Queue
CREATE TABLE IF NOT EXISTS alert_queue (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    device_id VARCHAR(50),
    severity VARCHAR(20),
    message TEXT,
    resolved BOOLEAN DEFAULT FALSE
);

-- Seed Initial Data
INSERT INTO device_registry (device_id, mac_address, ip_address, hostname, vlan_tag)
VALUES 
('dev_4d5e', '00:1A:2B:3C:4D:5E', '192.168.1.10', 'SmartPlug-01', 1),
('dev_4d5f', '00:1A:2B:3C:4D:5F', '192.168.1.11', 'IPCamera-02', 1),
('dev_eeff', 'AA:BB:CC:DD:EE:FF', '192.168.1.50', 'Unknown-Device', 1)
ON CONFLICT DO NOTHING;
