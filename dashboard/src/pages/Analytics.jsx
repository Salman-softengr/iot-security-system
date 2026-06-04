import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Cell
} from 'recharts';
import { TRAFFIC_DATA, ANOMALY_HISTORY } from '../data/mockData';
import { FileText, Download, TrendingUp, PieChart as PieIcon, Cpu, Zap, Activity, AlertCircle } from 'lucide-react';
import MetricCard from '../components/MetricCard';

const Analytics = () => {
  const ACCURACY_DATA = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    tp: 94 + Math.random() * 2,
    fp: 2 + Math.random() * 1,
  }));

  const RISK_HEATMAP = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    val: Math.random(),
  }));

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Advanced Analytics</h1>
          <p className="text-slate-500 font-medium">Model performance, traffic trends, and system accuracy reports.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white p-1 rounded-xl border border-slate-100 flex shadow-sm font-bold text-[10px] uppercase">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Last 24h</button>
              <button className="px-4 py-2 text-slate-400">7 Days</button>
              <button className="px-4 py-2 text-slate-400">30 Days</button>
           </div>
           <button className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20">
              <FileText size={16} /> Generate Report
           </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Packets Analyzed" value="2.4M" icon="Zap" color="blue" subtitle="+14% vs yesterday" />
        <MetricCard title="Avg Detection Time" value="142ms" icon="Activity" color="emerald" subtitle="Sub-second isolation" />
        <MetricCard title="True Positives" value="98.2%" icon="TrendingUp" color="cyan" subtitle="Model confidence" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Detection Accuracy */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                 <Cpu className="text-blue-600" /> Model Accuracy over Time
              </h3>
              <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                 <span className="text-blue-600">True Positives</span>
                 <span className="text-red-400">False Positives</span>
              </div>
           </div>
           <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={ACCURACY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis hide />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="black" domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Line type="monotone" dataKey="tp" stroke="#2563eb" strokeWidth={4} dot={false} />
                    <Line type="monotone" dataKey="fp" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Device Risk Heatmap */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Asset Risk Heatmap</h3>
           <div className="grid grid-cols-6 gap-3">
              {RISK_HEATMAP.map((node) => (
                <div 
                  key={node.id} 
                  className={`aspect-square rounded-xl border border-white/20 flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-110 hover:z-10 shadow-sm`}
                  style={{ 
                    backgroundColor: node.val > 0.8 ? '#ef4444' : node.val > 0.5 ? '#f59e0b' : '#22c55e',
                    opacity: 0.6 + node.val * 0.4
                  }}
                  title={`Node ${node.id}: ${(node.val * 100).toFixed(0)}% risk`}
                >
                   <span className="text-[9px] font-black text-white">{node.id}</span>
                </div>
              ))}
           </div>
           <div className="mt-8 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
              <span>Low Risk</span>
              <span>High Risk</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-12 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Traffic Volume by Protocol</h3>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TRAFFIC_DATA}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                     <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                     <YAxis stroke="#94a3b8" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                     <Tooltip />
                     <Area type="monotone" dataKey="tcp" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                     <Area type="monotone" dataKey="udp" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                     <Area type="monotone" dataKey="arp" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Model Performance Row */}
      <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] grid grid-cols-1 md:grid-cols-3 gap-12 border border-slate-800 shadow-2xl">
         <div className="space-y-4">
            <h4 className="text-blue-400 font-black uppercase text-xs tracking-widest">Autoencoder Performance</h4>
            <div className="flex items-baseline gap-2">
               <span className="text-5xl font-black tracking-tighter">94.3%</span>
               <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Accuracy Rate</span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed italic">Reconstruction error optimized across 2.4 million training points using Adam optimizer (lr=0.001).</p>
         </div>
         <div className="space-y-4">
            <h4 className="text-purple-400 font-black uppercase text-xs tracking-widest">False Positive Audit</h4>
            <div className="flex items-baseline gap-2">
               <span className="text-5xl font-black tracking-tighter text-emerald-400">2.1%</span>
               <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Anomaly Drift</span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed italic">Isolation Forest contamination factor tuned to 0.1 for high-precision mission-critical assets.</p>
         </div>
         <div className="flex flex-col justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95">Retrain AI Models Now</button>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
