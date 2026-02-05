
import React, { useState, useRef, useEffect } from 'react';
import { DirectMessageThread, User, MessengerNote, Message } from '../types';
import { 
  Search, 
  Video, 
  Phone, 
  Info, 
  Send, 
  Smile, 
  Image as ImageIcon, 
  Mic,
  ArrowLeft,
  Users,
  Plus,
  Monitor,
  Volume2,
  VolumeX,
  MicOff,
  ChevronDown,
  X,
  VideoOff,
  PhoneOff,
  Maximize2,
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  MapPin,
  FileText
} from 'lucide-react';

interface MessengerViewProps {
  currentUser: User;
  threads: DirectMessageThread[];
  notes: MessengerNote[];
  onAddNote: (content: string) => void;
  onSendMessage: (threadId: string, content: string) => void;
  onBack?: () => void;
}

export const MessengerView: React.FC<MessengerViewProps> = ({ currentUser, threads, notes, onAddNote, onSendMessage, onBack }) => {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  
  // Note Creation State
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const activeThread = threads.find(t => t.id === activeThreadId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages, activeThreadId]);

  const handleSend = () => {
    if (!inputValue.trim() || !activeThreadId) return;
    onSendMessage(activeThreadId, inputValue);
    setInputValue('');
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteContent.trim()) {
        onAddNote(noteContent);
        setNoteContent('');
        setIsAddingNote(false);
    }
  };

  const handleLocationShare = () => {
    if (navigator.geolocation && activeThreadId) {
        navigator.geolocation.getCurrentPosition((position) => {
            const locMsg = `📍 Shared Location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
            onSendMessage(activeThreadId, locMsg);
            setShowAttachments(false);
        }, () => alert("Could not fetch location."));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && activeThreadId) {
          const file = e.target.files[0];
          const fileMsg = `📄 File: ${file.name} (${(file.size/1024).toFixed(1)} KB)`;
          onSendMessage(activeThreadId, fileMsg);
          setShowAttachments(false);
      }
  };

  const renderMessageContent = (msg: Message) => {
      if (msg.content.startsWith('📍 Shared Location:')) {
          return (
              <div className="flex flex-col gap-2 min-w-[200px]">
                  <div className="flex items-center gap-2 text-teal-600 font-bold text-sm">
                      <MapPin className="w-4 h-4" /> Live Location
                  </div>
                  <div className="h-28 w-full bg-slate-200/50 rounded-lg relative overflow-hidden flex items-center justify-center border border-white/10">
                      <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center relative z-10 animate-pulse">
                          <div className="w-3 h-3 bg-teal-600 rounded-full border-2 border-white"></div>
                      </div>
                  </div>
                  <p className="text-[10px] opacity-70 font-mono">{msg.content.replace('📍 Shared Location:', '')}</p>
              </div>
          );
      }
      
      if (msg.content.startsWith('📄 File:')) {
          return (
              <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl border border-white/10">
                  <div className="w-10 h-10 bg-indigo-500/20 text-indigo-300 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="font-bold text-sm truncate max-w-[150px]">{msg.content.replace('📄 File:', '').split('(')[0].trim()}</p>
                      <p className="text-[10px] opacity-60 uppercase font-bold">{msg.content.split('(')[1]?.replace(')', '') || 'FILE'}</p>
                  </div>
              </div>
          );
      }

      return <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>;
  };

  // Check if current user already has a note
  const myNote = notes.find(n => n.user.id === currentUser.id);

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 relative overflow-hidden pt-safe">
      {/* Sidebar - Hidden on mobile when thread is active */}
      <div className={`w-full md:w-96 flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-all ${activeThreadId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                {onBack && (
                  <button onClick={onBack} className="md:hidden p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                )}
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Messages</h1>
            </div>
            <button className="p-3 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-2xl transition-all shadow-sm"><Users className="w-5 h-5" /></button>
          </div>
          <div className="relative">
            <input type="text" placeholder="Search..." className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-teal-500/20 transition-all outline-none dark:text-white" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Notes Tray */}
        <div className="px-6 mb-4 overflow-x-auto no-scrollbar flex space-x-5 py-2">
           <div className="flex-shrink-0 flex flex-col items-center cursor-pointer" onClick={() => setIsAddingNote(true)}>
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all relative border border-slate-200 dark:border-slate-700">
                {myNote ? (
                    <img src={currentUser.avatarUrl} className="w-full h-full rounded-full object-cover" alt="" />
                ) : (
                    <Plus className="w-6 h-6" />
                )}
                <div className="absolute bottom-0 right-0 bg-teal-500 rounded-full p-1 border-2 border-white dark:border-slate-900">
                    <Plus className="w-3 h-3 text-white" />
                </div>
                {myNote && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded-lg truncate max-w-[64px] shadow-lg animate-in zoom-in">{myNote.content}</div>
                )}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase mt-2">Your Note</span>
           </div>
           
           {notes.filter(n => n.user.id !== currentUser.id).map(note => (
              <div key={note.id} className="flex-shrink-0 flex flex-col items-center w-16">
                 <div className="relative">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-teal-400 to-blue-500">
                       <img src={note.user.avatarUrl} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900" alt="" />
                    </div>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded-lg truncate max-w-[64px] shadow-lg">{note.content}</div>
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase mt-2 truncate w-full text-center">{note.user.name.split(' ')[0]}</span>
              </div>
           ))}
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {threads.map(thread => (
            <button key={thread.id} onClick={() => setActiveThreadId(thread.id)} className={`w-full flex items-center space-x-4 px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border-l-4 ${activeThreadId === thread.id ? 'bg-slate-50 dark:bg-slate-800/50 border-teal-500' : 'border-transparent'}`}>
              <div className="relative shrink-0">
                <img src={thread.user?.avatarUrl} className="w-14 h-14 rounded-full object-cover shadow-sm border border-gray-100 dark:border-slate-700" alt="" />
                <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white dark:border-slate-900 rounded-full ${thread.unread ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className={`font-black truncate ${thread.unread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{thread.user?.name}</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase">{thread.lastTimestamp}</span>
                </div>
                <p className={`text-sm truncate ${thread.unread ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-400 font-medium'}`}>{thread.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Thread Content */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 transition-all ${!activeThreadId ? 'hidden md:flex' : 'flex'}`}>
        {activeThread ? (
          <>
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <button onClick={() => setActiveThreadId(null)} className="md:hidden p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><ArrowLeft className="w-5 h-5 text-slate-700 dark:text-white" /></button>
                <img src={activeThread.user?.avatarUrl} className="w-10 h-10 rounded-full border border-gray-100 dark:border-slate-700" alt="" />
                <div><h2 className="font-black text-slate-900 dark:text-white leading-tight">{activeThread.user?.name}</h2><p className="text-[10px] text-teal-600 font-black uppercase tracking-widest">Active Now</p></div>
              </div>
              <div className="flex items-center space-x-1 md:space-x-3">
                <button className="p-2.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-xl transition-all"><Phone className="w-5 h-5" /></button>
                <button className="p-2.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-xl transition-all"><Video className="w-5 h-5" /></button>
                <button className="hidden sm:block p-2.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-xl transition-all"><Info className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20 dark:bg-slate-950/20">
              {activeThread.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[80%] md:max-w-[70%] px-5 py-3 rounded-2xl shadow-sm ${isMe ? 'bg-slate-900 text-white rounded-br-sm' : 'bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-sm'}`}>
                      {renderMessageContent(msg)}
                      <div className="text-[9px] mt-1.5 text-right font-black uppercase opacity-40">{msg.timestamp}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <div className="p-6 pb-20 md:pb-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 relative">
              {showAttachments && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowAttachments(false)}></div>
                    <div className="absolute bottom-24 left-6 z-40 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 p-4 animate-in slide-in-from-bottom-4 zoom-in duration-200">
                        <div className="grid grid-cols-3 gap-4">
                            <button onClick={handleLocationShare} className="flex flex-col items-center gap-2 group">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Location</span>
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 group">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Document</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 group">
                                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Gallery</span>
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                    </div>
                  </>
              )}

              <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
                <button 
                    onClick={() => setShowAttachments(!showAttachments)}
                    className={`p-2 transition-colors rounded-full hover:bg-white dark:hover:bg-slate-700 ${showAttachments ? 'text-teal-600 bg-teal-50 rotate-45' : 'text-slate-400 hover:text-teal-600'}`}
                >
                    {showAttachments ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </button>
                <input type="text" placeholder="Message..." className="flex-1 bg-transparent border-none outline-none text-sm font-bold py-2 dark:text-white" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
                <button onClick={handleSend} disabled={!inputValue.trim()} className={`p-2.5 rounded-xl transition-all ${inputValue.trim() ? 'bg-slate-900 text-white' : 'text-slate-400'}`}><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center"><div className="w-24 h-24 bg-teal-50 dark:bg-teal-900/10 rounded-full flex items-center justify-center mb-6"><MessageSquare className="w-10 h-10 text-teal-600" /></div><h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Your Conversations</h3><p className="text-slate-500 dark:text-slate-400 max-w-xs font-medium">Select a thread to start chatting or launch a secure call.</p></div>
        )}
      </div>

      {/* Note Creation Modal */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-sm p-6 shadow-2xl animate-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Share a thought</h3>
                    <button onClick={() => setIsAddingNote(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <form onSubmit={handleNoteSubmit}>
                    <div className="relative mb-6">
                        <div className="w-16 h-16 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-teal-400 to-blue-500 mb-2">
                            <img src={currentUser.avatarUrl} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900" alt="" />
                        </div>
                        <div className="absolute -top-2 right-1/2 translate-x-[60px] bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none shadow-lg max-w-[150px]">
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 break-words">{noteContent || "Typing..."}</p>
                        </div>
                    </div>
                    <input 
                        autoFocus
                        maxLength={60}
                        type="text" 
                        placeholder="What's happening?" 
                        className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-xl text-center font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/50 transition-all mb-4"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setIsAddingNote(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" disabled={!noteContent.trim()} className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">Share</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
