
import React, { useState, useRef } from 'react';
import { User, Post } from '../types';
import { PostCard } from './PostCard';
import { Calendar, MapPin, Link as LinkIcon, Mail, Camera, Edit2, Check, X, Upload } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  posts: Post[];
  onUpdateProfile?: (user: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, posts, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'likes'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<User>(user);
  
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const userPosts = posts.filter(p => p.author.id === user.id);

  const handleSave = () => {
    if (onUpdateProfile) {
        onUpdateProfile(editForm);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'bannerUrl') => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditForm(prev => ({ ...prev, [field]: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-2xl shadow-gray-200/50 dark:shadow-none pb-20 relative transition-colors duration-500">
      
      {/* Banner */}
      <div className="h-64 w-full relative group">
        {editForm.bannerUrl ? (
          <img src={editForm.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-teal-400 to-blue-500"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
        
        {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
                <div className="bg-black/50 p-3 rounded-full text-white backdrop-blur-sm">
                    <Camera className="w-8 h-8" />
                </div>
                <input 
                    type="file" 
                    ref={bannerInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, 'bannerUrl')} 
                />
            </div>
        )}
      </div>

      {/* Profile Header Stats */}
      <div className="px-8 relative mb-8">
        <div className="flex justify-between items-end -mt-12 mb-6">
          <div className="relative group">
            <div className="w-36 h-36 rounded-full p-1 bg-white dark:bg-slate-900 shadow-xl relative overflow-hidden">
                <img 
                    src={editForm.avatarUrl} 
                    alt={editForm.name} 
                    className="w-full h-full rounded-full object-cover bg-slate-200 dark:bg-slate-800" 
                />
                {isEditing && (
                    <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                        onClick={() => avatarInputRef.current?.click()}
                    >
                        <Camera className="w-8 h-8 text-white" />
                        <input 
                            type="file" 
                            ref={avatarInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, 'avatarUrl')} 
                        />
                    </div>
                )}
            </div>
            {user.isVerified && (
              <div className="absolute bottom-2 right-2 bg-white dark:bg-slate-800 rounded-full p-1 shadow-md">
                <svg className="w-6 h-6 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="mb-2">
            {isEditing ? (
                <div className="flex space-x-2">
                    <button 
                        onClick={handleCancel}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center"
                    >
                        <X className="w-4 h-4 mr-1" /> Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 bg-teal-600 text-white rounded-full font-bold shadow-lg hover:bg-teal-500 transition-all flex items-center"
                    >
                        <Check className="w-4 h-4 mr-2" /> Save
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-full font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 hover:border-slate-900 dark:hover:border-white transition-all shadow-sm hover:shadow-lg flex items-center"
                >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                </button>
            )}
          </div>
        </div>

        <div>
          {isEditing ? (
              <div className="space-y-3 mb-4">
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="text-3xl font-extrabold text-slate-900 dark:text-white w-full bg-slate-50 dark:bg-slate-800/50 border-b-2 border-transparent focus:border-teal-500 outline-none rounded-lg px-2 py-1 transition-all"
                    placeholder="Name"
                  />
                  <input 
                    type="text" 
                    value={editForm.handle}
                    onChange={(e) => setEditForm({...editForm, handle: e.target.value})}
                    className="text-slate-500 dark:text-slate-400 font-medium text-lg w-full bg-slate-50 dark:bg-slate-800/50 border-b-2 border-transparent focus:border-teal-500 outline-none rounded-lg px-2 py-1 transition-all"
                    placeholder="@handle"
                  />
              </div>
          ) : (
              <>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center tracking-tight">
                    {user.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{user.handle}</p>
              </>
          )}
        </div>

        {isEditing ? (
            <textarea 
                value={editForm.bio || ''}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                className="mt-6 w-full text-slate-700 dark:text-slate-300 text-lg leading-relaxed bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-teal-500 outline-none rounded-xl p-3 resize-none h-32 transition-all"
                placeholder="Write your bio..."
            />
        ) : (
            <p className="mt-6 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-lg max-w-2xl">
                {user.bio || "No bio yet."}
            </p>
        )}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-gray-400" /> 
            {isEditing ? (
                <input 
                    type="text" 
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="bg-slate-50 dark:bg-slate-800/50 border-b border-transparent focus:border-teal-500 outline-none px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 w-40"
                    placeholder="Location"
                />
            ) : (
                <span>{user.location || 'San Francisco, CA'}</span>
            )}
          </div>
          <div className="flex items-center hover:text-teal-600 transition-colors cursor-pointer">
             <LinkIcon className="w-5 h-5 mr-2 text-gray-400" /> 
             {isEditing ? (
                <input 
                    type="text" 
                    value={editForm.website || ''}
                    onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                    className="bg-slate-50 dark:bg-slate-800/50 border-b border-transparent focus:border-teal-500 outline-none px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 w-48"
                    placeholder="Website URL"
                />
            ) : (
                <a href={user.website || '#'} target="_blank" rel="noreferrer">{user.website || 'space.social'}</a>
            )}
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-400" /> Joined {user.joinDate || 'September 2021'}
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6 text-base">
          <div className="hover:underline cursor-pointer group text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600">{user.following || 0}</span> Following
          </div>
           <div className="hover:underline cursor-pointer group text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600">{user.followers || 0}</span> Followers
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 md:top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 mt-4 px-4 transition-colors">
          <div className="flex space-x-8">
            {['posts', 'replies', 'media', 'likes'].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 font-bold text-sm text-center relative hover:text-teal-600 dark:hover:text-teal-400 transition-colors capitalize ${
                activeTab === tab ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                }`}
            >
                {tab}
                {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-teal-500 rounded-t-full shadow-[0_-2px_8px_rgba(20,184,166,0.5)]"></div>
                )}
            </button>
            ))}
          </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-slate-50 dark:bg-slate-950/50 min-h-[500px]">
         {userPosts.length > 0 ? (
           <div className="space-y-6">
                {userPosts.map(post => <PostCard key={post.id} post={post} />)}
           </div>
         ) : (
           <div className="text-center py-20">
             <div className="inline-block p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
                <Mail className="w-8 h-8 text-gray-300 dark:text-slate-600" />
             </div>
             <p className="text-gray-400 dark:text-slate-500 font-medium">No posts to show yet.</p>
           </div>
         )}
      </div>

    </div>
  );
};
