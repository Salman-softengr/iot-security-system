import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Brain, Network, Bell, 
  Database, ShieldCheck, RefreshCcw, Save, Server, 
  Mail, MessageSquare, Slack
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [threshold, setThreshold] = useState(0.70);
  const [interval, setIntervalVal] = useState('10s');

  const handleSave = (section) => {
    toast.success(`${section} configuration updated successfully.`);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">System Configuration</h1>
        <p className="text-slate-500 font-medium">Global parameters for AI inference, network monitoring, and response protocols.</p>
      </header>

      {/* AI Model Config */}
      <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
         <div className="flex justify-between items-start mb-10">
            <div className="flex gap-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Brain size={24}/></div>
               <div>
                  <h3 className="text-xl font-black text-slate-900">Neural Engine Tuning</h3>
                  <p className="text-sm font-bold text-slate-400">Configure anomaly detection sensitivity and model refresh rates.</p>
               </div>
            </div>
            <button onClick={() => handleSave('AI Model')} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20">
               <Save size={14}/> Save Changes
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
               <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Detection Threshold</span>
                  <span className="text-blue-600 text-lg font-black">{threshold.toFixed(2)}</span>
               </div>
               <input 
                 type="range" min="0" max="1" step="0.01" 
                 className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                 value={threshold}
                 onChange={(e) => setThreshold(parseFloat(e.target.value))}
               />
               <p className="text-xs font-bold text-slate-500 italic">Lower values increase sensitivity but may lead to higher false positives.</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collection Interval</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600/10"
                    value={interval}
                    onChange={(e) => setIntervalVal(e.target.value)}
                  >
                     <option value="5s">5 Seconds</option>
                     <option value="10s">10 Seconds</option>
                     <option value="30s">30 Seconds</option>
                     <option value="60s">60 Seconds</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Version</label>
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl">
                     <span className="text-sm font-black text-slate-700">v2.3.1</span>
                     <button className="text-blue-600 hover:text-blue-700 transition-colors"><RefreshCcw size={16}/></button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Network Config */}
      <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
         <div className="flex justify-between items-start mb-10">
            <div className="flex gap-4">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Network size={24}/></div>
               <div>
                  <h3 className="text-xl font-black text-slate-900">Network Interfaces</h3>
                  <p className="text-sm font-bold text-slate-400">Manage data collection points and isolation protocols.</p>
               </div>
            </div>
            <button onClick={() => handleSave('Network')} className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-purple-600/20">
               <Save size={14}/> Save Changes
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monitor Interface</label>
               <input type="text" defaultValue="eth0" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 font-mono outline-none" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quarantine VLAN</label>
               <input type="number" defaultValue="999" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 font-mono outline-none" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kafka Broker URL</label>
               <input type="text" defaultValue="kafka:9092" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 font-mono outline-none" />
            </div>
         </div>
      </section>

      {/* Notifications */}
      <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
         <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <Bell className="text-emerald-600" /> Alert Routing
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { name: 'Email Alerts', icon: Mail, sub: 'admin@shield.local' },
               { name: 'SMS Gateway', icon: MessageSquare, sub: '+1 (555) 902-1234' },
               { name: 'Slack Hook', icon: Slack, sub: '#security-ops' },
            ].map(type => (
               <div key={type.name} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm"><type.icon size={20}/></div>
                     <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1">{type.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{type.sub}</p>
                     </div>
                  </div>
                  <div className="w-10 h-6 bg-slate-200 rounded-full relative shadow-inner group-hover:bg-emerald-100">
                     <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* System Status Table */}
      <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
         <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <Server className="text-slate-400" /> Infrastructure Health
         </h3>
         <div className="overflow-hidden rounded-2xl border border-slate-50">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-8 py-4">Service Node</th>
                     <th className="px-8 py-4">Status</th>
                     <th className="px-8 py-4">Process Uptime</th>
                     <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 font-bold text-sm text-slate-600 uppercase">
                  {[
                    { name: 'Edge Collector', st: 'healthy', up: '14d 3h' },
                    { name: 'Apache Kafka', st: 'healthy', up: '60d 2h' },
                    { name: 'Inference Engine', st: 'healthy', up: '3d 1h' },
                    { name: 'Orchestrator', st: 'healthy', up: '14d 3h' },
                    { name: 'TimescaleDB', st: 'healthy', up: '90d 4h' },
                  ].map(svc => (
                    <tr key={svc.name} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-8 py-4 tracking-tight">{svc.name}</td>
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-black">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span> ONLINE
                          </div>
                       </td>
                       <td className="px-8 py-4 text-xs font-mono">{svc.up}</td>
                       <td className="px-8 py-4 text-right">
                          <button className="text-[10px] text-slate-400 hover:text-blue-600 font-black tracking-widest uppercase">Restart</button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
};

export default Settings;
