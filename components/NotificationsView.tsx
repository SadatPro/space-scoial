
import React from 'react';
import { Notification } from '../types';
import { Bell, Heart, AtSign, ShoppingCart, Globe, Zap, Circle, CheckCircle2 } from 'lucide-react';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ notifications, onMarkAllRead }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'mention': return <AtSign className="w-5 h-5 text-teal-600" />;
      case 'marketplace': return <ShoppingCart className="w-5 h-5 text-indigo-500" />;
      case 'space': return <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'system': return <Globe className="w-5 h-5 text-slate-600" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-12 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Activity</h1>
          <p className="text-slate-500 font-medium">Catch up on what you've missed.</p>
        </div>
        <button 
          onClick={onMarkAllRead}
          className="flex items-center space-x-2 text-teal-600 font-black text-xs uppercase tracking-widest hover:text-teal-700 transition-colors bg-teal-50 px-4 py-2 rounded-xl"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div 
              key={notif.id}
              className={`bg-white p-6 rounded-[2.5rem] border shadow-sm flex items-start space-x-6 transition-all hover:shadow-md relative overflow-hidden group ${
                !notif.isRead ? 'border-teal-100 bg-teal-50/10' : 'border-gray-50 bg-white/50'
              }`}
            >
              {!notif.isRead && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500" />
              )}
              
              <div className="relative shrink-0">
                {notif.avatarUrl ? (
                  <img src={notif.avatarUrl} className="w-12 h-12 rounded-full shadow-sm" alt="" />
                ) : (
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                    {getIcon(notif.type)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                  <div className="w-4 h-4 flex items-center justify-center">
                    {getIcon(notif.type)}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-slate-900 ${!notif.isRead ? 'text-teal-900' : ''}`}>{notif.title}</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notif.timestamp}</span>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{notif.content}</p>
              </div>

              <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 rounded-full transition-all">
                <Circle className="w-3 h-3 text-slate-300" />
              </button>
            </div>
          ))
        ) : (
          <div className="py-24 text-center bg-white/50 rounded-[3rem] border border-dashed border-slate-200">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-lg">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
