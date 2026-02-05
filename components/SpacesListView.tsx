
import React, { useState, useMemo } from 'react';
import { Space } from '../types';
import { Search, Users, Plus, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

interface SpacesListViewProps {
  spaces: Space[];
  onSpaceClick: (id: string) => void;
}

export const SpacesListView: React.FC<SpacesListViewProps> = ({ spaces, onSpaceClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpaces = useMemo(() => {
    return spaces.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [spaces, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-12 pb-32 min-h-screen pt-safe">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Sub Spaces</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Discover and join verified communities.</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <input 
            type="text" 
            placeholder="Search spaces..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
        </div>
      </div>

      {/* NEW COMPACT Discovery Widget */}
      <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-5 md:p-6 mb-8 text-white relative overflow-hidden shadow-xl border border-white/5">
         <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-teal-500 rounded-full blur-[40px] opacity-20"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-teal-400">
                  <Plus className="w-6 h-6" />
               </div>
               <div>
                  <h2 className="text-lg font-black leading-tight">Create your own Sub Space</h2>
                  <p className="text-slate-400 text-xs font-medium">Launch a verified community in seconds.</p>
               </div>
            </div>
            <button className="w-full md:w-auto bg-teal-500 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-teal-400 transition-all active:scale-95 flex items-center justify-center space-x-2">
               <span>Start Now</span>
               <ArrowRight className="w-3 h-3" />
            </button>
         </div>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center space-x-3 mb-8 overflow-x-auto no-scrollbar pb-1">
         <button className="flex items-center space-x-2 px-5 py-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black text-slate-900 dark:text-slate-300 hover:border-teal-200 transition-all whitespace-nowrap uppercase tracking-widest">
            <Globe className="w-3.5 h-3.5" />
            <span>Trending</span>
         </button>
         <button className="flex items-center space-x-2 px-5 py-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black text-slate-900 dark:text-slate-300 hover:border-teal-200 transition-all whitespace-nowrap uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            <span>Friends</span>
         </button>
         <button className="flex items-center space-x-2 px-5 py-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black text-slate-900 dark:text-slate-300 hover:border-teal-200 transition-all whitespace-nowrap uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified</span>
         </button>
      </div>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpaces.map(s => (
          <div 
            key={s.id} 
            onClick={() => onSpaceClick(s.id)} 
            className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-50 dark:border-slate-800 flex flex-col cursor-pointer"
          >
            <div className="h-40 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
               <img src={s.bannerUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
               <div className="absolute bottom-4 left-5 flex items-center space-x-3">
                  <div className="w-11 h-11 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl overflow-hidden">
                    {s.iconUrl ? (
                      <img src={s.iconUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      s.name.charAt(0)
                    )}
                  </div>
                  <div>
                     <h3 className="text-base font-black text-white tracking-tight">sub/{s.name.toLowerCase().replace(/\s+/g, '')}</h3>
                     <p className="text-teal-400 text-[9px] font-black uppercase tracking-widest">{s.members.toLocaleString()} members</p>
                  </div>
               </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed mb-6 line-clamp-2">{s.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${s.id}${i}`} alt="" />
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-900 dark:bg-slate-700 text-[7px] font-black text-white flex items-center justify-center">
                    +10
                  </div>
                </div>
                <div className="text-teal-600 dark:text-teal-400 font-black text-[10px] uppercase tracking-widest flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                   <span>Enter</span>
                   <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredSpaces.length === 0 && (
        <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
           <Users className="w-12 h-12 text-slate-100 dark:text-slate-800 mx-auto mb-4" />
           <p className="text-slate-400 font-bold">No spaces found matching your search.</p>
           <button onClick={() => setSearchQuery('')} className="mt-2 text-teal-600 font-black text-[10px] uppercase tracking-widest underline">Reset</button>
        </div>
      )}
    </div>
  );
};
