import React, { useState } from 'react';
import { DEVICES } from '../data/devices';
import DeviceAvatar from '../components/DeviceAvatar';
import StatusBadge from '../components/StatusBadge';
import ScoreBar from '../components/ScoreBar';
import { Search, Filter, Camera, Cpu, Globe, Laptop, Printer, Tv, Router, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const DeviceRegistry = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const typeIcons = {
    Camera: Camera,
    Sensor: Cpu,
    Gateway: Globe,
    Laptop: Laptop,
    Printer: Printer,
    'Smart TV': Tv,
    Router: Router,
    'IP Phone': Smartphone,
    NAS: Database,
    Scanner: Terminal,
    Kiosk: Laptop,
  };

  const filteredDevices = DEVICES.filter(dev => {
    const matchesSearch = dev.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         dev.mac.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dev.ip.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || dev.status === statusFilter;
    const matchesType = typeFilter === 'all' || dev.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Asset Inventory</h1>
          <p className="text-slate-500 font-medium">Registry of all 24 authorized IoT nodes in the mesh.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-400">
           Showing {filteredDevices.length} of {DEVICES.length} assets
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, MAC, or IP..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            className="flex-1 md:w-40 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all cursor-pointer appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="safe">Safe</option>
            <option value="warning">Warning</option>
            <option value="threat">Threat</option>
            <option value="quarantined">Quarantined</option>
            <option value="offline">Offline</option>
          </select>

          <select 
            className="flex-1 md:w-40 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all cursor-pointer appearance-none"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Camera">Camera</option>
            <option value="Laptop">Laptop</option>
            <option value="Sensor">Sensor</option>
            <option value="Router">Router</option>
          </select>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredDevices.map((dev) => {
          const Icon = typeIcons[dev.type] || Cpu;
          return (
            <Link to={`/devices/${dev.id}`} key={dev.id} className="group">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 relative overflow-hidden h-full flex flex-col items-center text-center">
                <div className="absolute top-6 right-8">
                   <StatusBadge status={dev.status} />
                </div>
                
                <div className="mb-6 group-hover:scale-110 transition-transform duration-500">
                  <DeviceAvatar name={dev.name} status={dev.status} size="md" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg group-hover:text-blue-600 transition-colors">
                    <Icon size={14} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{dev.name}</h3>
                </div>

                <div className="space-y-1 mb-8">
                  <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">{dev.mac}</p>
                  <p className="text-xs font-mono font-bold text-slate-500">{dev.ip}</p>
                </div>

                <div className="mt-auto w-full pt-6 border-t border-slate-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anomaly Score</span>
                    <span className={`text-xs font-black ${dev.score > 0.7 ? 'text-red-600' : 'text-slate-600'}`}>{(dev.score * 100).toFixed(0)}%</span>
                  </div>
                  <ScoreBar score={dev.score} showValue={false} />
                  <p className="text-[10px] font-bold text-slate-300 mt-4 uppercase tracking-tighter italic">Last seen: {dev.lastSeen}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
           <p className="text-slate-400 font-bold italic">No devices found matching your security parameters.</p>
        </div>
      )}
    </div>
  );
};

export default DeviceRegistry;
