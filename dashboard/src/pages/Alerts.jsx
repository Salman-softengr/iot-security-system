import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { 
  ShieldCheckIcon, SignalIcon, CpuChipIcon, BellIcon,
  ShieldExclamationIcon, ExclamationTriangleIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';

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

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'border-red-500 bg-red-500/10 text-red-500';
      case 'HIGH': return 'border-orange-500 bg-orange-500/10 text-orange-500';
      case 'MEDIUM': return 'border-yellow-500 bg-yellow-500/10 text-yellow-500';
      default: return 'border-blue-500 bg-blue-500/10 text-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-20 bg-slate-900/50 border-r border-slate-800 flex flex-col items-center py-8 space-y-8 z-50">
        <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/40">
          <ShieldCheckIcon className="w-8 h-8 text-cyan-400" />
        </div>
        <nav className="flex flex-col space-y-6">
          <Link to="/" className="p-3 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-all rounded-xl"><SignalIcon className="w-6 h-6" /></Link>
          <Link to="/devices" className="p-3 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-all rounded-xl"><CpuChipIcon className="w-6 h-6" /></Link>
          <Link to="/alerts" className="p-3 text-cyan-400 bg-cyan-500/10 rounded-xl border border-cyan-500/20"><BellIcon className="w-6 h-6" /></Link>
        </nav>
      </div>

      <main className="ml-20 p-8 max-w-7xl mx-auto">
        <header className="mb-12">
          <h2 className="text-sm font-bold tracking-widest text-cyan-500 uppercase mb-2">Forensic Logs</h2>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Security <span className="text-red-500">Threat Feed</span></h1>
        </header>

        <div className="space-y-6">
          {alerts.map(alert => (
            <div key={alert.id} className={`group bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border-l-4 ${getSeverityStyles(alert.severity)} transition-all hover:translate-x-2`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${getSeverityStyles(alert.severity).split(' ')[1]}`}>
                    {alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? <ExclamationTriangleIcon className="w-6 h-6" /> : <InformationCircleIcon className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{alert.message}</h3>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Incident Ref: #{alert.id.toString().padStart(6, '0')}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">{new Date(alert.timestamp).toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-slate-800/50">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-tighter">Impact Level</p>
                  <span className="text-xs font-black uppercase">{alert.severity}</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-tighter">Target Device</p>
                  <span className="text-xs font-mono text-cyan-500">{alert.device_id}</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-tighter">Status</p>
                  <span className="text-xs font-bold text-green-500">LOGGED</span>
                </div>
                <div className="text-right flex items-end justify-end">
                  <button className="text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-white transition-colors">Analyze Trace →</button>
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="bg-slate-900/40 backdrop-blur-xl p-20 rounded-3xl border border-slate-800 text-center">
              <ShieldCheckIcon className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-20" />
              <p className="text-slate-500 italic">No threat vectors identified in current operational window.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Alerts;
