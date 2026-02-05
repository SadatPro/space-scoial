
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Search, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  PlayCircle, 
  Zap, 
  Tv, 
  Flame, 
  Globe, 
  Share2, 
  Music, 
  MoreHorizontal, 
  Volume2, 
  VolumeX, 
  Pause, 
  Camera, 
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Bell,
  Send
} from 'lucide-react';
import { ExploreItem, User } from '../types';
import { fetchRealTimeExploreItems } from '../services/geminiService';
import { ContentViewer } from './ContentViewer';
import { SpaceSpinner } from './Loading';
import { CURRENT_USER } from '../services/mockData';

interface VideoSectionProps {
  onSaveToCollection?: (item: ExploreItem) => void;
}

// Helper for embedding
const getEmbedUrl = (url: string): string => {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    return url;
};

// --- SHORT PLAYER COMPONENT ---
const ShortPlayer: React.FC<{ item: ExploreItem; isActive: boolean; onSave: () => void }> = ({ item, isActive, onSave }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    // Simulate progress for images or handle video time update
    useEffect(() => {
        let interval: any;
        if (isActive && isPlaying) {
            interval = setInterval(() => {
                setProgress(p => (p >= 100 ? 0 : p + 0.5));
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isActive, isPlaying]);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
        onSave();
    };

    return (
        <div className="w-full h-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full cursor-pointer" onClick={togglePlay}>
                <img 
                    src={item.imageUrl} 
                    className="h-full w-full object-cover" 
                    alt={item.title} 
                />
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={handleLike}>
                    <div className={`p-3 rounded-full transition-all duration-300 ${isLiked ? 'bg-white/20 text-red-500' : 'bg-black/20 hover:bg-black/40 text-white'}`}>
                        <Heart className={`w-7 h-7 ${isLiked ? 'fill-current scale-110' : ''}`} />
                    </div>
                    <span className="text-xs font-bold text-white drop-shadow-md">{isLiked ? (item.likes + 1) : item.likes}</span>
                </div>

                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="p-3 bg-black/20 hover:bg-black/40 rounded-full transition-all">
                        <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white drop-shadow-md">{item.commentsCount}</span>
                </div>

                <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={handleSave}>
                    <div className={`p-3 rounded-full transition-all ${isSaved ? 'bg-white/20 text-yellow-400' : 'bg-black/20 hover:bg-black/40 text-white'}`}>
                        <Bookmark className={`w-7 h-7 ${isSaved ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-xs font-bold text-white drop-shadow-md">{isSaved ? 'Saved' : 'Save'}</span>
                </div>

                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="p-3 bg-black/20 hover:bg-black/40 rounded-full transition-all">
                        <Share2 className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white drop-shadow-md">Share</span>
                </div>
                
                <div className="mt-2 w-10 h-10 rounded-lg border-2 border-white/80 overflow-hidden relative animate-spin-slow">
                    <img src={item.imageUrl} className="w-full h-full object-cover" alt="Audio" />
                </div>
            </div>

            <div className="absolute left-4 bottom-6 right-16 z-30 flex flex-col items-start text-left">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-full border border-white/50 p-0.5 cursor-pointer">
                        <img src={`https://ui-avatars.com/api/?name=${item.source.name}&background=random&color=fff`} className="w-full h-full rounded-full object-cover" alt="" />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-white font-bold text-sm drop-shadow-md cursor-pointer hover:underline">{item.source.name}</h4>
                        <button className="text-white/90 text-[10px] border border-white/30 px-2 py-0.5 rounded-md backdrop-blur-sm hover:bg-white/20 transition-all w-fit">Subscribe</button>
                    </div>
                </div>
                
                <p className="text-white text-sm font-medium line-clamp-2 leading-snug drop-shadow-md mb-3 pr-4">
                    {item.title} <span className="opacity-70">#trending #viral</span>
                </p>
                
                <div className="flex items-center gap-2 text-white/90 text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <Music className="w-3 h-3" />
                    <div className="overflow-hidden w-32">
                        <div className="whitespace-nowrap animate-marquee">
                            Original Audio • {item.source.name} • Trending Sound
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={toggleMute}
                className="absolute top-20 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white z-40 transition-colors"
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-40">
                <div className="h-full bg-white transition-all duration-75 ease-linear" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

// --- WATCH PAGE COMPONENT ---
const WatchView: React.FC<{ 
    video: ExploreItem; 
    suggestions: ExploreItem[]; 
    onBack: () => void; 
    onSelectVideo: (v: ExploreItem) => void; 
    onSave: (v: ExploreItem) => void;
}> = ({ video, suggestions, onBack, onSelectVideo, onSave }) => {
    const [comment, setComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to top when video changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [video.id]);

    const isDirectVideo = video.videoUrl && (video.videoUrl.endsWith('.mp4') || video.videoUrl.endsWith('.webm'));
    const embedUrl = getEmbedUrl(video.source.url || video.videoUrl || '');

    return (
        <div ref={scrollContainerRef} className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 pt-safe pb-safe scroll-smooth">
            <div className="max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8">
                <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 font-bold transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Feed</span>
                </button>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* LEFT SIDE (Main Stage): VIDEO PLAYER & COMMENTS */}
                    <div className="flex-1 min-w-0">
                        {/* Player */}
                        <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative mb-5 ring-1 ring-black/10 dark:ring-white/10">
                            {isDirectVideo ? (
                                <video src={video.videoUrl} className="w-full h-full" controls autoPlay playsInline />
                            ) : embedUrl ? (
                                <iframe 
                                    src={embedUrl} 
                                    className="w-full h-full" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center relative">
                                    <img src={video.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-xl" alt="" />
                                    <img src={video.imageUrl} className="relative z-10 h-3/4 rounded-xl shadow-2xl" alt="" />
                                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30">
                                        <a href={video.source.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-all">
                                            <span>Watch on {video.source.name}</span>
                                            <Globe className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-slate-800">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-3">
                                {video.title}
                            </h1>
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <img src={`https://ui-avatars.com/api/?name=${video.source.name}&background=random&color=fff`} className="w-12 h-12 rounded-full shadow-sm" alt="" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{video.source.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium">1.2M subscribers</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsSubscribed(!isSubscribed)}
                                        className={`ml-4 px-6 py-2.5 rounded-full font-black text-sm transition-all ${isSubscribed ? 'bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105'}`}
                                    >
                                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                    </button>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full p-1">
                                        <button 
                                            onClick={() => setIsLiked(!isLiked)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${isLiked ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
                                        >
                                            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                            <span>{isLiked ? (video.likes + 1) : video.likes}</span>
                                        </button>
                                        <div className="w-px h-6 bg-gray-300 dark:bg-slate-700 mx-1"></div>
                                        <button className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all">
                                            <ThumbsDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-full font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all">
                                        <Share2 className="w-4 h-4" />
                                        <span>Share</span>
                                    </button>
                                    <button onClick={() => onSave(video)} className="p-3 bg-gray-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all">
                                        <Bookmark className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mt-4 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                                <div className="font-bold text-slate-900 dark:text-slate-200 mb-2">{video.views || '500K views'} • {video.timestamp || '2 days ago'}</div>
                                <p>{video.description} ...more</p>
                            </div>
                        </div>

                        {/* Comments */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">{(video.commentsCount || 120).toLocaleString()} Comments</h3>
                                <button className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                                    <MoreHorizontal className="w-4 h-4" /> Sort by
                                </button>
                            </div>

                            <div className="flex gap-4 mb-8">
                                <img src={CURRENT_USER.avatarUrl} className="w-10 h-10 rounded-full" alt="" />
                                <div className="flex-1">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="Add a comment..." 
                                            className="w-full bg-transparent border-b border-gray-200 dark:border-slate-700 py-2 outline-none focus:border-teal-500 transition-colors dark:text-white"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        {comment && (
                                            <div className="flex justify-end gap-2 mt-2 animate-in fade-in slide-in-from-top-1">
                                                <button onClick={() => setComment('')} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">Cancel</button>
                                                <button className="px-4 py-2 text-sm font-bold bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors">Comment</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Mock Comments */}
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/150?u=a${video.id}${i}`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-xs text-slate-900 dark:text-white">User_{i}92</span>
                                                <span className="text-[10px] font-bold text-slate-400">2 hours ago</span>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                                This is honestly the best breakdown of this topic I've seen. The visuals really helped explain the complex parts!
                                            </p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                                    <ThumbsUp className="w-3.5 h-3.5" /> 24
                                                </button>
                                                <button className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                                    <ThumbsDown className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Reply</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE (Sidebar): SUGGESTIONS */}
                    {/* Fixed Height and Sticky Positioning for Sidebar */}
                    <div className="w-full lg:w-[400px] flex flex-col gap-4 shrink-0 lg:sticky lg:top-6 lg:h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar">
                        <h3 className="font-black text-slate-900 dark:text-white text-lg px-1 shrink-0">Up Next</h3>
                        {suggestions.filter(v => v.id !== video.id).map(suggestion => (
                            <div 
                                key={suggestion.id} 
                                onClick={() => onSelectVideo(suggestion)}
                                className="flex gap-3 group cursor-pointer hover:bg-white dark:hover:bg-slate-900 p-2 rounded-xl transition-all"
                            >
                                <div className="relative w-40 aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                                    <img src={suggestion.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 rounded">
                                        {suggestion.duration || '04:20'}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-teal-600 transition-colors">
                                        {suggestion.title}
                                    </h4>
                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{suggestion.source.name}</p>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                                        <span>{suggestion.views || '15K views'}</span>
                                        <span>•</span>
                                        <span>{suggestion.timestamp || '2 days ago'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export const VideoSection: React.FC<VideoSectionProps> = ({ onSaveToCollection }) => {
  const [activeMode, setActiveMode] = useState<'main' | 'shorts' | 'watch'>('main');
  const [videos, setVideos] = useState<ExploreItem[]>([]);
  const [shorts, setShorts] = useState<ExploreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingVideo, setViewingVideo] = useState<ExploreItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [shortsTab, setShortsTab] = useState<'For You' | 'Following'>('For You');

  const videoCategories = [
    { id: 'All', label: 'All', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'Anime', label: 'Anime', icon: <Tv className="w-3.5 h-3.5" /> },
    { id: 'Games', label: 'Gaming', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'Tech', label: 'Technology', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'Music', label: 'Music', icon: <PlayCircle className="w-3.5 h-3.5" /> }
  ];

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRealTimeExploreItems(selectedCategory === 'All' ? 'Videos' : selectedCategory, ['youtube.com', 'bilibili.com']);
      setVideos(data);
      const shortsData = await fetchRealTimeExploreItems('Vertical Shorts', ['tiktok.com', 'youtube.com/shorts']);
      setShorts(shortsData);
      await new Promise(r => setTimeout(r, 1200));
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { loadVideos(); }, [selectedCategory]);

  const handleVideoClick = (video: ExploreItem) => {
      setViewingVideo(video);
      setActiveMode('watch');
  };

  return (
    <div className={`w-full h-full min-h-screen overflow-hidden flex flex-col font-sans transition-colors duration-300 relative ${activeMode === 'shorts' ? 'bg-black' : 'bg-[#f4f4f4] dark:bg-slate-950'}`}>
      
      {/* Navigation Bar (Hidden in Watch Mode) */}
      {activeMode !== 'watch' && (
        <div className={`
            z-50 px-4 md:px-8 py-3 pt-safe transition-all duration-300 flex items-center justify-between
            ${activeMode === 'shorts' 
                ? 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent text-white border-none' 
                : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0'}
        `}>
            <div className="flex items-center space-x-4">
                {activeMode === 'shorts' && (
                    <button onClick={() => setActiveMode('main')} className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all">
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                )}
                
                <div className="flex items-center space-x-2 shrink-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-colors ${activeMode === 'shorts' ? 'bg-transparent text-white border-2 border-white' : 'bg-teal-500 text-white shadow-teal-500/20'}`}>
                        <Tv className="w-5 h-5" />
                    </div>
                    <h1 className={`text-lg font-black tracking-tighter uppercase hidden sm:block ${activeMode === 'shorts' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>Space Play</h1>
                </div>
                
                {activeMode === 'main' && (
                    <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1 hidden md:flex">
                        {videoCategories.map(cat => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${selectedCategory === cat.id ? 'bg-teal-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            {cat.icon}<span>{cat.label}</span>
                        </button>
                        ))}
                    </nav>
                )}
            </div>

            {activeMode === 'shorts' ? (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-6 text-sm font-bold shadow-black drop-shadow-md">
                    <button 
                        onClick={() => setShortsTab('Following')}
                        className={`transition-colors ${shortsTab === 'Following' ? 'text-white scale-110' : 'text-white/60 hover:text-white/80'}`}
                    >
                        Following
                    </button>
                    <div className="w-px h-4 bg-white/20 self-center"></div>
                    <button 
                        onClick={() => setShortsTab('For You')}
                        className={`transition-colors ${shortsTab === 'For You' ? 'text-white scale-110' : 'text-white/60 hover:text-white/80'}`}
                    >
                        For You
                    </button>
                </div>
            ) : (
                <div className="flex items-center space-x-3">
                    <div className="relative group flex-1 md:w-64">
                        <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none dark:text-white" />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex p-1 rounded-xl shrink-0 bg-slate-100 dark:bg-slate-800">
                        <button onClick={() => setActiveMode('main')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm`}>Grid</button>
                        <button onClick={() => setActiveMode('shorts')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:text-slate-600 dark:hover:text-slate-300`}>Shorts</button>
                    </div>
                </div>
            )}
            
            {activeMode === 'shorts' && (
                <div className="flex items-center gap-4">
                    <button className="text-white hover:text-teal-400 transition-colors"><Search className="w-6 h-6" /></button>
                    <button className="text-white hover:text-teal-400 transition-colors"><Camera className="w-6 h-6" /></button>
                </div>
            )}
        </div>
      )}

      <div className="flex-1 relative overflow-hidden">
        {isLoading ? <div className="h-full flex items-center justify-center"><SpaceSpinner /></div> : (
          <>
             {activeMode === 'main' && (
               <div className="h-full overflow-y-auto no-scrollbar pb-24 md:pb-8">
                   <div className="max-w-[1800px] mx-auto p-3 md:p-8">
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                          {videos.map(video => (
                            <div key={video.id} onClick={() => handleVideoClick(video)} className="group flex flex-col cursor-pointer animate-in fade-in duration-500">
                              <div className="aspect-video relative overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 mb-2 shadow-sm">
                                  <img src={video.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-[10px] font-black opacity-100 group-hover:opacity-0 transition-opacity">
                                    <div className="flex items-center space-x-2">
                                        <span className="flex items-center"><Play className="w-2.5 h-2.5 mr-1 fill-current" /> {video.views || '2k'}</span>
                                    </div>
                                    <span>{video.duration || '05:20'}</span>
                                  </div>
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/10"><div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shadow-xl"><Play className="w-4 h-4 fill-current text-white ml-1" /></div></div>
                              </div>
                              <div className="flex space-x-2 px-1">
                                  <img src={`https://ui-avatars.com/api/?name=${video.source.name}&background=random&color=fff`} className="w-8 h-8 rounded-full border border-gray-100 dark:border-slate-800 hidden sm:block" alt="" />
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-teal-600 transition-colors mb-1">{video.title}</h3>
                                    <div className="flex flex-col text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                        <span className="truncate">{video.source.name}</span>
                                        <span className="flex items-center mt-0.5">{video.timestamp || '2d ago'} • <span className="text-teal-500 ml-1">৳ Free</span></span>
                                    </div>
                                  </div>
                              </div>
                            </div>
                          ))}
                      </div>
                   </div>
               </div>
             )}

             {activeMode === 'shorts' && (
               <div className="w-full h-full flex justify-center bg-black">
                  <div className="absolute inset-0 hidden md:block opacity-30 blur-3xl pointer-events-none">
                      {shorts[0]?.imageUrl && (
                          <img src={shorts[0].imageUrl} className="w-full h-full object-cover" alt="" />
                      )}
                  </div>

                  <div className="w-full md:max-w-[420px] h-full bg-black relative z-10 shadow-2xl overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth">
                      {shorts.map((short, index) => (
                          <ShortPlayer 
                            key={short.id} 
                            item={short} 
                            isActive={true} 
                            onSave={() => onSaveToCollection?.(short)} 
                          />
                      ))}
                  </div>
               </div>
             )}

             {activeMode === 'watch' && viewingVideo && (
                 <WatchView 
                    video={viewingVideo} 
                    suggestions={videos} 
                    onBack={() => { setActiveMode('main'); setViewingVideo(null); }} 
                    onSelectVideo={handleVideoClick}
                    onSave={(v) => onSaveToCollection?.(v)}
                 />
             )}
          </>
        )}
      </div>
    </div>
  );
};
