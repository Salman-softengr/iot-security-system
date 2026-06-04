import React, { useState } from 'react';
import { ALL_DEVICES } from '../data/devices';
import DeviceAvatar from '../components/DeviceAvatar';
import StatusBadge from '../components/StatusBadge';
import ScoreBar from '../components/ScoreBar';
import { Search, Filter, Camera, Cpu, Globe, Laptop, Printer, Tv, Router, Smartphone, Database, Terminal } from 'lucide-react';
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

  const filteredDevices = ALL_DEVICES.filter(dev => {
    const matchesSearch = dev.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         dev.mac.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dev.ip.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || dev.status === statusFilter;
    const matchesType = typeFilter === 'all' || dev.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">Operational Asset Registry</h1>
          <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em]">Inventory of all {ALL_DEVICES.length} authorized nodes in the grid.</p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400">
           Displaying {filteredDevices.length} / {ALL_DEVICES.length} verified units
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row gap-6 items-center">
        <div className="relative flex-1 group w-full">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by ID, MAC signature, or IP..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-bold placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full xl:w-auto">
          <div className="flex-1 md:w-56 relative">
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all cursor-pointer appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Global Status</option>
              <option value="safe">Safe Nodes</option>
              <option value="warning">Warning Signs</option>
              <option value="threat">Active Threats</option>
              <option value="quarantined">Isolated</option>
            </select>
          </div>

          <div className="flex-1 md:w-56 relative">
            <Cpu size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all cursor-pointer appearance-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Device Classes</option>
              {Array.from(new Set(ALL_DEVICES.map(d => d.type))).map(t => (
                <option key={t} value={t}>{t}s</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredDevices.map((dev) => {
          const Icon = typeIcons[dev.type] || Cpu;
          return (
            <Link to={`/devices/${dev.id}`} key={dev.id} className="group">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 relative overflow-hidden h-full flex flex-col">
                <div className="flex justify-between items-start mb-8">
                   <div className={`p-3 rounded-2xl border transition-colors ${dev.status === 'threat' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:text-blue-600 group-hover:border-blue-100'}`}>
                      <Icon size={20} />
                   </div>
                   <StatusBadge status={dev.status} />
                </div>
                
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="mb-6 group-hover:scale-105 transition-transform duration-700 ease-out">
                    <DeviceAvatar name={dev.name} status={dev.status} size="md" imageUrl={dev.image} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight uppercase italic">{dev.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{dev.manufacturer} • {dev.type}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">MAC SIGNATURE</p>
                    <p className="text-[11px] font-mono font-bold text-slate-700">{dev.mac}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">IP ADDRESS</p>
                    <p className="text-[11px] font-mono font-bold text-slate-700">{dev.ip}</p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Risk Potential</span>
                    <span className={`text-xs font-black ${dev.score > 0.7 ? 'text-red-600 animate-pulse' : 'text-slate-600'}`}>{(dev.score * 100).toFixed(0)}%</span>
                  </div>
                  <ScoreBar score={dev.score} showValue={false} />
                  <div className="flex justify-between items-center mt-5">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Seen {dev.lastSeen}</p>
                    <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity underline underline-offset-4 decoration-2">Inspect Vector</button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[4rem] border border-slate-100 shadow-inner">
           <div className="p-6 bg-slate-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 text-slate-300 border border-slate-100">
              <Search size={40} />
           </div>
           <h2 className="text-2xl font-black text-slate-900 mb-2 italic uppercase">No Matching Entities</h2>
           <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Adjust your filters to scan for other network assets.</p>
        </div>
      )}
    </div>
  );
};

export default DeviceRegistry;
