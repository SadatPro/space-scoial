
import React, { useState, useRef, useEffect } from 'react';
import { Space, User, Post, Channel, SpacePlannerItem, FactCheckResult, Message } from '../types';
import { PostCard } from './PostCard';
import { ChannelChat } from './ChannelChat';
import { MeetingRoom } from './MeetingRoom';
import { InlineCreatePost } from './InlineCreatePost';
import { MOCK_USERS } from '../services/mockData';
import { 
  Users, 
  MessageSquare, 
  LayoutGrid, 
  Info, 
  Plus, 
  ArrowLeft,
  Bell,
  Hash,
  Volume2,
  Video,
  Play,
  Clock,
  Calendar,
  Zap,
  X,
  Lock,
  Check,
  Globe,
  Monitor,
  Camera,
  Edit2,
  Menu
} from 'lucide-react';

interface SpaceViewProps {
  space: Space;
  currentUser: User;
  onSendMessage: (channelId: string, content: string) => void;
  onBack: () => void;
  onFactCheck?: (postId: string, result: FactCheckResult) => void;
  onUpdateSpace?: (space: Space) => void;
}

export const SpaceView: React.FC<SpaceViewProps> = ({ space, currentUser, onSendMessage, onBack, onFactCheck, onUpdateSpace }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'chat' | 'planner' | 'about'>('posts');
  const [channels, setChannels] = useState<Channel[]>(space.channels);
  const [activeChannelId, setActiveChannelId] = useState<string>(space.channels[0]?.id || '');
  const [activeMeeting, setActiveMeeting] = useState<SpacePlannerItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Local Posts State
  const [posts, setPosts] = useState<Post[]>(space.posts);
  
  // Channel Modal State (Create & Edit)
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice' | 'video'>('text');
  const [isPrivateChannel, setIsPrivateChannel] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // Space Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Space>(space);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const activeChannel = channels.find(c => c.id === activeChannelId);

  useEffect(() => {
    setEditForm(space);
  }, [space]);

  const handleSaveSpace = () => {
    const updatedSpace = {
        ...editForm,
        channels: channels, // Use current local state to preserve message updates
        posts: posts // Use current local state
    };
    if (onUpdateSpace) {
        onUpdateSpace(updatedSpace);
    }
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'bannerUrl' | 'iconUrl') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle member for private channel
  const toggleMemberSelection = (userId: string) => {
    setSelectedMemberIds(prev => 
        prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const openCreateModal = () => {
      setNewChannelName('');
      setNewChannelType('text');
      setIsPrivateChannel(false);
      setSelectedMemberIds([]);
      setEditingChannelId(null);
      setIsChannelModalOpen(true);
  };

  const openEditModal = (channelId: string) => {
      const channel = channels.find(c => c.id === channelId);
      if (!channel) return;
      
      setNewChannelName(channel.name);
      setNewChannelType(channel.type as any);
      setIsPrivateChannel(!!channel.isPrivate);
      // If allowedUserIds is undefined, it's public or legacy, default to empty selection
      const members = channel.allowedUserIds ? channel.allowedUserIds.filter(id => id !== currentUser.id) : [];
      setSelectedMemberIds(members);
      
      setEditingChannelId(channelId);
      setIsChannelModalOpen(true);
  };

  const handleSaveChannel = () => {
    if (!newChannelName.trim()) return;
    
    if (editingChannelId) {
        // Edit Mode
        setChannels(prev => prev.map(ch => {
            if (ch.id === editingChannelId) {
                return {
                    ...ch,
                    name: newChannelName.toLowerCase().replace(/\s+/g, '-'),
                    type: newChannelType,
                    isPrivate: isPrivateChannel,
                    allowedUserIds: isPrivateChannel ? [...selectedMemberIds, currentUser.id] : undefined,
                    members: isPrivateChannel ? selectedMemberIds.length + 1 : space.members // Approximation
                };
            }
            return ch;
        }));
    } else {
        // Create Mode
        const newChannel: Channel = {
            id: `ch-${Date.now()}`,
            name: newChannelName.toLowerCase().replace(/\s+/g, '-'),
            type: newChannelType,
            messages: [],
            members: isPrivateChannel ? selectedMemberIds.length + 1 : space.members,
            isPrivate: isPrivateChannel,
            allowedUserIds: isPrivateChannel ? [...selectedMemberIds, currentUser.id] : undefined
        };
        setChannels([...channels, newChannel]);
        setActiveChannelId(newChannel.id);
        setActiveTab('chat');
    }

    setIsChannelModalOpen(false);
  };

  const handleDeleteChannel = (channelId: string) => {
      if (window.confirm("Are you sure you want to delete this channel?")) {
          setChannels(prev => prev.filter(c => c.id !== channelId));
          if (activeChannelId === channelId) {
              // Switch to another channel or empty if none left
              const remaining = channels.filter(c => c.id !== channelId);
              if (remaining.length > 0) {
                  setActiveChannelId(remaining[0].id);
              } else {
                  setActiveChannelId('');
              }
          }
      }
  };

  const handleLocalSendMessage = (channelId: string, content: string) => {
    // 1. Create the new message object
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: content,
      timestamp: 'Just now',
      type: 'text'
    };

    // 2. Update local state immediately for responsiveness
    setChannels(prevChannels => prevChannels.map(ch => {
      if (ch.id === channelId) {
        return {
          ...ch,
          messages: [...ch.messages, newMessage]
        };
      }
      return ch;
    }));

    // 3. Propagate up if needed (e.g. for global state or persistence)
    onSendMessage(channelId, content);
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleJoinVideoChannel = (channel: Channel) => {
      const meeting: SpacePlannerItem = {
          id: channel.id,
          title: channel.name,
          startTime: 'Now',
          hostId: currentUser.id,
          attendeeCount: 1,
          isActive: true
      };
      setActiveMeeting(meeting);
  };

  const handleMobileChannelSelect = (channelId: string) => {
    setActiveChannelId(channelId);
    setActiveTab('chat');
    setIsMobileMenuOpen(false);
  };

  if (activeMeeting) {
    return (
      <MeetingRoom 
        meetingTitle={activeMeeting.title} 
        currentUser={currentUser} 
        onLeave={() => setActiveMeeting(null)} 
      />
    );
  }

  // Filter available users for selection (exclude current user)
  const availableUsers = MOCK_USERS.filter(u => u.id !== currentUser.id);

  return (
    <div className="flex flex-col h-full bg-[#F0F4F8] relative">
      {/* Space Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 transition-all pt-safe">
        <div className="h-40 w-full relative group">
          <img 
            src={isEditing ? editForm.bannerUrl : space.bannerUrl || `https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1000`} 
            className="w-full h-full object-cover" 
            alt="banner" 
          />
          {isEditing && (
            <div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => bannerInputRef.current?.click()}
            >
                <div className="bg-black/50 p-3 rounded-full text-white backdrop-blur-md">
                    <Camera className="w-8 h-8" />
                </div>
                <input 
                    type="file" 
                    ref={bannerInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, 'bannerUrl')} 
                />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-all z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-all z-10 md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 -mt-8 relative pb-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-end space-x-6">
              <div className="w-20 h-20 rounded-2xl bg-teal-600 border-4 border-white shadow-xl flex items-center justify-center text-white font-bold text-3xl overflow-hidden relative group">
                {isEditing ? (
                    <>
                        {editForm.iconUrl ? <img src={editForm.iconUrl} className="w-full h-full object-cover" alt="" /> : editForm.name.charAt(0)}
                        <div 
                            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => iconInputRef.current?.click()}
                        >
                            <Camera className="w-6 h-6" />
                            <input 
                                type="file" 
                                ref={iconInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e, 'iconUrl')} 
                            />
                        </div>
                    </>
                ) : (
                    space.iconUrl ? <img src={space.iconUrl} className="w-full h-full object-cover" alt="" /> : space.name.charAt(0)
                )}
              </div>
              <div className="pb-1">
                {isEditing ? (
                    <input 
                        type="text" 
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="text-2xl font-black text-slate-900 tracking-tight bg-slate-50 border-b border-teal-500 outline-none w-full max-w-xs"
                    />
                ) : (
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{space.name}</h1>
                )}
                <p className="text-slate-500 font-medium text-xs">
                  sub/{space.name.toLowerCase().replace(/\s+/g, '')} • {space.members.toLocaleString()} members
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pb-1">
              {!isEditing && (
                  <>
                    <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-teal-600 transition-all">
                        {space.isJoined ? 'Joined' : 'Join Sub Space'}
                    </button>
                    <button onClick={() => setIsEditing(true)} className="p-2 bg-gray-100 text-slate-600 rounded-full hover:bg-gray-200 transition-all" title="Edit Space">
                        <Edit2 className="w-4 h-4" />
                    </button>
                  </>
              )}
              {isEditing && (
                  <div className="flex space-x-2">
                      <button onClick={() => { setEditForm(space); setIsEditing(false); }} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-full">Cancel</button>
                      <button onClick={handleSaveSpace} className="px-4 py-2 text-sm font-bold bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Save
                      </button>
                  </div>
              )}
            </div>
          </div>

          {isEditing && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <textarea 
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 focus:border-teal-500 outline-none resize-none"
                      placeholder="Space Description"
                      rows={2}
                  />
              </div>
          )}

          <div className="flex space-x-8 mt-4 border-t border-gray-100 pt-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'posts', label: 'Feed', icon: <LayoutGrid className="w-4 h-4" /> },
              { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'planner', label: 'Planner', icon: <Calendar className="w-4 h-4" /> },
              { id: 'about', label: 'Info', icon: <Info className="w-4 h-4" /> },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-1 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'border-teal-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'chat' && (
          <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shrink-0 animate-in slide-in-from-left duration-300">
             <div className="p-4 border-b border-gray-100 bg-slate-50/50">
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Channels</h3>
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {channels.map(ch => (
                  <button 
                    key={ch.id}
                    onClick={() => setActiveChannelId(ch.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all group ${
                      activeChannelId === ch.id ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                        {ch.type === 'voice' ? <Volume2 className="w-4 h-4 flex-shrink-0" /> : ch.type === 'video' ? <Video className="w-4 h-4 flex-shrink-0" /> : <Hash className="w-4 h-4 flex-shrink-0" />}
                        <span className="font-bold text-sm truncate">{ch.name}</span>
                    </div>
                    {ch.isPrivate && <Lock className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />}
                  </button>
                ))}
                <button 
                  onClick={openCreateModal}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-400 border border-dashed border-gray-200 mt-4 hover:border-teal-500 hover:text-teal-500 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-bold text-sm">New Channel</span>
                </button>
             </div>
          </aside>
        )}

        <main className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/30">
          {activeTab === 'posts' && (
            <div className="max-w-2xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-3xl border border-white shadow-sm overflow-hidden">
                <InlineCreatePost currentUser={currentUser} onPostCreated={handlePostCreated} />
              </div>
              <div className="space-y-4">
                {posts.length > 0 ? (
                    posts.map(post => <PostCard key={post.id} post={post} onFactCheck={onFactCheck} />)
                ) : (
                    <div className="text-center py-20 text-slate-400">No posts in this sub space yet.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'chat' && activeChannel && (
            <div className="h-full">
              {activeChannel.type === 'video' ? (
                  <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-900 to-slate-900 pointer-events-none"></div>
                      <div className="relative z-10 text-center animate-in zoom-in duration-300">
                          <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-teal-500/20 shadow-2xl shadow-teal-500/10">
                              <Video className="w-10 h-10 text-teal-400" />
                          </div>
                          <h2 className="text-3xl font-black mb-2">{activeChannel.name}</h2>
                          <p className="text-slate-400 mb-8 max-w-sm mx-auto">Video Channel • Screen Sharing Enabled • Encrypted</p>
                          
                          <div className="flex items-center justify-center gap-4">
                              <button 
                                  onClick={() => handleJoinVideoChannel(activeChannel)}
                                  className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                              >
                                  <Video className="w-5 h-5 fill-current" />
                                  <span>Join Room</span>
                              </button>
                              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2 text-xs font-bold text-slate-300">
                                  <Monitor className="w-4 h-4 text-teal-400" />
                                  <span>Screen Share Ready</span>
                              </div>
                          </div>
                      </div>
                  </div>
              ) : (
                  <ChannelChat 
                    channel={activeChannel} 
                    currentUser={currentUser} 
                    onSendMessage={handleLocalSendMessage} 
                    onBack={() => setActiveTab('posts')} 
                    onEditChannel={openEditModal}
                    onDeleteChannel={handleDeleteChannel}
                    onToggleChannels={() => setIsMobileMenuOpen(true)}
                  />
              )}
            </div>
          )}

          {activeTab === 'planner' && (
            <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sub Space Planner</h2>
                   <p className="text-slate-500 font-medium">Coordinate sessions and track community growth.</p>
                </div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-teal-600 transition-all flex items-center space-x-2">
                   <Plus className="w-5 h-5" />
                   <span>Add Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {space.planner.map(item => (
                  <div key={item.id} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.isActive ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                           {item.isActive ? 'Live Session' : 'Upcoming'}
                        </div>
                        {item.isActive && <div className="flex items-center space-x-1.5">
                           <Users className="w-4 h-4 text-slate-400" />
                           <span className="text-xs font-bold text-slate-500">{item.attendeeCount} present</span>
                        </div>}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                      <div className="flex items-center text-sm text-slate-400 font-medium mb-8">
                         <Clock className="w-4 h-4 mr-2" />
                         {item.startTime}
                      </div>
                    </div>
                    
                    {item.isActive ? (
                      <button 
                        onClick={() => setActiveMeeting(item)}
                        className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-teal-500/20 hover:bg-teal-700 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                      >
                         <Play className="w-5 h-5 fill-current" />
                         <span>Join Now</span>
                      </button>
                    ) : (
                      <button className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black border border-slate-100 flex items-center justify-center space-x-2">
                         <Calendar className="w-5 h-5" />
                         <span>Notify Me</span>
                      </button>
                    )}
                  </div>
                ))}
                {space.planner.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white/50 rounded-[3rem] border border-dashed border-slate-300">
                    <Zap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold text-lg">Your planner is clear.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in duration-500">
              <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-sm">
                <h3 className="text-xl font-bold mb-4">About {space.name}</h3>
                <p className="text-slate-600 leading-relaxed mb-8">{space.description}</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="text-2xl font-black text-slate-900">{space.members.toLocaleString()}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Members</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="text-2xl font-black text-teal-600">Top 1%</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Activity Rank</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Channel Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative w-72 bg-white dark:bg-slate-900 h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col pt-safe">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Channels</h3>
                    <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-white dark:bg-slate-900">
                    {channels.map(ch => (
                      <button 
                        key={ch.id}
                        onClick={() => handleMobileChannelSelect(ch.id)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group ${
                          activeChannelId === ch.id ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                            {ch.type === 'voice' ? <Volume2 className="w-4 h-4 flex-shrink-0" /> : ch.type === 'video' ? <Video className="w-4 h-4 flex-shrink-0" /> : <Hash className="w-4 h-4 flex-shrink-0" />}
                            <span className="font-bold text-sm truncate">{ch.name}</span>
                        </div>
                        {ch.isPrivate && <Lock className="w-3 h-3 text-slate-400" />}
                      </button>
                    ))}
                    <button 
                      onClick={() => { openCreateModal(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-slate-400 border border-dashed border-gray-200 dark:border-slate-800 mt-4 hover:border-teal-500 hover:text-teal-500 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-bold text-sm">New Channel</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Channel Modal (Create or Edit) */}
      {isChannelModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-xl font-black text-slate-900">{editingChannelId ? 'Edit Channel' : 'Create Channel'}</h3>
              <button onClick={() => setIsChannelModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            <div className="space-y-6 overflow-y-auto no-scrollbar px-1 pb-4">
              <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Channel Name</label>
                  <div className="flex items-center bg-slate-50 rounded-xl px-4 border border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                      <span className="text-slate-400 font-bold mr-1">#</span>
                      <input 
                          type="text" 
                          value={newChannelName}
                          onChange={(e) => setNewChannelName(e.target.value)}
                          className="bg-transparent border-none w-full py-3 font-bold text-slate-800 outline-none placeholder-slate-300"
                          placeholder="new-channel"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveChannel()}
                      />
                  </div>
              </div>

              <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Channel Type</label>
                  <div className="grid grid-cols-3 gap-2">
                      <button 
                          onClick={() => setNewChannelType('text')}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 font-bold transition-all ${newChannelType === 'text' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                          <Hash className="w-5 h-5 mb-1" />
                          <span className="text-xs">Text</span>
                      </button>
                      <button 
                          onClick={() => setNewChannelType('voice')}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 font-bold transition-all ${newChannelType === 'voice' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                          <Volume2 className="w-5 h-5 mb-1" />
                          <span className="text-xs">Voice</span>
                      </button>
                      <button 
                          onClick={() => setNewChannelType('video')}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 font-bold transition-all ${newChannelType === 'video' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                          <Video className="w-5 h-5 mb-1" />
                          <span className="text-xs">Video</span>
                      </button>
                  </div>
              </div>

              <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Visibility</label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                      <button 
                          onClick={() => setIsPrivateChannel(false)}
                          className={`flex items-center justify-center space-x-2 py-3 rounded-xl border-2 font-bold transition-all ${!isPrivateChannel ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                          <Globe className="w-4 h-4" />
                          <span>Public</span>
                      </button>
                      <button 
                          onClick={() => setIsPrivateChannel(true)}
                          className={`flex items-center justify-center space-x-2 py-3 rounded-xl border-2 font-bold transition-all ${isPrivateChannel ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                          <Lock className="w-4 h-4" />
                          <span>Private</span>
                      </button>
                  </div>

                  {isPrivateChannel && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                              Select Members ({selectedMemberIds.length})
                          </label>
                          <div className="max-h-40 overflow-y-auto bg-slate-50 rounded-xl border border-slate-100 p-2 space-y-1">
                              {availableUsers.map(user => {
                                  const isSelected = selectedMemberIds.includes(user.id);
                                  return (
                                      <div 
                                          key={user.id} 
                                          onClick={() => toggleMemberSelection(user.id)}
                                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-white shadow-sm border border-teal-100' : 'hover:bg-slate-100'}`}
                                      >
                                          <div className="flex items-center space-x-3">
                                              <img src={user.avatarUrl} className="w-8 h-8 rounded-full" alt="" />
                                              <span className={`text-sm font-bold ${isSelected ? 'text-teal-700' : 'text-slate-600'}`}>{user.name}</span>
                                          </div>
                                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-teal-500 border-teal-500' : 'border-slate-300 bg-white'}`}>
                                              {isSelected && <Check className="w-3 h-3 text-white" />}
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  )}
              </div>

              <button 
                  onClick={handleSaveChannel}
                  disabled={!newChannelName.trim()}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-black shadow-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                  {editingChannelId ? 'Save Changes' : 'Create Channel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
