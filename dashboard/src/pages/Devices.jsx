import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { 
  CpuChipIcon, ShieldCheckIcon, SignalIcon, BellIcon,
  MagnifyingGlassIcon, AdjustmentsHorizontalIcon,
  NoSymbolIcon, ArrowPathIcon
} from '@heroicons/react/24/outline';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredDevices = devices.filter(d => 
    (d.hostname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.mac_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-20 bg-slate-900/50 border-r border-slate-800 flex flex-col items-center py-8 space-y-8 z-50">
        <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/40">
          <ShieldCheckIcon className="w-8 h-8 text-cyan-400" />
        </div>
        <nav className="flex flex-col space-y-6">
          <Link to="/" className="p-3 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-all rounded-xl"><SignalIcon className="w-6 h-6" /></Link>
          <Link to="/devices" className="p-3 text-cyan-400 bg-cyan-500/10 rounded-xl border border-cyan-500/20"><CpuChipIcon className="w-6 h-6" /></Link>
          <Link to="/alerts" className="p-3 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-all rounded-xl"><BellIcon className="w-6 h-6" /></Link>
        </nav>
      </div>

      <main className="ml-20 p-8 max-w-7xl mx-auto">
        <header className="mb-12">
          <h2 className="text-sm font-bold tracking-widest text-cyan-500 uppercase mb-2">Asset Management</h2>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Connected <span className="text-cyan-400">IoT Inventory</span></h1>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by ID, MAC, or Hostname..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all text-sm font-semibold">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-cyan-500" />
            Filters
          </button>
        </div>

        {/* Device Cards/Table */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="p-6">Device Status</th>
                <th className="p-6">Identity</th>
                <th className="p-6">Network Info</th>
                <th className="p-6">Risk Profile</th>
                <th className="p-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDevices.map(device => (
                <tr key={device.device_id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${device.vlan_tag === 999 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`}></div>
                      <span className="text-xs font-bold uppercase tracking-widest">{device.vlan_tag === 999 ? 'Isolated' : 'Active'}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{device.hostname || 'Unnamed Device'}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{device.device_id}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-slate-300">{device.ip_address}</span>
                      <span className="text-[10px] font-mono text-slate-500">{device.mac_address}</span>
                    </div>
                  </td>
                  <td className="p-6 w-64">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${device.risk_score > 0.7 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                          style={{ width: `${device.risk_score * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold font-mono">{(device.risk_score * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    {device.vlan_tag !== 999 ? (
                      <button 
                        onClick={() => handleQuarantine(device.device_id)}
                        className="p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        title="Isolate Device"
                      >
                        <NoSymbolIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <button 
                        className="p-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                        title="Restore Device"
                      >
                        <ArrowPathIcon className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDevices.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-500 italic">No assets matching the current signature.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Devices;
