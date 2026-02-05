
import React, { useState } from 'react';
import { Note } from '../types';
import { StickyNote, Plus, Trash2, Search, X, Edit3, Check } from 'lucide-react';

interface NotepadViewProps {
  notes: Note[];
  onAddNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onUpdateNote: (note: Note) => void;
}

export const NotepadView: React.FC<NotepadViewProps> = ({ notes, onAddNote, onDeleteNote, onUpdateNote }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '' });

  const colors = ['#e0f6ff', '#f0fdf4', '#fff7ed', '#fef2f2', '#f5f3ff', '#fafafa'];

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const existing = notes.find(n => n.id === editingId);
      if (existing) {
        onUpdateNote({ ...existing, title: formData.title, content: formData.content });
      }
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: formData.title || 'Untitled Note',
        content: formData.content,
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      onAddNote(newNote);
    }
    setFormData({ title: '', content: '' });
    setIsAdding(false);
  };

  const startEdit = (note: Note) => {
    setFormData({ title: note.title, content: note.content });
    setEditingId(note.id);
    setIsAdding(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <StickyNote className="w-10 h-10 mr-4 text-amber-500" />
            Notepad
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Capture your thoughts, ideas, and lists.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative group flex-1 md:w-80">
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ title: '', content: '' }); }}
            className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-teal-600 transition-all transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">{editingId ? 'Edit Note' : 'Create New Note'}</h2>
              <button type="button" onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-50 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Title..."
              className="w-full px-0 py-2 bg-transparent text-2xl font-black text-slate-900 border-none outline-none placeholder-slate-200"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea 
              placeholder="Start typing your thoughts..."
              className="w-full min-h-[200px] p-0 bg-transparent text-lg font-medium text-slate-700 border-none outline-none resize-none placeholder-slate-200"
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
            />
            <div className="flex justify-end space-x-4">
              <button 
                type="submit"
                className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg hover:bg-teal-600 transition-all flex items-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>{editingId ? 'Save Changes' : 'Create Note'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredNotes.length === 0 ? (
        <div className="text-center py-32 bg-white/50 rounded-[3rem] border border-dashed border-slate-300">
           <StickyNote className="w-16 h-16 text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500 font-bold text-xl">No notes found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <div 
              key={note.id}
              style={{ backgroundColor: note.color }}
              className="group p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-black/5 relative flex flex-col min-h-[240px]"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-black text-slate-900 leading-tight">{note.title}</h3>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(note)} className="p-2 hover:bg-black/5 rounded-full text-slate-600 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDeleteNote(note.id)} className="p-2 hover:bg-red-500 hover:text-white rounded-full text-slate-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-slate-700 font-medium flex-1 line-clamp-6 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
              <div className="mt-6 pt-4 border-t border-black/5 text-[10px] font-black text-black/30 uppercase tracking-widest">
                {note.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
