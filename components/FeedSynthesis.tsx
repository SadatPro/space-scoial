import React from 'react';
import { FeedSynthesisResult } from '../types';
import { Loader2, Sparkles, TrendingUp, HelpCircle, X, Lightbulb } from 'lucide-react';

interface FeedSynthesisProps {
  synthesis: FeedSynthesisResult | null;
  isLoading: boolean;
  onClose: () => void;
}

export const FeedSynthesis: React.FC<FeedSynthesisProps> = ({ synthesis, isLoading, onClose }) => {
  if (isLoading) {
    return (
      <div className="p-4 border-b border-gray-100">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-center text-slate-400 font-medium text-sm animate-pulse">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          AI is analyzing your feed...
        </div>
      </div>
    );
  }

  if (!synthesis) return null;

  return (
    <div className="p-4 border-b border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-gradient-to-br from-teal-50 to-blue-50/50 rounded-3xl p-5 border border-white relative shadow-sm">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-black/5 hover:bg-black/10 rounded-full text-slate-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
             <Sparkles className="w-5 h-5 text-teal-500" />
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Your Feed, Synthesized</h3>
        </div>

        <div className="space-y-4">
          {/* Key Themes */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Key Themes</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {synthesis.themes.map((theme, i) => (
                <span key={i} className="px-3 py-1 bg-white/70 rounded-lg text-xs font-bold text-slate-800 border border-slate-100 shadow-sm">
                  {theme}
                </span>
              ))}
            </div>
          </div>

          {/* Hot Take */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trending Post</h4>
            </div>
            <div className="bg-white/70 rounded-xl p-3 border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-600 italic leading-relaxed">"{synthesis.hotTake.content}"</p>
              <p className="text-right text-[10px] font-bold text-slate-400 mt-1">- {synthesis.hotTake.author}</p>
            </div>
          </div>
          
          {/* Deeper Dive */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Deeper Dive</h4>
            </div>
             <p className="text-xs font-semibold text-slate-700 bg-white/50 px-3 py-2 rounded-lg">
                {synthesis.deeperDive}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
