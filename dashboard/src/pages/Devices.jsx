import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const Devices = () => {
  const [devices, setDevices] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await client.get('/devices/');
      setDevices(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleQuarantine = async (deviceId) => {
    try {
      await client.post(`/devices/${deviceId}/quarantine`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Device Inventory</h1>
          <p className="text-slate-400">Manage and Monitor Connected IoT Hardware</p>
        </div>
        <nav className="space-x-4">
          <Link to="/" className="px-4 py-2 hover:bg-slate-800 rounded">Overview</Link>
          <Link to="/devices" className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/30">Devices</Link>
          <Link to="/alerts" className="px-4 py-2 hover:bg-slate-800 rounded">Alerts</Link>
        </nav>
      </header>

      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase">
            <tr>
              <th className="p-4">Device ID</th>
              <th className="p-4">MAC Address</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">VLAN</th>
              <th className="p-4">Risk Score</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {devices.map(device => (
              <tr key={device.device_id} className="hover:bg-slate-800/30">
                <td className="p-4 font-mono text-cyan-500">{device.device_id}</td>
                <td className="p-4 font-mono">{device.mac_address}</td>
                <td className="p-4 font-mono">{device.ip_address}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${device.vlan_tag === 999 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                    VLAN {device.vlan_tag}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                      <div 
                        className={`h-full ${device.risk_score > 0.7 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                        style={{ width: `${device.risk_score * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{device.risk_score.toFixed(2)}</span>
                  </div>
                </td>
                <td className="p-4">
                  {device.vlan_tag !== 999 && (
                    <button 
                      onClick={() => handleQuarantine(device.device_id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-bold"
                    >
                      ISOLATE
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Devices;
