import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await client.get('/alerts/');
        setAlerts(data);
      } catch (err) { console.error(err); }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Security Alerts</h1>
          <p className="text-slate-400">Detailed forensic log of system threats</p>
        </div>
        <nav className="space-x-4">
          <Link to="/" className="px-4 py-2 hover:bg-slate-800 rounded">Overview</Link>
          <Link to="/devices" className="px-4 py-2 hover:bg-slate-800 rounded">Devices</Link>
          <Link to="/alerts" className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/30">Alerts</Link>
        </nav>
      </header>

      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="bg-slate-900 p-6 rounded-lg border border-slate-800 border-l-4 border-red-500 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-red-500 font-bold uppercase text-xs tracking-widest">{alert.severity} THREAT</span>
                <span className="text-slate-500 text-xs">{new Date(alert.timestamp).toLocaleString()}</span>
              </div>
              <h3 className="text-lg font-medium">{alert.message}</h3>
              <p className="text-slate-400 text-sm">Affected Device: <span className="text-cyan-500 font-mono">{alert.device_id}</span></p>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 bg-slate-800 rounded text-slate-400 text-sm font-bold">
                FORENSICS READY
              </span>
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="bg-slate-900 p-12 rounded-lg border border-slate-800 text-center">
            <p className="text-slate-500">No active threats detected in current window.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
