export const THREAT_EVENTS = [
  { id: 1, deviceId: 1,  deviceName: "Security Cam 01", type: "Port Scan",         score: 0.87, severity: "critical", detectedAt: "2024-03-15 14:32:11", status: "quarantined", action: "Auto-isolated to VLAN 999" },
  { id: 2, deviceId: 8,  deviceName: "Smart TV — Conf A",type: "C2 Communication", score: 0.91, severity: "critical", detectedAt: "2024-03-15 13:55:42", status: "quarantined", action: "Auto-isolated to VLAN 999" },
  { id: 3, deviceId: 14, deviceName: "NAS Storage 01",   type: "Data Exfiltration",score: 0.83, severity: "critical", detectedAt: "2024-03-15 14:01:07", status: "active",      action: "Alert sent — pending review" },
  { id: 4, deviceId: 5,  deviceName: "Dev Laptop — Salman",type:"Lateral Movement",score: 0.55, severity: "high",     detectedAt: "2024-03-15 12:44:30", status: "monitoring",  action: "Monitoring — threshold watch" },
  { id: 5, deviceId: 12, deviceName: "Smart Lock — Main",type: "ARP Spoofing",     score: 0.61, severity: "high",     detectedAt: "2024-03-15 11:20:15", status: "monitoring",  action: "Monitoring — threshold watch" },
  { id: 6, deviceId: 23, deviceName: "POS Terminal 01",  type: "Anomalous Traffic",score: 0.58, severity: "high",     detectedAt: "2024-03-15 10:05:55", status: "monitoring",  action: "Monitoring — threshold watch" },
];

export const ANOMALY_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  time: `${23-i}:00`,
  score: (0.1 + Math.random() * 0.4).toFixed(2),
  threats: i % 8 === 0 ? 1 : 0
}));

export const TRAFFIC_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  bytesOut: Math.floor(Math.random() * 5000) + 1000,
  packetsIn: Math.floor(Math.random() * 200) + 50,
  tcp: Math.floor(Math.random() * 1000),
  udp: Math.floor(Math.random() * 500),
  arp: Math.floor(Math.random() * 100),
  icmp: Math.floor(Math.random() * 50),
}));

export const MITRE_TECHNIQUES = [
  { id: "T1046", name: "Network Service Scanning", coverage: "high", status: "protected" },
  { id: "T1571", name: "Non-Standard Port", coverage: "high", status: "protected" },
  { id: "T1071", name: "Application Layer Protocol", coverage: "medium", status: "monitoring" },
  { id: "T1020", name: "Automated Exfiltration", coverage: "high", status: "protected" },
  { id: "T1018", name: "Remote System Discovery", coverage: "medium", status: "monitoring" },
  { id: "T1133", name: "External Remote Services", coverage: "high", status: "protected" },
];
