
import React, { useState } from 'react';
import { X, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { analyzeContentSource } from '../services/geminiService';
import { Post, User } from '../types';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: (post: Post) => void;
  currentUser: User;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated, currentUser }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);

    try {
      // 1. AI Analysis
      const analysis = await analyzeContentSource(content);

      if (!analysis.isSafe) {
        alert("This content was flagged as unsafe and cannot be posted.");
        setIsAnalyzing(false);
        return;
      }

      // 2. Create Post Object
      const newPost: Post = {
        id: Date.now().toString(),
        content: content,
        author: currentUser,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        category: analysis.category as any,
        originalSource: analysis.originalSource || undefined,
        isAiFlagged: false // We already blocked unsafe, so this is clean
      };

      onPostCreated(newPost);
      onClose();

    } catch (e) {
      console.error(e);
      alert("Something went wrong with the AI service.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Glassmorphic Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/40 ring-1 ring-black/5">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100/50 flex justify-between items-center bg-white/50">
          <h3 className="font-bold text-xl text-slate-900 tracking-tight">Create Post</h3>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-slate-900 hover:bg-gray-100 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex space-x-4 mb-2">
             <img src={currentUser.avatarUrl} alt="me" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
             <div className="flex-1">
               <textarea
                className="w-full min-h-[160px] p-2 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-lg resize-none leading-relaxed"
                placeholder="What's on your mind? (AI checks for sources automatically)"
                value={content}
                autoFocus
                onChange={(e) => setContent(e.target.value)}
               />
             </div>
          </div>
          
          {/* Helper Text - Modern Pill */}
          <div className="bg-gradient-to-r from-teal-50 to-teal-100/50 rounded-2xl p-4 mb-6 border border-teal-100 shadow-sm flex items-start gap-3">
            <div className="p-1.5 bg-white rounded-full shadow-sm text-teal-600">
                <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs text-teal-900 font-medium leading-5 pt-0.5">
              <span className="font-bold block mb-1">AI-Powered Source Detection</span>
              Space will automatically attribute verified sources or confirm originality.
            </p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-100/50">
            <button className="text-slate-500 hover:text-teal-600 hover:bg-teal-50 p-3 rounded-full transition-colors">
              <ImageIcon className="w-6 h-6" />
            </button>
            <button
              onClick={handleSubmit}
              disabled={isAnalyzing || !content.trim()}
              className={`px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center space-x-2 shadow-lg ${
                  isAnalyzing || !content.trim() 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-slate-900 text-white hover:bg-teal-600 hover:shadow-teal-500/40 hover:-translate-y-0.5'
              }`}
            >
              {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isAnalyzing ? 'Analyzing...' : 'Post'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};