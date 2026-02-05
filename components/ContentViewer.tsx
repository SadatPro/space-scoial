import React, { useState, useEffect, useRef } from 'react';
import { ExploreItem } from '../types';
import { X, ExternalLink, Loader2, FileText, Image as ImageIcon, Video, Globe, BookOpen } from 'lucide-react';
import { fetchAndSummarizeUrl } from '../services/geminiService';

interface ContentViewerProps {
  item: ExploreItem;
  onClose: () => void;
}

// Helper to get embeddable URL
const getEmbedUrl = (url: string): string => {
    if (!url) return '';
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    // Bilibili
    const biliMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
    if (biliMatch) return `https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&high_quality=1&danmaku=0`;
    
    return url;
};

export const ContentViewer: React.FC<ContentViewerProps> = ({ item, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [readerContent, setReaderContent] = useState<{ title: string; summary: string } | null>(null);
  const [isFetchingReader, setIsFetchingReader] = useState(false);
  const loadSuccessRef = useRef(false);

  const url = getEmbedUrl(item.source.url);
  const isPdf = url.endsWith('.pdf');
  const isVideo = item.type === 'video';
  const isImage = item.type === 'image' || item.type === 'gallery';
  
  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);
    setReaderContent(null);
    setIsFetchingReader(false);
    loadSuccessRef.current = false;
    
    const isIframeContent = url && url !== '#' && !item.imageUrl;

    if (isIframeContent) {
      const timer = setTimeout(() => {
        if (!loadSuccessRef.current) {
          setIsLoading(false);
          setLoadError(true);
        }
      }, 8000); // 8-second timeout for iframe loading

      return () => clearTimeout(timer);
    } else if (!item.imageUrl) {
      setIsLoading(false);
    }
  }, [item, url]);

  const handleLoadSuccess = () => {
    loadSuccessRef.current = true;
    setIsLoading(false);
    setLoadError(false);
  };
  
  const handleActivateReaderMode = async () => {
    setIsFetchingReader(true);
    setReaderContent(null);
    const result = await fetchAndSummarizeUrl(item.source.url);
    setReaderContent(result);
    setIsFetchingReader(false);
  };

  const renderContent = () => {
    if (readerContent) {
      return (
        <div className="h-full bg-slate-50 overflow-y-auto p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
             <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">{readerContent.title}</h1>
             <div className="text-base md:text-lg text-slate-800 leading-relaxed whitespace-pre-wrap space-y-4">
               {readerContent.summary.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
               ))}
             </div>
          </div>
        </div>
      );
    }

    if (loadError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-100 text-slate-500 p-8 text-center">
          <Globe className="w-16 h-16 mb-6 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Content Cannot Be Displayed Here</h3>
          <p className="max-w-md mb-6">Due to the source's security policy, this content can't be shown inside the app. You can open it in a new tab or try our AI-powered Reader Mode.</p>
          <div className="flex items-center space-x-3">
            <a 
              href={item.source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in New Tab</span>
            </a>
            <button
              onClick={handleActivateReaderMode}
              disabled={isFetchingReader}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-teal-600 transition-all disabled:opacity-50"
            >
              {isFetchingReader ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
              <span>{isFetchingReader ? 'Summarizing...' : 'Reader Mode'}</span>
            </button>
          </div>
        </div>
      );
    }

    if (url && url !== '#') {
      return (
        <iframe
          src={url}
          className={`w-full h-full border-0 transition-opacity duration-300 ${isLoading || loadError ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoadSuccess}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={item.title}
          sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        ></iframe>
      );
    }
    
    if (item.imageUrl) {
        return <img src={item.imageUrl} alt={item.title} className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`} onLoad={handleLoadSuccess} />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-100 text-slate-400">
            <ImageIcon className="w-16 h-16 mb-4" />
            <p className="font-bold">No viewable content</p>
        </div>
    );
  };
  
  const getContentTypeIcon = () => {
      if (readerContent) return <BookOpen className="w-4 h-4 text-slate-500" />;
      if (isVideo) return <Video className="w-4 h-4 text-slate-500" />;
      if (isPdf) return <FileText className="w-4 h-4 text-slate-500" />;
      if (isImage) return <ImageIcon className="w-4 h-4 text-slate-500" />;
      return <Globe className="w-4 h-4 text-slate-500" />;
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-0 md:p-8 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-none md:rounded-[2rem] w-full h-full md:max-w-6xl md:h-[90%] shadow-2xl flex flex-col overflow-hidden border border-white/20">
        <div className="flex-shrink-0 px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4 min-w-0">
             <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                {getContentTypeIcon()}
             </div>
             <div className="min-w-0">
               <h3 className="text-sm md:text-base font-bold text-slate-900 truncate">{readerContent?.title || item.title}</h3>
               <a href={item.source.url} target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs text-slate-500 hover:text-teal-600 transition-colors truncate block">
                 {item.source.url}
               </a>
             </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
             <a 
                href={item.source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-white border border-gray-100 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-teal-600 transition-colors"
                title="Open in new tab"
             >
                <ExternalLink className="w-4 h-4" />
             </a>
             <button 
                onClick={onClose} 
                className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-red-600 transition-colors"
                title="Close viewer"
             >
                <X className="w-4 h-4" />
             </button>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-200 relative">
           {(isLoading || isFetchingReader) && !readerContent && (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
               <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
             </div>
           )}
           {renderContent()}
        </div>
      </div>
    </div>
  );
};