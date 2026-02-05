
import React, { useState } from 'react';
import { User, SourceCategory, ExploreTopic, VideoTopic, HomeFeedConfig, PrivacyConfig } from '../types';
import { 
  User as UserIcon, 
  Lock, 
  Bell, 
  Shield, 
  Moon, 
  LogOut,
  ChevronRight,
  Eye,
  Mail,
  Smartphone,
  Globe,
  Zap,
  LayoutGrid,
  Check,
  Play,
  Trash2,
  Plus,
  Compass,
  X,
  ChevronDown,
  LayoutList,
  Sparkles,
  ShieldCheck,
  Users,
  Sun,
  Laptop,
  Image as ImageIcon,
  MessageSquare,
  List,
  EyeOff,
  Search,
  Activity,
  FileText
} from 'lucide-react';

interface SettingsViewProps {
  currentUser: User;
  followedVideoCreators: string[];
  setFollowedVideoCreators: (creators: string[]) => void;
  sourceCategories: SourceCategory[];
  setSourceCategories: React.Dispatch<React.SetStateAction<SourceCategory[]>>;
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  exploreTopics: ExploreTopic[];
  setExploreTopics: React.Dispatch<React.SetStateAction<ExploreTopic[]>>;
  videoTopics: VideoTopic[];
  setVideoTopics: React.Dispatch<React.SetStateAction<VideoTopic[]>>;
  homeFeedConfig: HomeFeedConfig;
  setHomeFeedConfig: React.Dispatch<React.SetStateAction<HomeFeedConfig>>;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  privacyConfig: PrivacyConfig;
  setPrivacyConfig: React.Dispatch<React.SetStateAction<PrivacyConfig>>;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
    currentUser, 
    followedVideoCreators, 
    setFollowedVideoCreators,
    sourceCategories,
    setSourceCategories,
    language,
    setLanguage,
    exploreTopics,
    setExploreTopics,
    videoTopics,
    setVideoTopics,
    homeFeedConfig,
    setHomeFeedConfig,
    theme,
    setTheme,
    privacyConfig,
    setPrivacyConfig,
    onLogout
}) => {
  const [activeTab, setActiveTab] = useState('home-feed');
  const [newSourceInputs, setNewSourceInputs] = useState<Record<string, string>>({});
  const [newVideoTopicName, setNewVideoTopicName] = useState('');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const toggleTopic = (topicId: string) => {
    setExploreTopics(prev => prev.map(t => t.id === topicId ? { ...t, enabled: !t.enabled } : t));
  };

  const toggleVideoTopic = (topicId: string) => {
    setVideoTopics(prev => prev.map(t => t.id === topicId ? { ...t, enabled: !t.enabled } : t));
  };

  const handleAddVideoTopic = () => {
    if (!newVideoTopicName.trim()) return;
    const newTopic: VideoTopic = {
        id: `vt-${Date.now()}`,
        label: newVideoTopicName,
        icon: 'Tag',
        enabled: true
    };
    setVideoTopics([...videoTopics, newTopic]);
    setNewVideoTopicName('');
  };

  const handleAddSource = (topicId: string) => {
    const source = newSourceInputs[topicId]?.trim();
    if (!source) return;
    setExploreTopics(prev => prev.map(t => {
        if (t.id === topicId && !t.sources.includes(source)) {
            return { ...t, sources: [...t.sources, source] };
        }
        return t;
    }));
    setNewSourceInputs(prev => ({ ...prev, [topicId]: '' }));
  };

  const handleRemoveSource = (topicId: string, source: string) => {
    setExploreTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, sources: t.sources.filter(s => s !== source) };
      }
      return t;
    }));
  };

  const toggleContentType = (type: keyof HomeFeedConfig['contentTypes']) => {
      setHomeFeedConfig({
          ...homeFeedConfig,
          contentTypes: {
              ...homeFeedConfig.contentTypes,
              [type]: !homeFeedConfig.contentTypes[type]
          }
      });
  };

  const sections = [
    { id: 'home-feed', label: language === 'bn' ? 'হোম ফিড' : 'Home Feed', icon: <LayoutList className="w-5 h-5" /> },
    { id: 'videos', label: language === 'bn' ? 'ভিডিও টপিক' : 'Video Topics', icon: <Play className="w-5 h-5" /> },
    { id: 'appearance', label: language === 'bn' ? 'অপেয়ারেন্স' : 'Appearance', icon: <Moon className="w-5 h-5" /> },
    { id: 'language', label: language === 'bn' ? 'ভাষা' : 'Language', icon: <Globe className="w-5 h-5" /> },
    { id: 'explore', label: language === 'bn' ? 'এক্সপ্লোর ফিড' : 'Explore Feeds', icon: <Compass className="w-5 h-5" /> },
    { id: 'general', label: language === 'bn' ? 'অ্যাকাউন্ট' : 'Account', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'privacy', label: language === 'bn' ? 'প্রাইভেসি' : 'Privacy', icon: <Lock className="w-5 h-5" /> },
    { id: 'ai', label: language === 'bn' ? 'স্পেস এআই' : 'Space AI', icon: <Zap className="w-5 h-5" /> },
    { id: 'notifications', label: language === 'bn' ? 'নোটিফিকেশন' : 'Notifications', icon: <Bell className="w-5 h-5" /> },
  ];

  const t = {
    appearance: {
      title: language === 'bn' ? 'অপেয়ারেন্স সেটিংস' : 'Appearance Settings',
      desc: language === 'bn' ? 'আপনার ইন্টারফেসের মোড এবং থিম নির্বাচন করুন।' : 'Choose your interface mode and customize your experience.',
      light: language === 'bn' ? 'লাইট মোড' : 'Light Mode',
      dark: language === 'bn' ? 'ডার্ক মোড' : 'Dark Mode',
      system: language === 'bn' ? 'সিস্টেম' : 'System',
    },
    language: {
      title: language === 'bn' ? 'ভাষা পছন্দসমূহ' : 'Language Preferences',
      desc: language === 'bn' ? 'অ্যাপ্লিকেশন ব্যবহারের জন্য আপনার পছন্দের ভাষা বেছে নিন।' : 'Select the primary language for your application interface.',
      en: 'English',
      bn: 'বাংলা (Bangla)'
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
        {language === 'bn' ? 'সেটিংস' : 'Settings'}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Navigation */}
        <div className="w-full md:w-72 space-y-3 shrink-0">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all font-medium ${
                activeTab === section.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 transform scale-[1.02]'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 hover:shadow-lg hover:shadow-gray-200/50'
              }`}
            >
              <div className={activeTab === section.id ? (theme === 'dark' ? 'text-teal-600' : 'text-teal-400') : 'text-slate-400'}>
                {section.icon}
              </div>
              <span className="truncate">{section.label}</span>
              {activeTab === section.id && <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />}
            </button>
          ))}
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mt-8 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/40"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{language === 'bn' ? 'লগ আউট' : 'Sign Out'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-white/60 dark:border-slate-800/60 overflow-hidden min-h-[600px] relative">
          
          {activeTab === 'home-feed' && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="mb-8 border-b border-gray-100 dark:border-slate-800 pb-6">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center mb-2">
                    <LayoutList className="w-7 h-7 mr-3 text-teal-600" /> {language === 'bn' ? 'হোম ফিড কন্ট্রোল' : 'Home Feed Control'}
                 </h2>
                 <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                   {language === 'bn' ? 'আপনার মূল ড্যাশবোর্ড অভিজ্ঞতা এবং অ্যালগরিদম পছন্দগুলি কাস্টমাইজ করুন।' : 'Customize your main dashboard experience and algorithm preferences.'}
                 </p>
               </div>

               <div className="space-y-6">
                  {/* Algorithms Section */}
                  <div className="space-y-6">
                    <SettingToggle 
                        title={language === 'bn' ? 'ফ্যাক্ট-চেকড কন্টেন্ট অগ্রাধিকার দিন' : "Prioritize Fact-Checked Content"} 
                        description={language === 'bn' ? 'স্পেস এআই পোস্টগুলি যাচাই করবে এবং যাচাইকৃত দাবিগুলি উপরে আনবে।' : "Space AI will verify posts and bring verified claims to the top."} 
                        isOn={homeFeedConfig.prioritizeFactChecked} 
                        onToggle={() => setHomeFeedConfig({...homeFeedConfig, prioritizeFactChecked: !homeFeedConfig.prioritizeFactChecked})}
                        icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
                    />
                    <SettingToggle 
                        title={language === 'bn' ? 'কমিউনিটি সাবস্পেস দেখান' : "Show Community Subspaces"} 
                        description={language === 'bn' ? 'আপনি এখনো যোগ দেননি এমন সাবস্পেস থেকে আপডেট এবং ট্রেন্ডিং পোস্ট অন্তর্ভুক্ত করুন।' : "Include updates and trending posts from subspaces you haven't joined yet."} 
                        isOn={homeFeedConfig.showSubspaces} 
                        onToggle={() => setHomeFeedConfig({...homeFeedConfig, showSubspaces: !homeFeedConfig.showSubspaces})}
                        icon={<Users className="w-5 h-5 text-blue-500" />}
                    />
                    <SettingToggle 
                        title={language === 'bn' ? 'এআই ফিড সিন্থেসিস সক্ষম করুন' : "Enable AI Feed Synthesis"} 
                        description={language === 'bn' ? 'আপনার অপঠিত ফিডকে মূল থিমগুলিতে স্বয়ংক্রিয়ভাবে সারসংক্ষেপ করুন।' : "Automatically summarize your unread feed into key themes."} 
                        isOn={homeFeedConfig.enableAiSynthesis} 
                        onToggle={() => setHomeFeedConfig({...homeFeedConfig, enableAiSynthesis: !homeFeedConfig.enableAiSynthesis})}
                        icon={<Sparkles className="w-5 h-5 text-amber-500" />}
                    />
                    <SettingToggle 
                        title={language === 'bn' ? 'ডিসকভারি মোড' : "Discovery Mode"} 
                        description={language === 'bn' ? 'ইঞ্জিনকে আপনার তাৎক্ষণিক বৃত্তের বাইরে কন্টেন্ট সাজেস্ট করার অনুমতি দিন।' : "Allow the engine to suggest content outside of your immediate circle."} 
                        isOn={homeFeedConfig.discoveryMode} 
                        onToggle={() => setHomeFeedConfig({...homeFeedConfig, discoveryMode: !homeFeedConfig.discoveryMode})}
                        icon={<Compass className="w-5 h-5 text-teal-500" />}
                    />
                  </div>

                  {/* Content Preferences */}
                  <div className="pt-6 border-t border-gray-100 dark:border-slate-800">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 block">
                      Content Preferences
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SettingToggle 
                            title="Show Images" 
                            description="Display image posts in your feed."
                            isOn={homeFeedConfig.contentTypes.images} 
                            onToggle={() => toggleContentType('images')}
                            icon={<ImageIcon className="w-5 h-5 text-purple-500" />}
                        />
                        <SettingToggle 
                            title="Show Videos" 
                            description="Display video posts in your feed."
                            isOn={homeFeedConfig.contentTypes.videos} 
                            onToggle={() => toggleContentType('videos')}
                            icon={<Play className="w-5 h-5 text-red-500" />}
                        />
                        <SettingToggle 
                            title="Show Text Posts" 
                            description="Display text-only discussions."
                            isOn={homeFeedConfig.contentTypes.text} 
                            onToggle={() => toggleContentType('text')}
                            icon={<FileText className="w-5 h-5 text-slate-500" />}
                        />
                        <SettingToggle 
                            title="Show Polls" 
                            description="Display community polls."
                            isOn={homeFeedConfig.contentTypes.polls} 
                            onToggle={() => toggleContentType('polls')}
                            icon={<List className="w-5 h-5 text-indigo-500" />}
                        />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 dark:border-slate-800">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 block">
                      {language === 'bn' ? 'ফিড সর্টিং কৌশল' : 'Feed Sorting Strategy'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                       {['Recent', 'Trending', 'Relevant'].map(sort => (
                         <button 
                            key={sort}
                            onClick={() => setHomeFeedConfig({...homeFeedConfig, feedSorting: sort as any})}
                            className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${homeFeedConfig.feedSorting === sort ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}
                         >
                           {sort}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'videos' && (
              <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
                 <div className="mb-8 border-b border-gray-100 dark:border-slate-800 pb-6">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center mb-2">
                    <Play className="w-7 h-7 mr-3 text-teal-600" /> {language === 'bn' ? 'ভিডিও টপিকস' : 'Video Topics'}
                 </h2>
                 <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                   {language === 'bn' ? 'আপনি আগ্রহী এমন টপিক বেছে নিয়ে আপনার ভিডিও ফিড ফিল্টার করুন।' : "Filter your video feed by choosing topics you're interested in."}
                 </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {videoTopics.map(topic => (
                    <div key={topic.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:border-teal-200 dark:hover:border-teal-900 transition-all">
                       <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors`}>
                             <Play className="w-5 h-5 fill-current" />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{topic.label}</span>
                       </div>
                       <ToggleSwitch isOn={topic.enabled} onToggle={() => toggleVideoTopic(topic.id)} />
                    </div>
                  ))}
               </div>

               {/* Add New Topic */}
               <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Add Custom Topic Tag</h4>
                  <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="e.g. Science, Travel..." 
                        className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/20 outline-none dark:text-white"
                        value={newVideoTopicName}
                        onChange={(e) => setNewVideoTopicName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddVideoTopic()}
                      />
                      <button 
                        onClick={handleAddVideoTopic}
                        disabled={!newVideoTopicName.trim()}
                        className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-lg hover:bg-teal-600 dark:hover:bg-teal-400 transition-all disabled:opacity-50"
                      >
                          Add
                      </button>
                  </div>
               </div>
              </div>
          )}

          {activeTab === 'privacy' && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="mb-8 border-b border-gray-100 dark:border-slate-800 pb-6">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center mb-2">
                    <Shield className="w-7 h-7 mr-3 text-teal-600" /> {language === 'bn' ? 'গোপনীয়তা সেটিংস' : 'Privacy Settings'}
                 </h2>
                 <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                   Manage your profile visibility, data sharing, and security preferences.
                 </p>
               </div>

               <div className="space-y-6">
                  <SettingToggle 
                    title="Private Profile" 
                    description="Only followers can see your posts and activity." 
                    isOn={privacyConfig.privateProfile} 
                    onToggle={() => setPrivacyConfig({...privacyConfig, privateProfile: !privacyConfig.privateProfile})}
                    icon={<EyeOff className="w-5 h-5 text-slate-500" />}
                  />
                  <SettingToggle 
                    title="Show Online Status" 
                    description="Let others see when you are active on Space." 
                    isOn={privacyConfig.showOnlineStatus} 
                    onToggle={() => setPrivacyConfig({...privacyConfig, showOnlineStatus: !privacyConfig.showOnlineStatus})}
                    icon={<Activity className="w-5 h-5 text-green-500" />}
                  />
                  <SettingToggle 
                    title="Read Receipts" 
                    description="Show when you have viewed messages." 
                    isOn={privacyConfig.readReceipts} 
                    onToggle={() => setPrivacyConfig({...privacyConfig, readReceipts: !privacyConfig.readReceipts})}
                    icon={<Check className="w-5 h-5 text-blue-500" />}
                  />
                  <SettingToggle 
                    title="Allow Search Indexing" 
                    description="Let search engines index your public profile." 
                    isOn={privacyConfig.allowSearchIndexing} 
                    onToggle={() => setPrivacyConfig({...privacyConfig, allowSearchIndexing: !privacyConfig.allowSearchIndexing})}
                    icon={<Search className="w-5 h-5 text-purple-500" />}
                  />
                  <SettingToggle 
                    title="Share Data with AI" 
                    description="Allow Space AI to use your anonymized data to improve recommendations." 
                    isOn={privacyConfig.shareDataWithAI} 
                    onToggle={() => setPrivacyConfig({...privacyConfig, shareDataWithAI: !privacyConfig.shareDataWithAI})}
                    icon={<Zap className="w-5 h-5 text-amber-500" />}
                  />
               </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8 border-b border-gray-100 dark:border-slate-800 pb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                  <Moon className="w-7 h-7 mr-3 text-teal-600" /> {t.appearance.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">{t.appearance.desc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${theme === 'light' ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-500 shadow-xl' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-teal-200'}`}
                >
                  <div className={`p-4 rounded-2xl ${theme === 'light' ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    <Sun className="w-8 h-8" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs dark:text-white">{t.appearance.light}</span>
                </button>

                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${theme === 'dark' ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-500 shadow-xl' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-teal-200'}`}
                >
                  <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    <Moon className="w-8 h-8" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs dark:text-white">{t.appearance.dark}</span>
                </button>

                <button 
                  disabled
                  className="p-6 rounded-[2.5rem] border-2 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-50 flex flex-col items-center gap-4 cursor-not-allowed"
                >
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-300">
                    <Laptop className="w-8 h-8" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs dark:text-white">{t.appearance.system}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8 border-b border-gray-100 dark:border-slate-800 pb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                  <Globe className="w-7 h-7 mr-3 text-teal-600" /> {t.language.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">{t.language.desc}</p>
              </div>

              <div className="space-y-4">
                 <button 
                  onClick={() => setLanguage('en')}
                  className={`w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${language === 'en' ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-500' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-teal-200'}`}
                 >
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${language === 'en' ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>EN</div>
                       <span className="font-bold text-lg dark:text-white">{t.language.en}</span>
                    </div>
                    {language === 'en' && <Check className="w-6 h-6 text-teal-600" />}
                 </button>

                 <button 
                  onClick={() => setLanguage('bn')}
                  className={`w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${language === 'bn' ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-500' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-teal-200'}`}
                 >
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${language === 'bn' ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>BN</div>
                       <span className="font-bold text-lg dark:text-white">{t.language.bn}</span>
                    </div>
                    {language === 'bn' && <Check className="w-6 h-6 text-teal-600" />}
                 </button>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="mb-8 border-b border-gray-100 dark:border-slate-800 pb-6">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center mb-2">
                    <Compass className="w-7 h-7 mr-3 text-teal-600" /> {language === 'bn' ? 'এক্সপ্লোর ফিড পরিচালনা করুন' : 'Manage Explore Feeds'}
                 </h2>
                 <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                   {language === 'bn' ? 'টপিক নির্বাচন এবং সোর্স অগ্রাধিকার দিয়ে আপনার ডিসকভারি অভিজ্ঞতা কাস্টমাইজ করুন।' : 'Customize your discovery experience by selecting topics and prioritizing content sources.'}
                 </p>
               </div>
               <div className="space-y-4">
                  {exploreTopics.map(topic => (
                    <div key={topic.id} className="bg-white/60 dark:bg-slate-800/60 rounded-3xl p-2 border border-white dark:border-slate-700 shadow-sm transition-all">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-xl ${topic.enabled ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400'}`}>{topic.icon}</div>
                          <span className={`font-bold text-lg ${topic.enabled ? 'text-slate-900 dark:text-white' : 'text-slate-400 line-through'}`}>{topic.label}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                           <button onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)} className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl">
                              <ChevronDown className={`w-5 h-5 transition-transform ${expandedTopic === topic.id ? 'rotate-180' : ''}`} />
                           </button>
                           <ToggleSwitch isOn={topic.enabled} onToggle={() => toggleTopic(topic.id)} />
                        </div>
                      </div>
                      {expandedTopic === topic.id && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl mx-4 mb-4 animate-in fade-in duration-300">
                           <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Custom Sources ({topic.sources.length})</h4>
                           <div className="space-y-2 mb-4">
                              {topic.sources.map(source => (
                                <div key={source} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-lg">
                                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{source}</span>
                                  <button onClick={() => handleRemoveSource(topic.id, source)} className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              {topic.sources.length === 0 && <p className="text-xs text-slate-400 text-center py-2">No custom sources added.</p>}
                           </div>
                           <div className="flex space-x-2">
                              <input 
                                type="text"
                                placeholder="e.g., youtube.com"
                                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                                value={newSourceInputs[topic.id] || ''}
                                onChange={(e) => setNewSourceInputs({...newSourceInputs, [topic.id]: e.target.value})}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSource(topic.id)}
                              />
                              <button onClick={() => handleAddSource(topic.id)} className="p-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-teal-600"><Plus className="w-3 h-3" /></button>
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center border-b border-gray-100 dark:border-slate-800 pb-6">
                <UserIcon className="w-7 h-7 mr-3 text-teal-600" /> {language === 'bn' ? 'অ্যাকাউন্ট তথ্য' : 'Account Information'}
              </h2>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
                 <img src={currentUser.avatarUrl} className="w-16 h-16 rounded-full" alt="" />
                 <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{currentUser.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{currentUser.handle}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-bold rounded-md">
                        {currentUser.role || 'Member'}
                    </span>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-8 mb-10 shadow-lg shadow-teal-500/20 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="flex items-start space-x-6 relative z-10">
                    <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white border border-white/20">
                      <Zap className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-2">{language === 'bn' ? 'স্পেস ইন্টেলিজেন্স ইঞ্জিন' : 'Space Intelligence Engine'}</h3>
                      <p className="text-teal-50 opacity-90 leading-relaxed">
                        {language === 'bn' ? 'আমাদের এআই মডেলগুলি কন্টেন্টের সত্যতা এবং নিরাপত্তা নিশ্চিত করতে স্থানীয়ভাবে এবং ক্লাউডে চলে।' : 'Our AI models run locally and in the cloud to ensure content authenticity and safety.'}
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const SettingToggle = ({ title, description, isOn, onToggle, icon }: { title: string, description: string, isOn: boolean, onToggle: () => void, icon?: React.ReactNode }) => (
    <div className="flex items-start justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
       <div className="flex items-start space-x-4">
          {icon && <div className="mt-1">{icon}</div>}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">{title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
          </div>
       </div>
       <div className="pt-1">
          <ToggleSwitch isOn={isOn} onToggle={onToggle} />
       </div>
    </div>
);

const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean, onToggle: () => void }) => (
  <button 
    onClick={onToggle}
    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOn ? 'bg-teal-600' : 'bg-gray-200 dark:bg-slate-700'}`}
  >
    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white dark:bg-slate-300 shadow-md ring-0 transition duration-200 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);
