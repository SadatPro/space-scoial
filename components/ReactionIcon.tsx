import React from 'react';
import { Reactions } from '../types';

interface ReactionIconProps {
  type: keyof Reactions;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const ReactionIcon: React.FC<ReactionIconProps> = ({ type, size = 'md', className = '', style }) => {
  const sizeClasses = {
    sm: 'w-6 h-6', // for summary
    md: 'w-10 h-10', // for hover panel
    lg: 'w-[20px] h-[20px]', // for the main reaction button
  };

  const LikeIcon = () => (
    <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-500 to-blue-600 shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10v12"/>
        <path d="M18 10h-5.41l.92-4.65a2 2 0 0 0-1.05-2.26L11.5 2 7 8.5V22h12a2 2 0 0 0 2-2v-6.5a2 2 0 0 0-2-2z"/>
      </svg>
    </div>
  );

  const LoveIcon = () => (
     <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-rose-500 to-red-600 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
     </div>
  );

  const HahaIcon = () => (
    <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-yellow-400 to-amber-500 shadow-lg p-[15%]">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="currentColor"/>
        <circle cx="30" cy="35" r="7" fill="black"/>
        <circle cx="70" cy="35" r="7" fill="black"/>
        <path d="M 20 60 C 20 80, 80 80, 80 60" fill="black"/>
      </svg>
    </div>
  );

  const SadIcon = () => (
    <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-400 to-blue-600 shadow-lg p-[15%]">
       <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="currentColor"/>
        <circle cx="30" cy="40" r="7" fill="black"/>
        <circle cx="70" cy="40" r="7" fill="black"/>
        <path d="M 25 75 Q 50 60, 75 75" stroke="black" strokeWidth="6" fill="transparent" strokeLinecap="round"/>
        <path d="M 20 60 Q 25 70, 30 60" fill="blue" stroke="black" strokeWidth="2"/>
       </svg>
    </div>
  );

  const AngryIcon = () => (
    <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-red-500 to-red-700 shadow-lg p-[15%]">
       <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="currentColor"/>
        <path d="M 20 35 L 40 30" stroke="black" strokeWidth="6" strokeLinecap="round"/>
        <path d="M 80 35 L 60 30" stroke="black" strokeWidth="6" strokeLinecap="round"/>
        <path d="M 25 80 Q 50 70, 75 80" stroke="black" strokeWidth="6" fill="transparent" strokeLinecap="round"/>
       </svg>
    </div>
  );

  const renderIcon = () => {
    switch (type) {
      case 'like': return <LikeIcon />;
      case 'love': return <LoveIcon />;
      case 'haha': return <HahaIcon />;
      case 'sad': return <SadIcon />;
      case 'angry': return <AngryIcon />;
      default: return null;
    }
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`} style={style}>
      {renderIcon()}
    </div>
  );
}
