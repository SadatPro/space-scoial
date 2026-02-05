
import React, { useState, useRef, useEffect } from 'react';
import { User, Message } from '../types';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  Bot, 
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { chatWithAi } from '../services/geminiService';

interface AiChatViewProps {
  currentUser: User;
}

export const AiChatView: React.FC<AiChatViewProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      senderId: 'ai',
      content: "Hello! I am Space AI. I can help you verify facts, explain complex tech topics, or just chat. What's on your mind today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await chatWithAi(inputValue);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-teal-400 shadow-xl shadow-slate-900/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Space AI</h1>
            <div className="flex items-center space-x-1.5">
               <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Intelligent Engine v2.0</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-3 bg-white border border-gray-100 rounded-2xl text-slate-400 hover:text-teal-600 hover:border-teal-100 transition-all shadow-sm"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white/60 shadow-inner mb-6">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex items-start space-x-3 max-w-[85%] ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-teal-400 shrink-0 mt-1">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                )}
                <div className={`px-5 py-3.5 rounded-3xl shadow-sm ${
                  isMe 
                  ? 'bg-slate-900 text-white rounded-tr-sm' 
                  : 'bg-white border border-gray-100 text-slate-800 rounded-tl-sm'
                }`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <div className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-40 ${isMe ? 'text-right' : ''}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="flex items-center space-x-3 px-5 py-3.5 bg-white border border-gray-100 rounded-3xl rounded-tl-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest">Verifying info...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="relative group">
        <input 
          type="text" 
          placeholder="Ask Space AI anything..." 
          className="w-full pl-6 pr-16 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-xl focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-lg font-medium"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all ${
            inputValue.trim() && !isTyping 
            ? 'bg-slate-900 text-white shadow-lg hover:bg-teal-600' 
            : 'bg-gray-100 text-gray-300'
          }`}
        >
          <Send className="w-6 h-6" />
        </button>
      </div>

      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-100 text-[10px] font-black text-teal-700 uppercase tracking-[0.2em]">
           <Sparkles className="w-3 h-3" />
           <span>Search Grounding Enabled</span>
        </div>
      </div>
    </div>
  );
};