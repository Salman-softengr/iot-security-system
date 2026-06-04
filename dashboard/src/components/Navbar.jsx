import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="sticky top-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-2xl relative group">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        <input 
          type="text" 
          placeholder="Global system search (threats, MACs, protocols...)"
          className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
            <HelpCircle size={20} />
          </button>
        </div>

        <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">Salman Ahmad</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Senior Admin</p>
          </div>
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm border-2 border-transparent group-hover:border-blue-600 transition-all">
            SA
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
