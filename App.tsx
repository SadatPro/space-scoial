
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  MessageSquare, 
  User as UserIcon, 
  Compass, 
  Plus, 
  Menu,
  RotateCw,
  ShoppingBag,
  Bell,
  Search,
  StickyNote,
  Calendar as CalendarIcon,
  Bookmark,
  PlayCircle,
  Zap,
  Book as BookIcon,
  Image as ImageIcon,
  Sparkles,
  BookmarkPlus,
  Settings as SettingsIcon,
  Tv,
  Users,
  LayoutGrid,
  ChevronRight,
  Cpu,
  Newspaper,
  Gamepad2,
  Trophy,
  FlaskConical,
  Palette,
  X,
  Video,
  Share2,
  Library
} from 'lucide-react';
import { ViewState, Post, DirectMessageThread, Product, Note, CalendarEvent, FactCheckResult, Notification, CartItem, ExploreTopic, VideoTopic, HomeFeedConfig, FeedSynthesisResult, User, LiveSession, ExploreItem, MessengerNote, Space, PrivacyConfig } from './types';
import { MOCK_SPACES, CURRENT_USER, MOCK_SOURCE_CATEGORIES, FALLBACK_POSTS, MOCK_DMS, MOCK_NOTES, MOCK_EVENTS, MOCK_NOTIFICATIONS, MOCK_MESSENGER_NOTES, MOCK_LIVE_SESSIONS } from './services/mockData';
import { fetchRealTimeFeed, synthesizeFeed } from './services/geminiService';
import { authService } from './services/authService';
import { AuthView } from './components/AuthView';
import { PostCard } from './components/PostCard';
import { SettingsView } from './components/SettingsView';
import { ProfileView } from './components/ProfileView';
import { ShopView } from './components/ShopView';
import { NotepadView } from './components/NotepadView';
import { CalendarView } from './components/CalendarView';
import { MessengerView } from './components/MessengerView';
import { SpaceView } from './components/SpaceView';
import { InlineCreatePost } from './components/InlineCreatePost';
import { StickyBoard } from './components/StickyBoard';
import { NotificationsView } from './components/NotificationsView';
import { DiscoverView } from './components/DiscoverView';
import { VideoSection } from './components/VideoSection';
import { LibraryView } from './components/LibraryView';
import { SpacesListView } from './components/SpacesListView';
import { FeedSynthesis } from './components/FeedSynthesis';
import { LiveSessions } from './components/LiveSessions';
import { StoryViewer } from './components/StoryViewer';
import { CollectionView } from './components/CollectionView';
import { MeetingRoom } from './components/MeetingRoom';
import { SkeletonPost } from './components/Loading';
import { ShareView } from './components/ShareView';

const translations = {
  en: {
    home: 'Home',
    explore: 'Explore',
    videos: 'Space Play',
    shop: 'Shop',
    notepad: 'Notes',
    planner: 'Planner',
    messages: 'Message',
    profile: 'Profile',
    settings: 'Settings',
    spaces: 'Spaces',
    notifications: 'Activity',
    social: 'Channels',
    personal: 'Personal',
    spaceName: 'Space',
    library: 'Library',
    collection: 'Saves',
    share: 'Quick Share'
  },
  bn: {
    home: 'হোম',
    explore: 'অন্বেষণ',
    videos: 'স্পেস প্লে',
    shop: 'দোকান',
    notepad: 'নোট',
    planner: 'প্ল্যানার',
    messages: 'বার্তা',
    profile: 'প্রোফাইল',
    settings: 'সেটিংস',
    spaces: 'স্পেস',
    notifications: 'কার্যক্রম',
    social: 'চ্যানেল',
    personal: 'ব্যক্তিগত',
    spaceName: 'স্পেস',
    library: 'লাইব্রেরি',
    collection: 'সংগ্রহ',
    share: 'কুইক শেয়ার'
  }
};

const INITIAL_EXPLORE_TOPICS: ExploreTopic[] = [
    { id: "All", label: "All", icon: <LayoutGrid className="w-4 h-4" />, filter: "All", enabled: true, sources: [] },
    { id: "Gallery", label: "Studio", icon: <ImageIcon className="w-4 h-4" />, filter: "Gallery", enabled: true, sources: ['unsplash.com', 'pexels.com'] },
    { id: "Videos", label: "Motion", icon: <PlayCircle className="w-4 h-4" />, filter: "Videos", enabled: true, sources: ['youtube.com', 'vimeo.com'] },
    { id: "Tech", label: "Tech", icon: <Cpu className="w-4 h-4" />, filter: "Tech", enabled: true, sources: ['theverge.com', 'wired.com'] },
    { id: "News", label: "News", icon: <Newspaper className="w-4 h-4" />, filter: "News", enabled: true, sources: ['reuters.com', 'apnews.com'] },
    { id: "Games", label: "Gaming", icon: <Gamepad2 className="w-4 h-4" />, filter: "Games", enabled: true, sources: ['ign.com', 'kotaku.com'] },
    { id: "Sports", label: "Sports", icon: <Trophy className="w-4 h-4" />, filter: "Sports", enabled: true, sources: ['espn.com', 'bleacherreport.com'] },
    { id: "Science", label: "Science", icon: <FlaskConical className="w-4 h-4" />, filter: "Science", enabled: true, sources: ['nasa.gov', 'scientificamerican.com'] },
    { id: "Arts", label: "Arts", icon: <Palette className="w-4 h-4" />, filter: "Arts", enabled: true, sources: ['deviantart.com', 'behance.net'] },
];

const INITIAL_VIDEO_TOPICS: VideoTopic[] = [
    { id: 'Anime', label: 'Anime', icon: 'Tv', enabled: true },
    { id: 'Gaming', label: 'Gaming', icon: 'Gamepad2', enabled: true },
    { id: 'Tech', label: 'Tech', icon: 'Cpu', enabled: true },
    { id: 'Music', label: 'Music', icon: 'Music', enabled: true },
];

export default function App() {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.FEED);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>(MOCK_SPACES);
  const [dmThreads, setDmThreads] = useState<DirectMessageThread[]>(MOCK_DMS);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [activeLiveSession, setActiveLiveSession] = useState<{ title: string; host: User } | null>(null);
  const [viewingStory, setViewingStory] = useState<LiveSession | null>(null);
  const [savedCollection, setSavedCollection] = useState<(Post | ExploreItem)[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Settings States
  const [exploreTopics, setExploreTopics] = useState<ExploreTopic[]>(INITIAL_EXPLORE_TOPICS);
  const [videoTopics, setVideoTopics] = useState<VideoTopic[]>(INITIAL_VIDEO_TOPICS);
  const [homeFeedConfig, setHomeFeedConfig] = useState<HomeFeedConfig>({
    prioritizeFactChecked: true,
    showSubspaces: true,
    enableAiSynthesis: true,
    feedSorting: 'Recent',
    discoveryMode: true,
    contentTypes: {
        images: true,
        videos: true,
        text: true,
        polls: true
    }
  });
  const [privacyConfig, setPrivacyConfig] = useState<PrivacyConfig>({
    privateProfile: false,
    showOnlineStatus: true,
    readReceipts: true,
    allowSearchIndexing: false,
    shareDataWithAI: false
  });

  const [homeSearch, setHomeSearch] = useState('');
  const [synthesis, setSynthesis] = useState<FeedSynthesisResult | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // New State for functional Notes & Stories
  const [messengerNotes, setMessengerNotes] = useState<MessengerNote[]>(MOCK_MESSENGER_NOTES);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(MOCK_LIVE_SESSIONS);

  // Live Setup Modal State
  const [isLiveSetupOpen, setIsLiveSetupOpen] = useState(false);
  const [liveSetupTitle, setLiveSetupTitle] = useState('');

  const t = translations[language];

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Auth Effect
  useEffect(() => {
    // Check session on mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const refreshFeed = async () => {
    if (!user) return;
    setIsLoadingFeed(true);
    const newPosts = await fetchRealTimeFeed();
    await new Promise(r => setTimeout(r, 1200)); 
    if (newPosts.length > 0) setPosts(newPosts);
    else if (posts.length === 0) setPosts(FALLBACK_POSTS);
    setIsLoadingFeed(false);
    setSynthesis(null);
  };

  useEffect(() => { 
    if(user) refreshFeed(); 
  }, [user]);
  
  const handleSynthesizeFeed = async () => {
    if (homeFeed.length === 0) return;
    setIsSynthesizing(true);
    try {
      const result = await synthesizeFeed(homeFeed);
      setSynthesis(result);
    } catch (e) { console.error(e); } finally { setIsSynthesizing(false); }
  };

  const handleAddMessengerNote = (content: string) => {
    if (!user) return;
    const newNote: MessengerNote = {
      id: `note-${Date.now()}`,
      user: user,
      content,
      timestamp: 'Just now'
    };
    // Remove existing note from current user to replace it
    const otherNotes = messengerNotes.filter(n => n.user.id !== user.id);
    setMessengerNotes([newNote, ...otherNotes]);
  };

  const handleCreateStory = (imageUrl: string) => {
    if (!user) return;
    const newStory: LiveSession = {
      id: `story-${Date.now()}`,
      title: 'My Story',
      host: user,
      type: 'story',
      imageUrl
    };
    setLiveSessions([newStory, ...liveSessions]);
    // Optionally auto-view the created story
    setViewingStory(newStory);
  };

  const handleStartLive = (title: string) => {
    if (!user) return;
    // 1. Create Live Session Entry
    const newLive: LiveSession = {
      id: `live-${Date.now()}`,
      title,
      host: user,
      type: 'live',
      viewers: 0
    };
    setLiveSessions([newLive, ...liveSessions]);
    
    // 2. Create Feed Post for the Live Session
    const livePost: Post = {
        id: `post-live-${Date.now()}`,
        content: `is live now: ${title}`,
        author: user,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        category: 'Live',
        liveSessionId: newLive.id,
        imageUrl: user.avatarUrl, // Placeholder until stream thumb
        commentsList: []
    };
    setPosts([livePost, ...posts]);

    // 3. Close setup and enter room
    setIsLiveSetupOpen(false);
    setLiveSetupTitle('');
    setActiveLiveSession({ title: newLive.title, host: newLive.host });
  };

  const handlePostFactCheck = (postId: string, result: FactCheckResult) => {
    setPosts(prevPosts => prevPosts.map(p => 
      p.id === postId ? { ...p, factCheck: result } : p
    ));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleEditPost = (postId: string, newContent: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: newContent } : p));
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    authService.updateCurrentUser(updatedUser);
  };

  const handleUpdateSpace = (updatedSpace: Space) => {
    setSpaces(prev => prev.map(s => s.id === updatedSpace.id ? updatedSpace : s));
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView(ViewState.FEED);
  };

  const homeFeed = useMemo(() => {
    let result = posts;
    
    // Apply Filters from Settings
    if (!homeFeedConfig.contentTypes.images) result = result.filter(p => !p.imageUrl);
    if (!homeFeedConfig.contentTypes.videos) result = result.filter(p => !p.videoUrl);
    if (!homeFeedConfig.contentTypes.polls) result = result.filter(p => !p.poll);
    // Logic for "Text": If disabled, remove posts that HAVE content but NO media.
    if (!homeFeedConfig.contentTypes.text) {
        result = result.filter(p => p.imageUrl || p.videoUrl || p.poll || p.category === 'Live');
    }

    if (homeSearch.trim()) {
      result = result.filter(p => p.content.toLowerCase().includes(homeSearch.toLowerCase()));
    }
    return result;
  }, [posts, homeSearch, homeFeedConfig.contentTypes]);

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    setActiveSpaceId(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logic to hide mobile nav in immersive views
  const showMobileNav = !activeSpaceId && !activeLiveSession && currentView !== ViewState.MESSENGER;

  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (activeLiveSession) return <MeetingRoom meetingTitle={activeLiveSession.title} currentUser={user} onLeave={() => setActiveLiveSession(null)} />;
    if (activeSpaceId) {
       const space = spaces.find(s => s.id === activeSpaceId);
       if (space) return <SpaceView space={space} currentUser={user} onSendMessage={() => {}} onBack={() => setActiveSpaceId(null)} onUpdateSpace={handleUpdateSpace} />;
    }

    switch (currentView) {
      case ViewState.EXPLORE: return <DiscoverView topics={exploreTopics} onSpaceClick={(id) => { setActiveSpaceId(id); navigateTo(ViewState.SPACES); }} />;
      case ViewState.VIDEO: return <VideoSection onSaveToCollection={() => {}} />;
      case ViewState.SPACES: return <SpacesListView spaces={spaces} onSpaceClick={(id) => setActiveSpaceId(id)} />;
      case ViewState.MESSENGER: return <MessengerView currentUser={user} threads={dmThreads} notes={messengerNotes} onAddNote={handleAddMessengerNote} onSendMessage={() => {}} onBack={() => navigateTo(ViewState.FEED)} />;
      case ViewState.PROFILE: return <ProfileView user={user} posts={posts} onUpdateProfile={handleUpdateProfile} />;
      case ViewState.COLLECTION: return <CollectionView savedItems={savedCollection} onRemoveItem={(id) => setSavedCollection(prev => prev.filter(x => x.id !== id))} onUpdateImportance={(id, imp) => setSavedCollection(prev => prev.map(i => i.id === id ? {...i, importance: imp} : i))} />;
      case ViewState.NOTEPAD: return <NotepadView notes={notes} onAddNote={(n) => setNotes([...notes, n])} onDeleteNote={(id) => setNotes(notes.filter(x => x.id !== id))} onUpdateNote={(n) => setNotes(notes.map(x => x.id === n.id ? n : x))} />;
      case ViewState.CALENDAR: return <CalendarView events={events} onAddEvent={(e) => setEvents([...events, e])} onDeleteEvent={(id) => setEvents(events.filter(x => x.id !== id))} />;
      case ViewState.LIBRARY: return <LibraryView />;
      case ViewState.SHARE: return <ShareView />;
      case ViewState.SHOP: return (
        <ShopView 
          currentUser={user} 
          userProducts={userProducts}
          onProductListed={(p) => setUserProducts([...userProducts, p])}
          cart={cart}
          onAddToCart={(p) => {
            const existing = cart.find(i => i.product.id === p.id);
            if(existing) setCart(cart.map(i => i.product.id === p.id ? {...i, quantity: i.quantity + 1} : i));
            else setCart([...cart, {product: p, quantity: 1}]);
          }}
          onRemoveFromCart={(id) => setCart(cart.filter(i => i.product.id !== id))}
          onClearCart={() => setCart([])}
        />
      );
      case ViewState.NOTIFICATIONS: return <NotificationsView notifications={notifications} onMarkAllRead={() => setNotifications(notifications.map(n => ({...n, isRead: true})))} />;
      case ViewState.SETTINGS: return (
        <SettingsView 
            currentUser={user} 
            followedVideoCreators={[]} 
            setFollowedVideoCreators={() => {}} 
            sourceCategories={[]} 
            setSourceCategories={() => {}} 
            language={language} 
            setLanguage={setLanguage} 
            exploreTopics={exploreTopics} 
            setExploreTopics={setExploreTopics} 
            videoTopics={videoTopics} 
            setVideoTopics={setVideoTopics} 
            homeFeedConfig={homeFeedConfig} 
            setHomeFeedConfig={setHomeFeedConfig} 
            theme={theme} 
            setTheme={setTheme} 
            privacyConfig={privacyConfig}
            setPrivacyConfig={setPrivacyConfig}
            onLogout={handleLogout} 
        />
      );
      case ViewState.FEED:
      default:
        return (
          <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
            <div className="max-w-[850px] mx-auto min-h-screen md:px-6">
              <div className="sticky top-0 glass z-30 px-5 py-5 md:rounded-b-[2.5rem] shadow-premium mb-8 pt-safe">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 group">
                    <input
                      type="text"
                      placeholder="Search Space..."
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-cyan-500/20 outline-none dark:text-white transition-fluid"
                      value={homeSearch}
                      onChange={(e) => setHomeSearch(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button onClick={handleSynthesizeFeed} disabled={isSynthesizing} className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 hover:bg-cyan-100 transition-fluid shadow-sm active:scale-90">
                      <Sparkles className={`w-5 h-5 ${isSynthesizing ? 'animate-pulse' : ''}`} />
                    </button>
                    <button onClick={refreshFeed} className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white transition-fluid shadow-sm active:scale-90">
                      <RotateCw className={`w-5 h-5 ${isLoadingFeed ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="pb-32 space-y-6">
                {synthesis && <FeedSynthesis synthesis={synthesis} isLoading={isSynthesizing} onClose={() => setSynthesis(null)} />}
                <LiveSessions 
                  sessions={liveSessions} 
                  onJoinSession={(t, h) => setActiveLiveSession({title: t, host: h})} 
                  onViewStory={setViewingStory}
                  onCreateStory={handleCreateStory}
                  onStartLive={handleStartLive}
                  currentUser={user}
                />
                <div className="px-2 md:px-0">
                    <InlineCreatePost 
                      currentUser={user} 
                      onPostCreated={(p) => setPosts([p, ...posts])} 
                      onGoLive={() => setIsLiveSetupOpen(true)}
                    />
                </div>
                <div className="space-y-4">
                  {isLoadingFeed ? Array.from({ length: 3 }).map((_, i) => <SkeletonPost key={i} />) : homeFeed.map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      isSaved={!!savedCollection.find(s => s.id === post.id)} 
                      onFactCheck={handlePostFactCheck}
                      onSave={(p) => setSavedCollection(prev => [...prev, p])}
                      onDelete={handleDeletePost}
                      onEdit={handleEditPost}
                      onJoinLive={(sessionId) => {
                          const session = liveSessions.find(s => s.id === sessionId);
                          if (session) setActiveLiveSession({ title: session.title, host: session.host });
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const NavItemsList = () => (
    <div className="space-y-2 p-6 flex-1 bg-white dark:bg-slate-900 overflow-y-auto no-scrollbar">
      <NavItem icon={<Home className="w-5 h-5" />} label={t.home} active={currentView === ViewState.FEED} onClick={() => navigateTo(ViewState.FEED)} />
      <NavItem icon={<Compass className="w-5 h-5" />} label={t.explore} active={currentView === ViewState.EXPLORE} onClick={() => navigateTo(ViewState.EXPLORE)} />
      <NavItem icon={<ShoppingBag className="w-5 h-5" />} label={t.shop} active={currentView === ViewState.SHOP} onClick={() => navigateTo(ViewState.SHOP)} />
      <NavItem icon={<PlayCircle className="w-5 h-5" />} label={t.videos} active={currentView === ViewState.VIDEO} onClick={() => navigateTo(ViewState.VIDEO)} />
      
      <div className="pt-8 pb-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.social}</div>
      <NavItem icon={<Zap className="w-5 h-5" />} label={t.spaces} active={currentView === ViewState.SPACES} onClick={() => navigateTo(ViewState.SPACES)} />
      <NavItem icon={<Bell className="w-5 h-5" />} label={t.notifications} active={currentView === ViewState.NOTIFICATIONS} onClick={() => navigateTo(ViewState.NOTIFICATIONS)} />
      <NavItem icon={<MessageSquare className="w-5 h-5" />} label={t.messages} active={currentView === ViewState.MESSENGER} onClick={() => navigateTo(ViewState.MESSENGER)} />
      
      <div className="pt-8 pb-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.personal}</div>
      <NavItem icon={<Library className="w-5 h-5" />} label={t.library} active={currentView === ViewState.LIBRARY} onClick={() => navigateTo(ViewState.LIBRARY)} />
      <NavItem icon={<Bookmark className="w-5 h-5" />} label={t.collection} active={currentView === ViewState.COLLECTION} onClick={() => navigateTo(ViewState.COLLECTION)} />
      <NavItem icon={<Share2 className="w-5 h-5" />} label={t.share} active={currentView === ViewState.SHARE} onClick={() => navigateTo(ViewState.SHARE)} />
      <NavItem icon={<StickyNote className="w-5 h-5" />} label={t.notepad} active={currentView === ViewState.NOTEPAD} onClick={() => navigateTo(ViewState.NOTEPAD)} />
      <NavItem icon={<CalendarIcon className="w-5 h-5" />} label={t.planner} active={currentView === ViewState.CALENDAR} onClick={() => navigateTo(ViewState.CALENDAR)} />

      <div className="mt-auto pt-10 border-t border-slate-100 dark:border-slate-800">
        <NavItem icon={<UserIcon className="w-5 h-5" />} label={t.profile} active={currentView === ViewState.PROFILE} onClick={() => navigateTo(ViewState.PROFILE)} />
        <NavItem icon={<SettingsIcon className="w-5 h-5" />} label={t.settings} active={currentView === ViewState.SETTINGS} onClick={() => navigateTo(ViewState.SETTINGS)} />
      </div>
    </div>
  );

  return (
    <div className={`h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-700 overflow-hidden`}>
      {viewingStory && <StoryViewer session={viewingStory} onClose={() => setViewingStory(null)} />}
      
      {/* Live Setup Modal */}
      {isLiveSetupOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Go Live</h2>
                    <button onClick={() => setIsLiveSetupOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Describe your live video</label>
                        <input 
                            autoFocus
                            type="text" 
                            className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl font-bold text-lg outline-none focus:ring-2 focus:ring-red-500/50 dark:text-white transition-all"
                            placeholder="What are you discussing today?"
                            value={liveSetupTitle}
                            onChange={(e) => setLiveSetupTitle(e.target.value)}
                        />
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600">
                            <Video className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Public Broadcast</h4>
                            <p className="text-xs text-slate-500">Anyone can watch and comment.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleStartLive(liveSetupTitle || "Live Broadcast")}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-red-500/30 transition-all active:scale-95"
                    >
                        Start Live Video
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Professional Sidebar */}
        <aside className="hidden md:flex flex-col w-72 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
            <div className="p-10 flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-premium"><Zap className="w-6 h-6 fill-current" /></div>
                <span className="text-2xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none">{t.spaceName}</span>
            </div>
            <NavItemsList />
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-[100] flex">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative w-72 bg-white dark:bg-slate-900 h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col pt-safe">
                <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
                <span className="font-black tracking-widest text-cyan-500">MENU</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                    <Plus className="w-6 h-6 rotate-45" />
                </button>
                </div>
                <NavItemsList />
            </div>
            </div>
        )}

        {/* Mobile Professional Header (Only on Feed/Explore etc) */}
        {showMobileNav && (
            <div className="md:hidden fixed top-0 w-full glass border-b border-slate-200/50 dark:border-slate-800/50 z-[50] px-6 h-16 flex items-center justify-between pt-safe">
            <button className="text-slate-900 dark:text-white p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase tracking-tighter">SPACE</span>
            <div className="flex items-center space-x-2">
                <button onClick={() => navigateTo(ViewState.NOTIFICATIONS)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl relative">
                <Bell className="w-5 h-5 dark:text-slate-200" />
                {notifications.some(n => !n.isRead) && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
                )}
                </button>
            </div>
            </div>
        )}

        <main className="flex-1 relative flex flex-col overflow-hidden">
            {renderContent()}
        </main>
      </div>

      {/* Professional Mobile Nav (Only on main views) */}
      {showMobileNav && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass rounded-full border border-white/20 shadow-2xl flex justify-around items-center z-[50] pb-safe px-6">
          <BottomTab icon={<Home className="w-6 h-6" />} active={currentView === ViewState.FEED} onClick={() => navigateTo(ViewState.FEED)} />
          <BottomTab icon={<Compass className="w-6 h-6" />} active={currentView === ViewState.EXPLORE} onClick={() => navigateTo(ViewState.EXPLORE)} />
          <BottomTab icon={<PlayCircle className="w-6 h-6" />} active={currentView === ViewState.VIDEO} onClick={() => navigateTo(ViewState.VIDEO)} />
          <BottomTab icon={<MessageSquare className="w-6 h-6" />} active={false} onClick={() => navigateTo(ViewState.MESSENGER)} />
          <BottomTab icon={<UserIcon className="w-6 h-6" />} active={currentView === ViewState.PROFILE} onClick={() => navigateTo(ViewState.PROFILE)} />
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-fluid font-bold text-[15px] group ${active ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-premium' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
      <span className={active ? 'text-cyan-400 dark:text-cyan-600' : 'text-slate-400 group-hover:text-cyan-500 transition-colors'}>{icon}</span>
      <span className="truncate tracking-tight">{label}</span>
      {active && <ChevronRight className="w-4 h-4 ml-auto opacity-40" />}
    </button>
  );
}

function BottomTab({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`p-2 transition-fluid active:scale-75 ${active ? 'text-cyan-500 scale-110' : 'text-slate-400'}`}>
      {icon}
    </button>
  );
}
