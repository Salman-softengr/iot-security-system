import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="px-4 sm:px-8 py-4 flex items-center justify-between gap-4 w-full border-b border-slate-100 bg-white">
      <div className="flex-1 max-w-2xl relative group hidden sm:block">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        <input 
          type="text" 
          placeholder="System-wide forensic search..."
          className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-300 uppercase tracking-widest"
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-6 ml-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
          </button>
          <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all hidden xs:block">
            <HelpCircle size={20} />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 mx-1 sm:mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-xs font-black text-slate-900 leading-none mb-1 uppercase italic tracking-tighter">Salman Ahmad</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Ops</p>
          </div>
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs border-2 border-transparent group-hover:border-blue-600 transition-all shadow-xl shadow-slate-900/10">
            SA
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
