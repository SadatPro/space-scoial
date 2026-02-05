
import React, { useState, useEffect } from "react";
import {
  Zap,
  Play,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

import { ExploreItem, ExploreTopic } from "../types";
import { fetchRealTimeExploreItems } from "../services/geminiService";
import { ContentViewer } from "./ContentViewer";

interface ExploreViewProps {
  topics: Omit<ExploreTopic, 'enabled'>[];
  onSpaceClick: (id: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ topics, onSpaceClick }) => {
  const [activeTab, setActiveTab] = useState(topics[0] || { id: "All", filter: "All", sources: [] });
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingItem, setViewingItem] = useState<ExploreItem | null>(null);
  
  const loadExplore = async (category: string, sources: string[]) => {
    try {
      setIsLoading(true);
      const data = await fetchRealTimeExploreItems(category, sources);
      setItems(data || []);
    } catch (error) {
      console.error("Explore load failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if(activeTab) {
      setCurrentPage(1);
      loadExplore(activeTab.filter, activeTab.sources);
    }
  }, [activeTab]);

  const isPinterestLayout = activeTab.id === "Gallery" || activeTab.id === "Arts" || activeTab.id === "Crafts";
  const isYoutubeLayout = activeTab.id === "Videos" || activeTab.id === "Anime";
  const isRedditLayout = !isPinterestLayout && !isYoutubeLayout;
  
  const ITEMS_PER_PAGE = isPinterestLayout ? 12 : 6;
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const currentItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500">
      {/* Tabs */}
      <div className="flex overflow-x-auto gap-3 p-3 sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 no-scrollbar pt-safe">
        {topics.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab.id === tab.id
                ? "bg-teal-600 text-white shadow-teal-500/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-20 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs flex flex-col items-center animate-in fade-in duration-500">
          <Zap className="w-8 h-8 mb-4 text-teal-500 animate-pulse" />
          Loading content...
        </div>
      )}

      {!isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ---- YOUTUBE STYLE GRID ---- */}
            {isYoutubeLayout && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                {currentItems.map((item, index) => (
                    <div
                    key={index}
                    className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group cursor-pointer"
                    onClick={() => setViewingItem(item)}
                    >
                    <div className="relative aspect-video">
                        <img
                            src={item.imageUrl}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt={item.title}
                        />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <Play className="w-12 h-12 text-white fill-current drop-shadow-lg" />
                         </div>
                    </div>
                    <div className="p-5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">{item.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{item.description}</p>
                         <div className="flex items-center space-x-2 mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <span>{item.source.name}</span>
                             <span>•</span>
                             <span>{item.views || '1K views'}</span>
                         </div>
                    </div>
                    </div>
                ))}
                </div>
            )}

            {/* ---- PINTEREST GRID ---- */}
            {isPinterestLayout && (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 p-4 space-y-4">
                {currentItems.map((item, index) => (
                    <div key={index} className="break-inside-avoid relative group rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all" onClick={() => setViewingItem(item)}>
                        <img
                        src={item.imageUrl}
                        className="w-full transition-transform duration-700 group-hover:scale-105"
                        alt={item.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end">
                            <p className="text-white font-bold text-sm leading-tight drop-shadow-md">{item.title}</p>
                            <p className="text-white/80 text-xs mt-1 font-medium truncate">{item.source.name}</p>
                        </div>
                    </div>
                ))}
                </div>
            )}

            {/* ---- REDDIT / SOCIAL CARD GRID ---- */}
            {isRedditLayout && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {currentItems.map((item, index) => (
                    <div
                    key={index}
                    className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-900 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
                    onClick={() => setViewingItem(item)}
                    >
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 font-black text-sm">
                             {item.source.name.charAt(0)}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <span className="text-slate-900 dark:text-white">u/{item.source.name.replace(/\s/g,'')}</span>
                             <span className="mx-2">•</span>
                             <span>{item.timestamp || 'Now'}</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 mb-4">
                         <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-teal-600 transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-3 leading-relaxed">{item.description}</p>
                    </div>

                    {item.imageUrl && (
                        <div className="rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 h-56 w-full mb-5 relative">
                            <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                        </div>
                    )}
                    
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
                         <div className="flex items-center space-x-2 group-hover:text-teal-500 transition-colors">
                             <Zap className="w-4 h-4 fill-current" />
                             <span>{item.likes}</span>
                         </div>
                         <div className="uppercase tracking-widest text-[10px] flex items-center space-x-1 group-hover:text-teal-600 transition-colors">
                            <span>Read More</span>
                            <ArrowRight className="w-3 h-3" />
                         </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 py-8 pb-20">
                    <button 
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    <span className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
      )}
      {viewingItem && (
        <ContentViewer item={viewingItem} onClose={() => setViewingItem(null)} />
      )}
    </div>
  );
}
