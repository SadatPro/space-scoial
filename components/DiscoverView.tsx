
import React, { useState, useMemo, useEffect } from 'react';
import { ExploreItem, ExploreTopic } from '../types';
import { 
  Search, 
  Play, 
  ArrowBigUp, 
  ArrowBigDown, 
  Share2, 
  Zap, 
  Loader2, 
  Clock, 
  ArrowRight, 
  MessageSquare, 
  Users, 
  Bookmark, 
  MoreHorizontal,
  ArrowLeft,
  Compass,
  Globe
} from 'lucide-react';
import { fetchRealTimeExploreItems } from '../services/geminiService';
import { MOCK_SPACES, MOCK_EXPLORE } from '../services/mockData';
import { ContentViewer } from './ContentViewer';
import { SpaceSpinner } from './Loading';

interface DiscoverViewProps {
  topics: ExploreTopic[];
  onSpaceClick: (id: string) => void;
  onSaveToCollection?: (item: ExploreItem) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({ topics, onSpaceClick, onSaveToCollection }) => {
  const [activeTab, setActiveTab] = useState<ExploreTopic>(topics[0] || { id: 'All', filter: 'All', sources: [], label: 'All', icon: <Zap />, enabled: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingItem, setViewingItem] = useState<ExploreItem | null>(null);

  const loadExplore = async (category: string, sources: string[]) => {
    setIsLoading(true);
    const data = await fetchRealTimeExploreItems(category, sources);
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeTab) {
      if (activeTab.filter === 'All') {
        setIsLoading(true);
        setTimeout(() => {
          setItems(MOCK_EXPLORE.sort(() => 0.5 - Math.random()));
          setIsLoading(false);
        }, 800);
      } else {
        loadExplore(activeTab.filter, activeTab.sources);
      }
    }
  }, [activeTab]);

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors pb-24">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-10 gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center">
             <Compass className="w-6 h-6 md:w-10 md:h-10 mr-2 md:mr-4 text-teal-600" />
             Explore
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-lg mt-1 md:mt-2">Verified community highlights from across the global web.</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <input 
            type="text" 
            placeholder="Search trends..."
            className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar mb-4 border-b border-gray-200 dark:border-gray-800 -mx-4 px-4 md:mx-0 md:px-0">
        {topics.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center space-x-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full font-black text-[10px] md:text-xs transition-all whitespace-nowrap border-2 ${
              activeTab.id === tab.id 
              ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/20' 
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-24">
           <SpaceSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
            <div 
              key={item.id} 
              onClick={() => setViewingItem(item)}
              className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col group cursor-pointer"
            >
              {/* Image Container: Fixed height on mobile (h-48), Aspect Ratio on desktop */}
              <div className="relative h-48 md:h-auto md:aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 md:p-4">
                  <div className="flex items-center space-x-2 text-white">
                     <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                     <span className="text-[10px] md:text-xs font-bold">Open</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest shadow-sm">
                   {item.type}
                </div>
              </div>
              <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                <div>
                   <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white leading-tight mb-1.5 md:mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">{item.title}</h3>
                   <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
                <div className="mt-3 md:mt-6 pt-2 md:pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                   <div className="flex items-center space-x-1.5 md:space-x-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                         <Globe className="w-3 h-3 text-slate-400" />
                      </div>
                      <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase truncate max-w-[80px]">{item.source.name}</span>
                   </div>
                   <button 
                     onClick={(e) => { e.stopPropagation(); onSaveToCollection?.(item); }}
                     className="p-1.5 md:p-2 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg md:rounded-xl text-slate-300 hover:text-teal-600 transition-all"
                   >
                      <Bookmark className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {viewingItem && (
        <ContentViewer item={viewingItem} onClose={() => setViewingItem(null)} />
      )}
    </div>
  );
};
