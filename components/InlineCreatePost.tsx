
import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Loader2, Sparkles, MapPin, List, Smile, X, Plus, Video, Camera } from 'lucide-react';
import { analyzeContentSource } from '../services/geminiService';
import { Post, User, Poll } from '../types';

interface InlineCreatePostProps {
  currentUser: User;
  onPostCreated: (post: Post) => void;
  onGoLive?: () => void;
}

export const InlineCreatePost: React.FC<InlineCreatePostProps> = ({ currentUser, onPostCreated, onGoLive }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Feature States
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [mood, setMood] = useState<string | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
            setIsExpanded(true);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && !selectedImage && !pollQuestion) return;

    setIsAnalyzing(true);

    try {
      // Basic AI analysis for the text content
      const analysis = await analyzeContentSource(content || 'Image Post');

      if (!analysis.isSafe) {
        alert("This content was flagged as unsafe and cannot be posted.");
        setIsAnalyzing(false);
        return;
      }

      // Construct Poll Object if valid
      let pollData: Poll | undefined;
      if (showPollCreator && pollQuestion.trim() && pollOptions.filter(o => o.trim()).length >= 2) {
        pollData = {
            question: pollQuestion,
            options: pollOptions.filter(o => o.trim()).map((opt, idx) => ({
                id: `opt-${idx}`,
                text: opt,
                votes: 0
            })),
            totalVotes: 0
        };
      }

      const newPost: Post = {
        id: Date.now().toString(),
        content: content,
        author: currentUser,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        imageUrl: selectedImage || undefined,
        location: location.trim() || undefined,
        poll: pollData,
        category: analysis.category as any,
        originalSource: analysis.originalSource || undefined,
        isAiFlagged: false,
        commentsList: []
      };

      onPostCreated(newPost);
      
      // Reset State
      setContent('');
      setSelectedImage(null);
      setLocation('');
      setShowLocationInput(false);
      setShowPollCreator(false);
      setPollQuestion('');
      setPollOptions(['', '']);
      setMood(null);
      setIsExpanded(false);

    } catch (e) {
      console.error(e);
      alert("Something went wrong with the AI service.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const emojis = ['😀', '😂', '😍', '🤔', '😎', '🔥', '🎉', '🚀'];

  return (
    <div className="w-full border-b border-gray-100 bg-white dark:bg-slate-900 rounded-3xl md:rounded-[2rem] shadow-sm overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex gap-4">
            {/* Left: Avatar */}
            <div className="flex-shrink-0">
                <img 
                    src={currentUser.avatarUrl} 
                    alt="me" 
                    className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-slate-800" 
                />
            </div>

            {/* Right: Input */}
            <div className="flex-1 min-w-0">
                <div 
                    onClick={() => setIsExpanded(true)}
                    className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 cursor-text hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <textarea
                        className={`w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed text-lg transition-all duration-200 ${isExpanded || selectedImage || showPollCreator ? 'min-h-[80px]' : 'h-8 py-0.5'}`}
                        placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </div>
        </div>

        {/* Expanded Content Area (Images, Polls, etc) */}
        {(selectedImage || showLocationInput || showPollCreator || mood) && (
             <div className="mt-4 pl-16 animate-in fade-in zoom-in duration-200 space-y-3">
                {/* Location Badge */}
                {location && (
                    <div className="inline-flex items-center bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold">
                        <MapPin className="w-3 h-3 mr-1" />
                        {location}
                        <button onClick={() => setLocation('')} className="ml-2 hover:text-red-500"><X className="w-3 h-3"/></button>
                    </div>
                )}
                {/* Mood Badge */}
                {mood && (
                    <div className="inline-flex items-center bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold ml-2">
                        <span className="mr-1">Feeling</span> {mood}
                        <button onClick={() => setMood(null)} className="ml-2 hover:text-red-500"><X className="w-3 h-3"/></button>
                    </div>
                )}

                {/* Image Preview */}
                {selectedImage && (
                    <div className="relative w-full max-h-80 rounded-2xl overflow-hidden group border border-slate-100 dark:border-slate-800">
                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={() => { setSelectedImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Location Input Field */}
                {showLocationInput && !location && (
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                        <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Where are you?" 
                            className="bg-transparent border-none outline-none text-sm w-full font-medium dark:text-white"
                            onKeyDown={(e) => {
                                if(e.key === 'Enter') {
                                    setLocation(e.currentTarget.value);
                                    setShowLocationInput(false);
                                }
                            }}
                            onBlur={(e) => {
                                if(e.target.value) setLocation(e.target.value);
                                setShowLocationInput(false);
                            }}
                        />
                    </div>
                )}

                {/* Poll Creator */}
                {showPollCreator && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Create Poll</span>
                            <button onClick={() => setShowPollCreator(false)}><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Ask a question..." 
                            className="w-full mb-3 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:border-teal-500 dark:text-white"
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                        />
                        <div className="space-y-2">
                            {pollOptions.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        placeholder={`Option ${idx + 1}`} 
                                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-teal-500 dark:text-white"
                                        value={opt}
                                        onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                                    />
                                    {pollOptions.length > 2 && (
                                        <button onClick={() => removePollOption(idx)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {pollOptions.length < 4 && (
                            <button onClick={handleAddPollOption} className="mt-3 text-xs font-bold text-teal-600 flex items-center hover:underline">
                                <Plus className="w-3 h-3 mr-1" /> Add Option
                            </button>
                        )}
                    </div>
                )}
             </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            
            {/* Quick Actions */}
            <div className="flex items-center gap-1 md:gap-4 flex-1 overflow-x-auto no-scrollbar">
                <button 
                    onClick={onGoLive}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors group"
                >
                    <Video className="w-6 h-6 text-rose-500 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">Live Video</span>
                </button>

                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                >
                    <ImageIcon className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">Photo/Video</span>
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageSelect}
                />

                <button 
                    onClick={() => setShowMoodPicker(!showMoodPicker)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors group relative"
                >
                    <Smile className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">Feeling</span>
                    
                    {showMoodPicker && (
                        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 rounded-2xl p-2 flex gap-1 z-10 animate-in zoom-in duration-200">
                            {emojis.map(e => (
                                <button key={e} onClick={(e2) => { e2.stopPropagation(); setMood(e); setShowMoodPicker(false); }} className="hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg text-xl">
                                    {e}
                                </button>
                            ))}
                        </div>
                    )}
                </button>
            </div>

            {/* Extra Tools & Post Button */}
            <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1">
                    <button onClick={() => setShowLocationInput(!showLocationInput)} className={`p-2.5 rounded-full transition-colors ${showLocationInput ? 'bg-teal-50 text-teal-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'}`}>
                        <MapPin className="w-5 h-5" />
                    </button>
                    <button onClick={() => setShowPollCreator(!showPollCreator)} className={`p-2.5 rounded-full transition-colors ${showPollCreator ? 'bg-teal-50 text-teal-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'}`}>
                        <List className="w-5 h-5" />
                    </button>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isAnalyzing || (!content.trim() && !selectedImage && !pollQuestion)}
                    className={`px-8 py-2.5 rounded-xl font-black text-sm transition-all duration-300 flex items-center gap-2 shadow-lg ${
                        isAnalyzing || (!content.trim() && !selectedImage && !pollQuestion)
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95'
                    }`}
                >
                    {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isAnalyzing ? 'Check' : 'Post'}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
