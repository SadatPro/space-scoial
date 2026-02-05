
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MessageSquare, 
  Users, 
  PhoneOff, 
  Settings, 
  Smile,
  X,
  Send,
  Hand,
  MoreHorizontal
} from 'lucide-react';
import { MOCK_USERS } from '../services/mockData';

interface MeetingRoomProps {
  meetingTitle: string;
  currentUser: User;
  onLeave: () => void;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({ meetingTitle, currentUser, onLeave }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [sidePanelTab, setSidePanelTab] = useState<'participants' | 'chat'>('participants');
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>('u2');
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [meetingMessages, setMeetingMessages] = useState<any[]>([]);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  // Participants including self
  const [participants, setParticipants] = useState(MOCK_USERS.slice(0, 6));

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setMeetingDuration(prev => prev + 1), 1000);
    const speakerInterval = setInterval(() => {
        const otherIds = participants.filter(p => p.id !== currentUser.id).map(p => p.id);
        setActiveSpeakerId(otherIds[Math.floor(Math.random() * otherIds.length)]);
    }, 4000);
    return () => {
        clearInterval(timer);
        clearInterval(speakerInterval);
    };
  }, [participants, currentUser.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [meetingMessages]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleHand = () => setIsHandRaised(!isHandRaised);

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setMeetingMessages([...meetingMessages, {
      id: Date.now().toString(),
      sender: currentUser.name,
      content: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatMessage('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] text-white font-sans overflow-hidden flex flex-col animate-in fade-in duration-500">
      {/* Ambient Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/5 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none"></div>

      {/* Floating Header */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20 pointer-events-none">
        {/* Meeting Info Pill */}
        <div className="pointer-events-auto flex items-center space-x-4 bg-[#1a1a1a]/80 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/5 shadow-2xl transition-all hover:bg-[#1a1a1a]">
           <div className="flex items-center space-x-2">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
             <span className="font-mono text-sm font-medium text-white/90 w-10">{formatDuration(meetingDuration)}</span>
           </div>
           <div className="w-px h-4 bg-white/10"></div>
           <h1 className="font-bold text-sm text-white tracking-tight">{meetingTitle}</h1>
        </div>

        {/* Top Right Controls */}
        <div className="pointer-events-auto flex items-center space-x-3">
           <button 
             onClick={() => { setShowSidePanel(!showSidePanel); setSidePanelTab('participants'); }}
             className={`flex items-center space-x-2 px-4 py-2.5 rounded-full border border-white/5 transition-all shadow-xl hover:scale-105 active:scale-95 ${showSidePanel && sidePanelTab === 'participants' ? 'bg-teal-500 text-white' : 'bg-[#1a1a1a]/80 backdrop-blur-xl text-white/90 hover:bg-white/10'}`}
           >
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold">{participants.length}</span>
           </button>
           <button className="bg-[#1a1a1a]/80 backdrop-blur-xl p-2.5 rounded-full border border-white/5 hover:bg-white/10 transition-all shadow-xl hover:rotate-90 active:scale-95">
              <Settings className="w-4 h-4 text-white/90" />
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative z-10 pt-20 pb-28 px-6">
        
        {/* Video Grid */}
        <div className={`flex-1 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] ${showSidePanel ? 'mr-4' : ''}`}>
           <div className={`w-full h-full grid gap-4 max-w-[1600px] max-h-[85vh] ${
             isSharingScreen ? 'grid-cols-3 grid-rows-3' :
             participants.length <= 1 ? 'grid-cols-1' :
             participants.length === 2 ? 'grid-cols-2' :
             participants.length <= 4 ? 'grid-cols-2 grid-rows-2' :
             'grid-cols-3 grid-rows-2'
           }`}>
             {/* Screen Share View - Takes priority/large space if active */}
             {isSharingScreen && (
                <div className="col-span-3 row-span-2 relative rounded-[2rem] overflow-hidden bg-[#161616] shadow-2xl ring-1 ring-teal-500/50 group">
                    <div className="absolute top-4 left-4 bg-teal-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-20 flex items-center gap-2">
                        <Monitor className="w-3 h-3" />
                        You are sharing your screen
                    </div>
                    <div className="w-full h-full flex items-center justify-center bg-[#202020] pattern-grid">
                        {/* Mock Screen Content */}
                        <div className="w-[80%] h-[70%] bg-slate-900 rounded-xl shadow-2xl border border-white/10 flex flex-col overflow-hidden opacity-80">
                            <div className="h-6 bg-slate-800 border-b border-white/5 flex items-center px-2 gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                            <div className="flex-1 p-4 grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 rounded-lg"></div>
                                <div className="bg-slate-800/50 rounded-lg"></div>
                                <div className="col-span-2 h-20 bg-slate-800/50 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
             )}

             {participants.map(p => {
               const isMe = p.id === currentUser.id;
               const isActiveSpeaker = p.id === activeSpeakerId;
               const hasHandRaised = isMe ? isHandRaised : false;

               // If screen sharing is active, push participants to bottom row
               if (isSharingScreen) {
                   // Only show a few participants or make them small in bottom row
               }

               return (
                 <div key={p.id} className={`relative rounded-[2rem] overflow-hidden bg-[#161616] shadow-2xl group ring-1 ring-white/5 transition-all duration-300 ${isSharingScreen ? 'row-start-3' : ''}`}>
                    
                    {/* Active Speaker Border */}
                    <div className={`absolute inset-0 border-[3px] rounded-[2rem] z-20 pointer-events-none transition-all duration-500 ${isActiveSpeaker && !isSharingScreen ? 'border-teal-500 shadow-[inset_0_0_40px_rgba(20,184,166,0.2)]' : 'border-transparent'}`}></div>
                    
                    {/* Video/Avatar */}
                    <div className="w-full h-full relative flex items-center justify-center">
                        {(!isMe || !isVideoOff) ? (
                            <>
                                <img 
                                    src={`https://images.unsplash.com/photo-${p.id === 'u1' ? '1472099645785-5658abf4ff4e' : p.id === 'u2' ? '1531427186611-ecfd6d936c79' : p.id === 'u3' ? '1507003211169-0a1dd7228f2d' : '1500648767791-00dcc994a43e'}?auto=format&fit=crop&q=80&w=800`} 
                                    className={`w-full h-full object-cover transition-all duration-700 ${isActiveSpeaker && !isSharingScreen ? 'brightness-110 scale-105' : 'brightness-75 grayscale-[0.2]'}`} 
                                    alt={p.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40"></div>
                            </>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-[#2a2a2a] flex items-center justify-center border border-white/10 shadow-2xl animate-in zoom-in duration-300">
                                <img src={p.avatarUrl} className="w-full h-full rounded-full p-1 opacity-80" alt={p.name} />
                            </div>
                        )}
                    </div>

                    {/* Name Tag Pill */}
                    <div className="absolute bottom-5 left-5 z-20 flex items-center space-x-2">
                       <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center shadow-lg transition-transform group-hover:scale-105">
                          {isMe && isMuted && <MicOff className="w-3.5 h-3.5 text-red-400 mr-2" />}
                          {!isMe && isActiveSpeaker && (
                              <div className="flex space-x-0.5 items-end h-3 mr-2">
                                <div className="w-0.5 h-1.5 bg-teal-400 animate-[bounce_0.8s_infinite]"></div>
                                <div className="w-0.5 h-2.5 bg-teal-400 animate-[bounce_0.9s_infinite]"></div>
                                <div className="w-0.5 h-2 bg-teal-400 animate-[bounce_0.6s_infinite]"></div>
                              </div>
                          )}
                          <span className="text-xs font-bold text-white tracking-wide">{p.name} {isMe && '(You)'}</span>
                       </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
                        {hasHandRaised && (
                            <div className="bg-amber-500 text-white p-2.5 rounded-full shadow-lg animate-bounce">
                                <Hand className="w-5 h-5 fill-current" />
                            </div>
                        )}
                    </div>
                 </div>
               )
             })}
           </div>
        </div>

        {/* Side Panel */}
        {showSidePanel && (
            <div className="w-[380px] bg-[#121212]/95 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] flex flex-col shadow-2xl animate-in slide-in-from-right duration-500 overflow-hidden ml-4">
               {/* Panel Header */}
               <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-1 bg-[#1a1a1a] p-1 rounded-xl">
                    <button 
                        onClick={() => setSidePanelTab('participants')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${sidePanelTab === 'participants' ? 'bg-[#2a2a2a] text-white shadow-md' : 'text-white/40 hover:text-white'}`}
                    >
                        People
                    </button>
                    <button 
                        onClick={() => setSidePanelTab('chat')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${sidePanelTab === 'chat' ? 'bg-[#2a2a2a] text-white shadow-md' : 'text-white/40 hover:text-white'}`}
                    >
                        Chat
                    </button>
                  </div>
                  <button onClick={() => setShowSidePanel(false)} className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors">
                      <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Panel Content */}
               <div className="flex-1 overflow-y-auto no-scrollbar">
                  {sidePanelTab === 'participants' ? (
                      <div className="p-3 space-y-1">
                          {participants.map(p => (
                              <div key={p.id} className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors group">
                                  <div className="flex items-center space-x-3">
                                      <div className="relative">
                                        <img src={p.avatarUrl} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                                        {p.id === activeSpeakerId && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-500 border-2 border-[#121212] rounded-full"></div>}
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-white/90">{p.name} {p.id === currentUser.id && '(You)'}</p>
                                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{p.role || 'Member'}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                      {p.id === currentUser.id && isHandRaised && <Hand className="w-4 h-4 text-amber-500" />}
                                      <button className="p-2 text-white/20 hover:text-white/80 transition-colors"><Mic className="w-4 h-4" /></button>
                                      <button className="p-2 text-white/20 hover:text-white/80 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="flex flex-col h-full">
                          <div className="flex-1 p-5 space-y-4">
                              <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-2xl">
                                  <p className="text-xs text-teal-200/80 leading-relaxed text-center font-medium">Messages are encrypted and only visible to participants in this room.</p>
                              </div>
                              {meetingMessages.map(msg => (
                                  <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2">
                                      <div className="flex items-baseline space-x-2 mb-1">
                                          <span className="text-xs font-bold text-white/90">{msg.sender}</span>
                                          <span className="text-[10px] text-white/30">{msg.timestamp}</span>
                                      </div>
                                      <div className="bg-[#2a2a2a] p-3 rounded-2xl rounded-tl-sm text-sm text-white/80 leading-relaxed shadow-sm">
                                          {msg.content}
                                      </div>
                                  </div>
                              ))}
                              <div ref={chatEndRef} />
                          </div>
                          <div className="p-4 border-t border-white/5 bg-[#161616]">
                              <div className="relative">
                                  <input 
                                      type="text" 
                                      className="w-full bg-[#252525] border-none rounded-2xl pl-4 pr-12 py-3.5 text-sm text-white placeholder-white/20 focus:ring-2 focus:ring-teal-500/50 outline-none transition-all"
                                      placeholder="Type a message..."
                                      value={chatMessage}
                                      onChange={(e) => setChatMessage(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                  />
                                  <button 
                                    onClick={handleSendChat}
                                    disabled={!chatMessage.trim()}
                                    className="absolute right-2 top-2 p-1.5 bg-teal-500 text-white rounded-xl hover:bg-teal-400 transition-colors disabled:opacity-50 disabled:bg-transparent disabled:text-white/20"
                                  >
                                      <Send className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}
               </div>
            </div>
        )}

      </div>

      {/* Floating Control Dock (Bottom) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 animate-in slide-in-from-bottom-10 duration-700 delay-100">
         
         {/* Main Dock */}
         <div className="flex items-center gap-1 p-2 bg-[#1a1a1a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]">
            <ControlButton 
               onClick={() => setIsMuted(!isMuted)} 
               active={!isMuted} 
               label="Mic"
               iconOn={<Mic className="w-5 h-5" />} 
               iconOff={<MicOff className="w-5 h-5" />}
               danger={isMuted}
            />
            <ControlButton 
               onClick={() => setIsVideoOff(!isVideoOff)} 
               active={!isVideoOff} 
               label="Cam"
               iconOn={<Video className="w-5 h-5" />} 
               iconOff={<VideoOff className="w-5 h-5" />}
               danger={isVideoOff}
            />
            
            <div className="w-px h-8 bg-white/10 mx-2"></div>

            <ControlButton 
               onClick={() => setIsSharingScreen(!isSharingScreen)} 
               active={isSharingScreen} 
               label={isSharingScreen ? "Stop Share" : "Share"}
               iconOn={<Monitor className="w-5 h-5" />} 
               activeClass="bg-teal-500 text-white shadow-lg shadow-teal-500/20"
            />
            <ControlButton 
               onClick={toggleHand} 
               active={isHandRaised} 
               label="Hand"
               iconOn={<Hand className="w-5 h-5" />} 
               activeClass="bg-amber-500 text-white shadow-lg shadow-amber-500/20"
            />
            <ControlButton 
                onClick={() => { setShowSidePanel(!showSidePanel); setSidePanelTab('chat'); }}
                active={showSidePanel && sidePanelTab === 'chat'}
                label="Chat"
                iconOn={<MessageSquare className="w-5 h-5" />}
                activeClass="bg-white text-black"
            />
            <ControlButton 
                onClick={() => {}}
                label="React"
                iconOn={<Smile className="w-5 h-5" />}
            />
         </div>

         {/* Leave Button */}
         <button 
            onClick={onLeave}
            className="h-[60px] px-8 rounded-[2rem] bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
         >
            <PhoneOff className="w-5 h-5 group-hover:animate-pulse" />
            <span className="tracking-wide">Leave</span>
         </button>
      </div>

    </div>
  );
};

// Helper Component for Dock Buttons
const ControlButton = ({ 
    onClick, 
    active = true, 
    iconOn, 
    iconOff, 
    danger = false, 
    activeClass = "bg-white/10 text-white hover:bg-white/20",
    label
}: any) => {
    return (
        <div className="relative group/btn">
            <button 
                onClick={onClick}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    danger 
                    ? "bg-red-500/10 text-red-500 border border-red-500/50" 
                    : active 
                        ? activeClass
                        : "bg-transparent text-white/40 hover:bg-white/5"
                }`}
            >
                {active ? iconOn : (iconOff || iconOn)}
            </button>
            {label && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                    {label}
                </div>
            )}
        </div>
    );
};
