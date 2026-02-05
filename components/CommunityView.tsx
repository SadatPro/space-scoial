
import React, { useState } from 'react';
import { Community, User, Post, Channel, CommunityMeeting } from '../types';
import { PostCard } from './PostCard';
import { ChannelChat } from './ChannelChat';
import { MeetingRoom } from './MeetingRoom';
import { 
  Users, 
  MessageSquare, 
  LayoutGrid, 
  Info, 
  Plus, 
  Search,
  ArrowLeft,
  Bell,
  Share2,
  Hash,
  Volume2,
  ChevronRight,
  Video,
  Play,
  Clock,
  Calendar,
  ShieldCheck
} from 'lucide-react';

interface CommunityViewProps {
  community: Community;
  currentUser: User;
  onSendMessage: (channelId: string, content: string) => void;
  onBack: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ community, currentUser, onSendMessage, onBack }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'chat' | 'meetings' | 'about'>('posts');
  const [activeChannelId, setActiveChannelId] = useState<string>(community.channels[0]?.id || '');
  const [activeMeeting, setActiveMeeting] = useState<CommunityMeeting | null>(null);

  const activeChannel = community.channels.find(c => c.id === activeChannelId);

  if (activeMeeting) {
    return (
      <MeetingRoom 
        meetingTitle={activeMeeting.title} 
        currentUser={currentUser} 
        onLeave={() => setActiveMeeting(null)} 
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F0F4F8]">
      {/* Community Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="h-40 w-full relative">
          <img 
            src={community.bannerUrl || `https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1000`} 
            className="w-full h-full object-cover" 
            alt="banner" 
          />
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 -mt-8 relative pb-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-end space-x-6">
              <div className="w-20 h-20 rounded-2xl bg-teal-600 border-4 border-white shadow-xl flex items-center justify-center text-white font-bold text-3xl">
                {community.name.charAt(0)}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{community.name}</h1>
                <p className="text-slate-500 font-medium text-xs">
                  v/{community.name.toLowerCase().replace(/\s+/g, '')} • {community.members.toLocaleString()} members
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pb-1">
              <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-teal-600 transition-all">
                {community.isJoined ? 'Joined' : 'Join Community'}
              </button>
              <button className="p-2 bg-gray-100 text-slate-600 rounded-full hover:bg-gray-200 transition-all">
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex space-x-8 mt-4 border-t border-gray-100 pt-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'posts', label: 'Feed', icon: <LayoutGrid className="w-4 h-4" /> },
              { id: 'chat', label: 'Chat Rooms', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'meetings', label: 'Meetings', icon: <Video className="w-4 h-4" /> },
              { id: 'about', label: 'Information', icon: <Info className="w-4 h-4" /> },
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
                {community.channels.map(ch => (
                  <button 
                    key={ch.id}
                    onClick={() => setActiveChannelId(ch.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                      activeChannelId === ch.id ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {ch.type === 'voice' ? <Volume2 className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                    <span className="font-bold text-sm truncate">{ch.name}</span>
                  </button>
                ))}
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-400 border border-dashed border-gray-200 mt-4 hover:border-teal-500 hover:text-teal-500 transition-all">
                  <Plus className="w-4 h-4" />
                  <span className="font-bold text-sm">Create Sub-division</span>
                </button>
             </div>
          </aside>
        )}

        <main className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/30">
          {activeTab === 'posts' && (
            <div className="max-w-2xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-4 rounded-3xl border border-white shadow-sm flex items-center space-x-4">
                <img src={currentUser.avatarUrl} className="w-10 h-10 rounded-full" alt="" />
                <input 
                  type="text" 
                  placeholder="Create a post in this community..." 
                  className="flex-1 bg-slate-50 border-none rounded-xl py-2 px-4 outline-none text-sm font-medium"
                />
                <button className="p-2 bg-slate-900 text-white rounded-xl"><Plus className="w-5 h-5" /></button>
              </div>
              {community.posts.length > 0 ? (
                community.posts.map(post => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="text-center py-20 text-slate-400">No posts in this community yet.</div>
              )}
            </div>
          )}

          {activeTab === 'chat' && activeChannel && (
            <div className="h-full">
              <ChannelChat 
                channel={activeChannel} 
                currentUser={currentUser} 
                onSendMessage={onSendMessage} 
                onBack={() => setActiveTab('posts')} 
                onEditChannel={(id) => console.log("Edit channel not implemented", id)}
                onDeleteChannel={(id) => console.log("Delete channel not implemented", id)}
              />
            </div>
          )}

          {activeTab === 'meetings' && (
            <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Community Meetings</h2>
                   <p className="text-slate-500 font-medium">Join real-time video sessions or schedule new ones.</p>
                </div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-teal-600 transition-all flex items-center space-x-2">
                   <Video className="w-5 h-5" />
                   <span>Start Meeting</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {community.meetings.map(mt => (
                  <div key={mt.id} className="bg-white rounded-[2.5rem] p-8 border border-white shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${mt.isActive ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                           {mt.isActive ? 'Active Now' : 'Scheduled'}
                        </div>
                        {mt.isActive && <div className="flex items-center space-x-1.5">
                           <Users className="w-4 h-4 text-slate-400" />
                           <span className="text-xs font-bold text-slate-500">{mt.attendeeCount} in room</span>
                        </div>}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">{mt.title}</h3>
                      <div className="flex items-center text-sm text-slate-400 font-medium mb-8">
                         <Clock className="w-4 h-4 mr-2" />
                         {mt.startTime}
                      </div>
                    </div>
                    
                    {mt.isActive ? (
                      <button 
                        onClick={() => setActiveMeeting(mt)}
                        className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-teal-500/20 hover:bg-teal-700 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                      >
                         <Play className="w-5 h-5 fill-current" />
                         <span>Join Meeting</span>
                      </button>
                    ) : (
                      <button className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black border border-slate-100 cursor-not-allowed flex items-center justify-center space-x-2">
                         <Calendar className="w-5 h-5" />
                         <span>Reminder Set</span>
                      </button>
                    )}
                  </div>
                ))}
                {community.meetings.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white/50 rounded-[3rem] border border-dashed border-slate-300">
                    <Video className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold text-lg">No meetings planned.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in duration-500">
              <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-sm">
                <h3 className="text-xl font-bold mb-4">About {community.name}</h3>
                <p className="text-slate-600 leading-relaxed mb-8">{community.description}</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="text-2xl font-black text-slate-900">{community.members.toLocaleString()}</div>
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
    </div>
  );
};
