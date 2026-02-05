
import React from 'react';
import { Note, CalendarEvent } from '../types';
import { Pin, Calendar, Clock, AlertCircle, Bookmark } from 'lucide-react';

interface StickyBoardProps {
  pinnedNotes: Note[];
  upcomingEvents: CalendarEvent[];
}

export const StickyBoard: React.FC<StickyBoardProps> = ({ pinnedNotes, upcomingEvents }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Bookmark className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sticky Board</h1>
          <p className="text-slate-500 font-medium">Important updates, pinned notes, and upcoming meetings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pinned Notes Section */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Pin className="w-5 h-5 mr-2 text-amber-500" /> Pinned Notes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pinnedNotes.map(note => (
              <div 
                key={note.id} 
                style={{ backgroundColor: note.color }}
                className="p-6 rounded-3xl shadow-sm border border-black/5 hover:rotate-1 transition-all"
              >
                <h3 className="font-bold text-slate-900 mb-2">{note.title}</h3>
                <p className="text-sm text-slate-700 line-clamp-4">{note.content}</p>
                <div className="mt-4 text-[10px] font-black text-black/30 uppercase tracking-widest">{note.timestamp}</div>
              </div>
            ))}
            {pinnedNotes.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-gray-200">
                No pinned notes yet.
              </div>
            )}
          </div>
        </section>

        {/* Meetings Section */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-teal-500" /> Upcoming Meetings
          </h2>
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start space-x-4">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{event.title}</h3>
                  <div className="flex items-center text-xs text-slate-500 mt-1 font-medium">
                    <Clock className="w-3 h-3 mr-1" /> {event.date} at {event.time}
                  </div>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{event.description}</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="py-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-gray-200">
                No meetings scheduled.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
