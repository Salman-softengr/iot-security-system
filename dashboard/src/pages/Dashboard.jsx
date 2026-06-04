import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devRes, alertRes] = await Promise.all([
          client.get('/devices/'),
          client.get('/alerts/')
        ]);
        setDevices(devRes.data);
        setAlerts(alertRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Security Dashboard</h1>
          <p className="text-slate-400">Real-time IoT Network Monitoring</p>
        </div>
        <nav className="space-x-4">
          <Link to="/" className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/30">Overview</Link>
          <Link to="/devices" className="px-4 py-2 hover:bg-slate-800 rounded">Devices</Link>
          <Link to="/alerts" className="px-4 py-2 hover:bg-slate-800 rounded">Alerts</Link>
        </nav>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h3 className="text-slate-400 text-sm uppercase mb-2">Active Devices</h3>
          <p className="text-4xl font-bold text-cyan-500">{devices.length}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h3 className="text-slate-400 text-sm uppercase mb-2">Threats Detected</h3>
          <p className="text-4xl font-bold text-red-500">{alerts.filter(a => a.severity === 'HIGH').length}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h3 className="text-slate-400 text-sm uppercase mb-2">Quarantined</h3>
          <p className="text-4xl font-bold text-yellow-500">{devices.filter(d => d.vlan_tag === 999).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 h-96">
          <h3 className="text-lg font-semibold mb-4">Anomaly Score Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={devices.map(d => ({ name: d.device_id, score: d.risk_score }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
              <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 overflow-hidden">
          <h3 className="text-lg font-semibold mb-4">Live Alert Feed</h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="flex items-center p-3 bg-slate-800/50 rounded border-l-4 border-red-500">
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${alert.severity === 'HIGH' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
