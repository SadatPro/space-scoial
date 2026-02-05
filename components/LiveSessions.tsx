
import React, { useState, useRef } from 'react';
import { LiveSession, User } from '../types';
import { Eye, Plus, Video, Image as ImageIcon, X, Radio } from 'lucide-react';

interface LiveSessionsProps {
  sessions: LiveSession[];
  onJoinSession: (title: string, host: User) => void;
  onViewStory: (session: LiveSession) => void;
  onCreateStory: (imageUrl: string) => void;
  onStartLive: (title: string) => void;
  currentUser: User;
}

export const LiveSessions: React.FC<LiveSessionsProps> = ({ sessions, onJoinSession, onViewStory, onCreateStory, onStartLive, currentUser }) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showLiveInput, setShowLiveInput] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onCreateStory(reader.result as string);
        setShowCreateMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoLive = () => {
    if (liveTitle.trim()) {
        onStartLive(liveTitle);
        setLiveTitle('');
        setShowLiveInput(false);
        setShowCreateMenu(false);
    }
  };

  const myStory = sessions.find(s => s.host.id === currentUser.id && s.type === 'story');

  return (
    <div className="w-full border-b border-gray-100 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors">
      <div className="p-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Stories & Live</h3>
        <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          
          {/* Create Button / My Story */}
          <div className="flex-shrink-0 w-20 flex flex-col items-center text-center group cursor-pointer relative" onClick={() => setShowCreateMenu(true)}>
            <div className="relative mb-2">
              <div className={`w-16 h-16 rounded-full p-1 ${myStory ? 'bg-gradient-to-tr from-teal-400 to-blue-500' : 'bg-transparent border-2 border-dashed border-slate-300 dark:border-slate-700'}`}>
                  <div className="w-full h-full object-cover rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-teal-500 transition-all overflow-hidden relative border-2 border-white dark:border-slate-900">
                    {myStory ? (
                        <img src={myStory.imageUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <Plus className="w-6 h-6"/>
                    )}
                    {myStory && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><Plus className="w-6 h-6 text-white" /></div>}
                  </div>
              </div>
              {!myStory && (
                 <div className="absolute bottom-0 right-0 bg-teal-500 rounded-full p-1 border-2 border-white dark:border-slate-900 shadow-sm">
                    <Plus className="w-3 h-3 text-white" />
                 </div>
              )}
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate w-full">Your Story</p>
          </div>

          {sessions.filter(s => s.host.id !== currentUser.id).map((session) => {
            const isLive = session.type === 'live';
            return (
              <div 
                key={session.id} 
                onClick={() => {
                  if (isLive) {
                    onJoinSession(session.title, session.host);
                  } else {
                    onViewStory(session);
                  }
                }}
                className="flex-shrink-0 w-20 flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="relative mb-2">
                  {/* Avatar Ring */}
                  <div className={`w-16 h-16 rounded-full p-[3px] ${
                      isLive 
                      ? 'bg-gradient-to-tr from-rose-500 via-red-500 to-orange-500 animate-pulse' 
                      : 'bg-gradient-to-tr from-teal-400 to-blue-500'
                  }`}>
                    <div className="bg-white dark:bg-slate-900 p-[2px] rounded-full h-full w-full">
                      <img 
                        src={session.host.avatarUrl} 
                        alt={session.host.name} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                  
                  {/* Live Badge */}
                  {isLive && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-rose-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center gap-1">
                      <Radio className="w-2 h-2 fill-current animate-pulse" />
                      LIVE
                    </div>
                  )}
                </div>
                
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate w-full group-hover:text-teal-600 transition-colors mt-1">
                    {session.host.name.split(' ')[0]}
                </p>
                
                {isLive && session.viewers && (
                  <div className="flex items-center justify-center space-x-1 text-slate-400 mt-0.5">
                    <Eye className="w-3 h-3" />
                    <span className="text-[9px] font-black">{(session.viewers / 1000).toFixed(1)}k</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Creation Modal */}
      {showCreateMenu && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-200 border border-white/20">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Create Content</h3>
                    <button onClick={() => { setShowCreateMenu(false); setShowLiveInput(false); }} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                
                {!showLiveInput ? (
                    <div className="p-6 grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 border-2 border-transparent hover:border-teal-100 dark:hover:border-teal-900/50 transition-all group"
                        >
                            <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <ImageIcon className="w-7 h-7 text-slate-400 group-hover:text-teal-500 transition-colors" />
                            </div>
                            <span className="font-bold text-sm">Add Story</span>
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />

                        <button 
                            onClick={() => setShowLiveInput(true)}
                            className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 border-2 border-transparent hover:border-rose-100 dark:hover:border-rose-900/50 transition-all group"
                        >
                            <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <Video className="w-7 h-7 text-slate-400 group-hover:text-rose-500 transition-colors" />
                            </div>
                            <span className="font-bold text-sm">Go Live</span>
                        </button>
                    </div>
                ) : (
                    <div className="p-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Live Session Title</label>
                        <input 
                            autoFocus
                            type="text" 
                            className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-rose-500/50 mb-6 dark:text-white transition-all text-lg"
                            placeholder="What's happening?"
                            value={liveTitle}
                            onChange={(e) => setLiveTitle(e.target.value)}
                        />
                        <button 
                            onClick={handleGoLive}
                            disabled={!liveTitle.trim()}
                            className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-colors disabled:opacity-50 shadow-lg shadow-rose-500/30"
                        >
                            Start Broadcast
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
