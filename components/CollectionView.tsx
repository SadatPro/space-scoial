
import React, { useState, useMemo } from 'react';
import { Post, ExploreItem } from '../types';
import { 
  Bookmark, 
  Trash2, 
  Search, 
  LayoutGrid, 
  List, 
  Star, 
  Zap, 
  Clock, 
  AlertCircle,
  Play,
  FileText,
  ChevronDown,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { PostCard } from './PostCard';

interface CollectionViewProps {
  savedItems: (Post | ExploreItem)[];
  onRemoveItem: (id: string) => void;
  onUpdateImportance: (id: string, importance: 'High' | 'Medium' | 'Low') => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({ savedItems, onRemoveItem, onUpdateImportance }) => {
  const [activeType, setActiveType] = useState<'all' | 'posts' | 'videos'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredItems = useMemo(() => {
    return savedItems.filter(item => {
      const titleText = 'content' in item ? item.content : item.title;
      const matchesSearch = titleText.toLowerCase().includes(searchQuery.toLowerCase());
      const isPost = 'content' in item;
      const isVideo = ('type' in item && item.type === 'video') || ('videoUrl' in item && !!item.videoUrl);
      
      if (activeType === 'posts') return matchesSearch && isPost;
      if (activeType === 'videos') return matchesSearch && isVideo;
      return matchesSearch;
    }).sort((a, b) => {
        const priority = { High: 3, Medium: 2, Low: 1 };
        return (priority[b.importance || 'Low'] || 0) - (priority[a.importance || 'Low'] || 0);
    });
  }, [savedItems, activeType, searchQuery]);

  const importanceConfig = {
    High: { color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', icon: <Flame className="w-3 h-3" /> },
    Medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: <Zap className="w-3 h-3" /> },
    Low: { color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', icon: <AlertCircle className="w-3 h-3" /> }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center space-x-4">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-teal-400 shadow-lg">
             <Bookmark className="w-6 h-6 fill-current" />
           </div>
           <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Collection</h1>
             <p className="text-slate-500 text-sm font-medium">Sorted by Importance.</p>
           </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <input 
                    type="text" 
                    placeholder="Search saved..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-600">
                {viewMode === 'list' ? <LayoutGrid className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button>
        </div>
      </div>

      {/* Type Filter Chips */}
      <div className="flex items-center space-x-2 mb-8">
          {[
              { id: 'all', label: 'All', icon: <Zap className="w-3 h-3" /> },
              { id: 'posts', label: 'Posts', icon: <FileText className="w-3 h-3" /> },
              { id: 'videos', label: 'Videos', icon: <Play className="w-3 h-3" /> }
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveType(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold text-xs transition-all border ${
                    activeType === tab.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                  {tab.icon}
                  <span>{tab.label}</span>
              </button>
          ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0' : ''}`}>
            {filteredItems.map(item => {
                const config = importanceConfig[item.importance || 'Low'];
                return (
                    <div key={item.id} className="relative group">
                        {/* Status Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl z-10 ${item.importance === 'High' ? 'bg-rose-500' : item.importance === 'Medium' ? 'bg-amber-500' : 'bg-teal-500'}`} />
                        
                        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-all relative">
                            {/* Management Header */}
                            <div className="px-4 py-2 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                <div className={`flex items-center space-x-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${config.bg} ${config.color} ${config.border}`}>
                                    {config.icon}
                                    <span>{item.importance || 'Low'} Importance</span>
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <select 
                                        value={item.importance || 'Low'} 
                                        onChange={(e) => onUpdateImportance(item.id, e.target.value as any)}
                                        className="text-[10px] font-bold bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer"
                                    >
                                        <option value="High">Priority: High</option>
                                        <option value="Medium">Priority: Med</option>
                                        <option value="Low">Priority: Low</option>
                                    </select>
                                    <button 
                                        onClick={() => onRemoveItem(item.id)}
                                        className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {'content' in item ? (
                                <div className="p-1">
                                    <PostCard post={item} isSaved={true} onSave={() => onRemoveItem(item.id)} />
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-48 aspect-video md:aspect-square bg-gray-100 shrink-0 relative">
                                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                                        {item.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <Play className="w-8 h-8 text-white fill-current" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 p-4 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight group-hover:text-teal-600 transition-colors">{item.title}</h3>
                                            <p className="text-gray-500 text-xs font-medium line-clamp-2">{item.description}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3 text-[10px] font-bold text-gray-400 uppercase">
                                                <span>{item.source.name}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                <div className="flex items-center space-x-1"><Star className="w-3 h-3 text-amber-500 fill-current" /> <span>{item.likes}</span></div>
                                            </div>
                                            <a href={item.source.url} target="_blank" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-teal-500 hover:text-white transition-all">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      ) : (
        <div className="py-24 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
           <Bookmark className="w-12 h-12 text-gray-200 mx-auto mb-4" />
           <p className="text-gray-400 font-bold text-lg">Your collection is empty.</p>
           <p className="text-gray-400 text-sm mt-1">Items you save with high importance will appear here first.</p>
        </div>
      )}
    </div>
  );
};
