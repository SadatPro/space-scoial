
import React, { useState, useRef, useEffect } from 'react';
import { DirectMessageThread, User } from '../types';
import { MOCK_DMS } from '../services/mockData';
import { MessageSquare, X, Send, ChevronUp, ChevronDown } from 'lucide-react';

interface MiniChatProps {
  currentUser: User;
}

export const MiniChat: React.FC<MiniChatProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState(MOCK_DMS);
  const [inputValue, setInputValue] = useState('');
  
  const activeThread = threads.find(t => t.id === activeThreadId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeThreadId) return;
    
    const newMsg = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        content: inputValue,
        timestamp: 'Just now',
        type: 'text' as const
    };

    setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
            return {
                ...t,
                messages: [...t.messages, newMsg],
                lastMessage: inputValue,
                lastTimestamp: 'Just now'
            };
        }
        return t;
    }));
    
    setInputValue('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-[0_10px_40px_-10px_rgba(15,23,42,0.5)] hover:bg-teal-600 hover:scale-110 hover:shadow-[0_20px_40px_-10px_rgba(13,148,136,0.5)] transition-all duration-300 z-50 flex items-center space-x-3 group"
      >
        <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="font-bold hidden md:inline pr-2">Messages</span>
        {threads.some(t => t.unread) && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/50 z-50 flex flex-col max-h-[600px] h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden ring-1 ring-black/5">
      
      {/* Header */}
      <div 
        className="p-4 bg-slate-900 text-white flex justify-between items-center cursor-pointer relative overflow-hidden"
        onClick={() => {
            if (activeThreadId) setActiveThreadId(null);
            else setIsOpen(false);
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-slate-900 opacity-50"></div>
        <div className="flex items-center space-x-3 relative z-10">
           {activeThreadId ? (
               <div className="flex items-center space-x-3">
                   <button onClick={(e) => { e.stopPropagation(); setActiveThreadId(null); }} className="hover:bg-white/20 p-1.5 rounded-full transition-colors"><ChevronUp className="w-5 h-5 -rotate-90" /></button>
                   <div className="flex items-center space-x-2">
                       <img src={activeThread?.user.avatarUrl} className="w-8 h-8 rounded-full border border-white/30" />
                       <span className="font-bold tracking-tight">{activeThread?.user.name}</span>
                   </div>
               </div>
           ) : (
               <span className="font-bold text-lg tracking-tight pl-2">Messages</span>
           )}
        </div>
        <div className="flex items-center space-x-2 relative z-10">
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <ChevronDown className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        {!activeThreadId ? (
            // Thread List
            <div className="divide-y divide-gray-100/50">
                {threads.map(thread => (
                    <div 
                        key={thread.id} 
                        onClick={() => setActiveThreadId(thread.id)}
                        className="p-4 hover:bg-white/80 cursor-pointer transition-colors flex items-center space-x-4 group"
                    >
                        <div className="relative">
                            <img src={thread.user.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" />
                            {thread.unread && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-teal-500 border-2 border-white rounded-full shadow-sm"></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className={`text-sm truncate ${thread.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{thread.user.name}</h4>
                                <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{thread.lastTimestamp}</span>
                            </div>
                            <p className={`text-xs truncate ${thread.unread ? 'font-medium text-slate-800' : 'text-gray-500'}`}>{thread.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            // Chat View
            <div className="p-4 space-y-3 flex flex-col h-full bg-slate-50">
                <div className="flex-1 space-y-3">
                    {activeThread?.messages.map(msg => {
                        const isMe = msg.senderId === currentUser.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] shadow-sm ${
                                    isMe 
                                    ? 'bg-slate-900 text-white rounded-br-sm' 
                                    : 'bg-white border border-gray-100 text-slate-800 rounded-bl-sm'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        )}
      </div>

      {/* Footer Input */}
      {activeThreadId && (
          <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-2 py-1 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:bg-white transition-all border border-transparent focus-within:border-teal-200">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder-gray-400"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={handleSendMessage} 
                    disabled={!inputValue.trim()}
                    className="p-2 text-white bg-teal-600 hover:bg-teal-700 rounded-full disabled:opacity-50 disabled:bg-gray-300 transition-colors shadow-sm"
                  >
                      <Send className="w-4 h-4" />
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
