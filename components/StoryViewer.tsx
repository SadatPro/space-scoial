import React, { useEffect } from 'react';
import { LiveSession } from '../types';
import { X } from 'lucide-react';

interface StoryViewerProps {
  session: LiveSession;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ session, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5-second story duration

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm h-[90vh] max-h-[800px] bg-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white story-progress-bar"></div>
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
           <div className="flex items-center space-x-3">
             <img src={session.host.avatarUrl} className="w-8 h-8 rounded-full border-2 border-white/50" alt={session.host.name} />
             <span className="text-white text-sm font-bold">{session.host.name}</span>
           </div>
           <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
             <X className="w-6 h-6" />
           </button>
        </div>

        {/* Story Content */}
        {session.imageUrl && (
          <img src={session.imageUrl} className="w-full h-full object-cover" alt="Story content" />
        )}
      </div>
    </div>
  );
};