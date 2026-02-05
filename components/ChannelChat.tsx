
import React, { useState, useEffect, useRef } from 'react';
import { Channel, Message, User } from '../types';
import { Send, Paperclip, Image as ImageIcon, Smile, MoreVertical, ArrowLeft, Lock, MessageSquare, Edit3, Trash2, Menu, MapPin, FileText, X } from 'lucide-react';

interface ChannelChatProps {
  channel: Channel;
  currentUser: User;
  onSendMessage: (channelId: string, content: string) => void;
  onBack: () => void;
  onEditChannel: (channelId: string) => void;
  onDeleteChannel: (channelId: string) => void;
  onToggleChannels?: () => void;
}

export const ChannelChat: React.FC<ChannelChatProps> = ({ channel, currentUser, onSendMessage, onBack, onEditChannel, onDeleteChannel, onToggleChannels }) => {
  const [inputValue, setInputValue] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channel.messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(channel.id, inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLocationShare = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            // In a real app, you would send a message object with type 'location'
            // For this UI demo, we'll simulate sending text that looks like a location share
            // Ideally, onSendMessage should handle object payloads or we use a separate handler
            // Simulating via text for now to fit the existing string-based prop, but 
            // logically this would dispatch a structured message.
            const locMsg = `📍 Shared Location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
            onSendMessage(channel.id, locMsg);
            setShowAttachments(false);
        }, (error) => {
            alert("Could not fetch location.");
        });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          // Simulate file upload message
          const fileMsg = `📄 File: ${file.name} (${(file.size/1024).toFixed(1)} KB)`;
          onSendMessage(channel.id, fileMsg);
          setShowAttachments(false);
      }
  };

  const renderMessageContent = (msg: Message) => {
      if (msg.content.startsWith('📍 Shared Location:')) {
          return (
              <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-teal-600 font-bold text-sm">
                      <MapPin className="w-4 h-4" /> Live Location
                  </div>
                  <div className="h-32 w-full bg-slate-200 rounded-lg relative overflow-hidden flex items-center justify-center">
                      {/* Placeholder map visual */}
                      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.42,37.78,14,0/300x200?access_token=PLACEHOLDER')] bg-cover bg-center opacity-50"></div>
                      <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center relative z-10 animate-pulse">
                          <div className="w-3 h-3 bg-teal-600 rounded-full border-2 border-white"></div>
                      </div>
                  </div>
                  <p className="text-xs opacity-70">{msg.content.replace('📍 Shared Location:', '')}</p>
              </div>
          );
      }
      
      if (msg.content.startsWith('📄 File:')) {
          return (
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="font-bold text-sm truncate max-w-[200px]">{msg.content.replace('📄 File:', '').split('(')[0].trim()}</p>
                      <p className="text-[10px] opacity-60 uppercase font-bold">{msg.content.split('(')[1]?.replace(')', '') || 'FILE'}</p>
                  </div>
              </div>
          );
      }

      return <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>;
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white/50 relative">
      
      {/* Glassmorphic Header */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-white/20 z-20 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center md:hidden bg-slate-100 rounded-full p-1">
             <button onClick={onBack} className="p-2 rounded-full hover:bg-white text-slate-700 transition-all">
                <ArrowLeft className="w-5 h-5" />
             </button>
             {onToggleChannels && (
                <button onClick={onToggleChannels} className="p-2 rounded-full hover:bg-white text-slate-700 transition-all">
                    <Menu className="w-5 h-5" />
                </button>
             )}
          </div>
          
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-500/30 shrink-0">
            {channel.isPrivate ? <Lock className="w-5 h-5 md:w-6 md:h-6" /> : channel.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
                <h2 className="font-bold text-slate-900 text-base md:text-lg truncate">{channel.name}</h2>
                {channel.isPrivate && <Lock className="w-3 h-3 text-slate-400" />}
            </div>
            <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate">{(channel.members || 0).toLocaleString()} members</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
            <button 
                onClick={() => setShowMenu(!showMenu)} 
                className="text-gray-400 hover:text-slate-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
                <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-30 animate-in fade-in zoom-in duration-200">
                        <button 
                            onClick={() => { setShowMenu(false); onEditChannel(channel.id); }}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors"
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Channel</span>
                        </button>
                        <button 
                            onClick={() => { setShowMenu(false); onDeleteChannel(channel.id); }}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors border-t border-gray-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Channel</span>
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 pt-28 md:pt-24 space-y-6 bg-slate-50/50 pb-safe">
        {channel.messages.length > 0 ? (
            channel.messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] md:max-w-[75%] shadow-sm ${
                    isMe 
                    ? 'bg-slate-900 text-white rounded-2xl rounded-tr-sm shadow-slate-900/10' 
                    : 'bg-white border border-white text-slate-800 rounded-2xl rounded-tl-sm shadow-[0_4px_12px_rgba(0,0,0,0.03)]'
                    } px-4 py-3 md:px-5 md:py-3.5 transition-all hover:shadow-md`}>
                    {!isMe && <div className="text-xs font-bold text-teal-600 mb-1 opacity-80">{msg.senderId === 'u2' ? 'Tech Bot' : msg.senderId === 'u3' ? 'Sarah' : 'User'}</div>}
                    
                    {renderMessageContent(msg)}

                    <div className={`text-[9px] mt-1 text-right font-medium ${isMe ? 'text-slate-400' : 'text-gray-400'}`}>{msg.timestamp}</div>
                </div>
                </div>
            );
            })
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <MessageSquare className="w-12 h-12 mb-2" />
                <p className="text-sm font-bold">Start the conversation!</p>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-20 pb-safe relative">
        {/* Attachments Menu */}
        {showAttachments && (
            <>
                <div className="fixed inset-0 z-30" onClick={() => setShowAttachments(false)}></div>
                <div className="absolute bottom-20 left-4 z-40 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 p-4 animate-in slide-in-from-bottom-4 zoom-in duration-200">
                    <div className="grid grid-cols-3 gap-4">
                        <button 
                            onClick={handleLocationShare}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-600">Location</span>
                        </button>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-600">Document</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 group">
                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-600">Gallery</span>
                        </button>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileSelect} 
                    />
                </div>
            </>
        )}

        <div className="flex items-center space-x-2 bg-gray-50/80 p-2 rounded-3xl border border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:bg-white transition-all shadow-inner">
          <button 
            onClick={() => setShowAttachments(!showAttachments)}
            className={`p-2.5 transition-colors rounded-full hover:bg-white ${showAttachments ? 'text-teal-600 bg-teal-50 rotate-45' : 'text-gray-400 hover:text-teal-600'}`}
          >
            {showAttachments ? <X className="w-5 h-5" /> : <Paperclip className="w-5 h-5" />}
          </button>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-gray-400 text-sm font-medium h-10 px-2"
            placeholder={`Message #${channel.name}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="hidden sm:flex space-x-1">
            <button className="p-2 text-gray-400 hover:text-teal-600 transition-colors rounded-full hover:bg-white">
                <Smile className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`p-3 rounded-2xl transition-all duration-300 ${
                inputValue.trim() 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30 hover:bg-teal-600 hover:scale-105 hover:shadow-teal-500/30' 
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
