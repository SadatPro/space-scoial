import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, Loader2 } from 'lucide-react';

const STATUS_MESSAGES = [
  "Aligning core systems...",
  "Synthesizing feed data...",
  "Calibrating discovery engine...",
  "Authenticating sources...",
  "Scanning neural network...",
  "Synchronizing subspace...",
];

export const SpaceSpinner: React.FC<{ message?: string }> = ({ message }) => {
  const [status, setStatus] = useState(message || STATUS_MESSAGES[0]);

  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setStatus(STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)]);
    }, 2500);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in duration-700">
      <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
        {/* Outer Halo */}
        <div className="absolute inset-0 border-[3px] border-dashed border-cyan-500/20 rounded-full animate-[spin_15s_linear_infinite]"></div>
        
        {/* Progress Halo */}
        <div className="absolute inset-4 border-[1px] border-slate-200 dark:border-slate-800 rounded-full"></div>
        
        {/* Core Jewel */}
        <div className="z-10 w-16 h-16 bg-cyan-500 rounded-[1.75rem] flex items-center justify-center shadow-cyan-glow transform animate-float border border-cyan-400/30">
          <Zap className="w-8 h-8 text-white fill-white animate-pulse-slow" />
        </div>

        {/* Floating Micro-particles */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute animate-orbit">
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(0,204,255,0.8)]"></div>
            </div>
            <div className="absolute animate-orbit" style={{ animationDelay: '-2s', animationDirection: 'reverse' }}>
                <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full shadow-[0_0_12px_rgba(0,163,204,0.6)]"></div>
            </div>
            <div className="absolute animate-orbit" style={{ animationDelay: '-1s', scale: '0.7' }}>
                <div className="w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(64,230,255,0.6)]"></div>
            </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <p className="text-slate-950 dark:text-white font-black uppercase tracking-[0.4em] text-[11px] text-center opacity-80">
          {status}
        </p>
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonPost: React.FC = () => (
  <div className="w-full bg-white dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 mb-4 rounded-[2rem] overflow-hidden flex p-6 animate-pulse">
    <div className="w-14 flex flex-col items-center space-y-6 mr-6 pt-2">
      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
      <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
    </div>
    <div className="flex-1 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
        <div className="space-y-2">
            <div className="w-32 h-3 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
            <div className="w-20 h-2 bg-slate-50 dark:bg-slate-800/50 rounded-full"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
        <div className="w-3/4 h-4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
      </div>
      <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded-[2rem]"></div>
    </div>
  </div>
);
