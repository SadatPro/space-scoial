
import React, { useState, useEffect } from 'react';
import { Post, FactCheckResult, Comment } from '../types';
import { 
  MessageCircle, 
  Share, 
  Bookmark, 
  BookmarkPlus, 
  Flame,
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  Send,
  MapPin,
  Check,
  Link2,
  ShieldAlert,
  Loader2,
  Sparkles,
  Edit3,
  Trash2,
  Play,
  Heart,
  Repeat,
  BarChart2
} from 'lucide-react';
import { CURRENT_USER } from '../services/mockData';
import { verifyPostContent } from '../services/geminiService';

interface PostCardProps {
  post: Post;
  onFactCheck?: (postId: string, result: FactCheckResult) => void;
  onSave?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string, newContent: string) => void;
  onJoinLive?: (liveSessionId: string) => void;
  isSaved?: boolean;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string, content: string) => void;
  depth?: number;
}

// Recursive Comment Component
const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onReply, 
  depth = 0 
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [likes, setLikes] = useState(comment.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    if (isLiked) {
      setLikes(l => l - 1);
      setIsLiked(false);
    } else {
      setLikes(l => l + 1);
      setIsLiked(true);
    }
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  return (
    <div className={`flex flex-col ${depth > 0 ? 'mt-4' : 'mt-0'}`}>
      <div className="flex space-x-3 group">
        <img src={comment.author.avatarUrl} className="w-8 h-8 rounded-full object-cover shrink-0" alt="" />
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{comment.author.name}</span>
              <span className="text-[10px] text-slate-400 ml-4">{comment.timestamp}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-1 ml-2">
            <button 
              onClick={toggleLike}
              className={`flex items-center space-x-1 text-[10px] font-bold transition-colors ${isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}
            >
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
              {likes > 0 && <span>{likes}</span>}
            </button>
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="text-[10px] font-bold text-slate-500 hover:text-teal-600 transition-colors"
            >
              Reply
            </button>
          </div>

          {isReplying && (
            <div className="flex items-center space-x-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="w-6 h-6 border-l-2 border-b-2 border-slate-200 rounded-bl-xl ml-2"></div>
              <input
                autoFocus
                type="text"
                placeholder={`Reply to ${comment.author.name.split(' ')[0]}...`}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-teal-500 transition-all"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
              />
              <button 
                onClick={handleSubmitReply}
                disabled={!replyContent.trim()}
                className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recursive Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800 mt-2">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onReply={onReply} 
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const PostCard: React.FC<PostCardProps> = ({ post, onFactCheck, onSave, onDelete, onEdit, onJoinLive, isSaved }) => {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [reposts, setReposts] = useState(post.shares);
  const [isReposted, setIsReposted] = useState(false);
  
  // Comment State
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>(post.commentsList || []);
  const [commentCount, setCommentCount] = useState(post.comments || 0);

  // Share/Menu State
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  // Poll State
  const [pollData, setPollData] = useState(post.poll);

  // Fact Check State
  const [isVerifying, setIsVerifying] = useState(false);
  const [checkResult, setCheckResult] = useState<FactCheckResult | undefined>(post.factCheck);

  const isOwner = post.author.id === CURRENT_USER.id;
  const isLive = post.category === 'Live';

  // Sync prop changes if post data updates externally
  useEffect(() => {
    if (post.factCheck) {
        setCheckResult(post.factCheck);
    }
    setEditContent(post.content); // Sync content if post updates
  }, [post.factCheck, post.content]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReposted) {
      setReposts(prev => prev - 1);
      setIsReposted(false);
    } else {
      setReposts(prev => prev + 1);
      setIsReposted(true);
    }
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: CURRENT_USER,
      content: commentInput,
      timestamp: 'Just now',
      likes: 0,
      replies: []
    };
    setCommentsList([...commentsList, newComment]);
    setCommentCount(prev => prev + 1);
    setCommentInput('');
  };

  // Recursive function to add a reply to the correct parent comment
  const addReplyRecursively = (comments: Comment[], parentId: string, newReply: Comment): Comment[] => {
    return comments.map(c => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      } else if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: addReplyRecursively(c.replies, parentId, newReply)
        };
      }
      return c;
    });
  };

  const handleReplySubmit = (parentId: string, content: string) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      author: CURRENT_USER,
      content: content,
      timestamp: 'Just now',
      likes: 0,
      replies: []
    };

    setCommentsList(prev => addReplyRecursively(prev, parentId, newReply));
    setCommentCount(prev => prev + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://space.social/post/${post.id}`);
    setIsCopied(true);
    setTimeout(() => {
        setIsCopied(false);
        setShowShareMenu(false);
    }, 2000);
  };

  const handleVotePoll = (optionId: string) => {
    if (!pollData || pollData.userVotedOptionId) return;
    
    const updatedOptions = pollData.options.map(opt => 
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
    );
    setPollData({
        ...pollData,
        options: updatedOptions,
        totalVotes: pollData.totalVotes + 1,
        userVotedOptionId: optionId
    });
  };

  const handleVerify = async () => {
    if (isVerifying || checkResult) return;
    setIsVerifying(true);
    try {
        const result = await verifyPostContent(post.content);
        setCheckResult(result);
        onFactCheck?.(post.id, result);
    } catch (e) {
        console.error("Verification failed", e);
    } finally {
        setIsVerifying(false);
    }
  };

  const handleSaveEdit = () => {
    if (editContent.trim() !== post.content) {
        onEdit?.(post.id, editContent);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
        onDelete?.(post.id);
    }
  };
  
  const isDirectVideo = post.videoUrl && (post.videoUrl.endsWith('.mp4') || post.videoUrl.endsWith('.webm'));
  const getEmbedUrl = (url: string): string => {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    return url;
  };
  const embedUrl = post.videoUrl ? getEmbedUrl(post.videoUrl) : '';

  return (
    <div className={`w-full bg-white dark:bg-slate-900 border mb-4 md:rounded-[2rem] hover:shadow-premium transition-all duration-500 overflow-hidden flex flex-col animate-slide-up group/card relative ${isLive ? 'border-red-500/20 dark:border-red-900/40 shadow-lg' : 'border-slate-200/60 dark:border-slate-800/60'}`}>
      
      {/* Main Content Area - Full width now */}
      <div className="p-5 md:p-7">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <img src={post.author.avatarUrl} alt="" className={`w-10 h-10 rounded-2xl object-cover ring-2 shadow-md ${isLive ? 'ring-red-500' : 'ring-white dark:ring-slate-800'}`} />
                    {isLive && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] font-black uppercase px-1.5 rounded-sm">
                            LIVE
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-sm hover:underline cursor-pointer">{post.author.name}</span>
                        {post.author.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />}
                        <span className="text-slate-400 text-xs">·</span>
                        <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{post.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                        <span className="hover:text-teal-600 cursor-pointer transition-colors">s/{post.category.toLowerCase()}</span>
                        {post.location && (
                            <>
                                <span>•</span>
                                <span className="flex items-center text-teal-600"><MapPin className="w-3 h-3 mr-0.5" />{post.location}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center space-x-1">
                {post.importance === 'High' && (
                    <div className="bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-lg border border-rose-100 dark:border-rose-900/40 flex items-center mr-2">
                        <Flame className="w-3 h-3 text-rose-500" />
                    </div>
                )}
                
                <button 
                    onClick={() => setShowActionMenu(!showActionMenu)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
                >
                    <MoreHorizontal className="w-5 h-5" />
                    {showActionMenu && (
                        <>
                            <div className="fixed inset-0 z-10 cursor-default" onClick={(e) => { e.stopPropagation(); setShowActionMenu(false); }}></div>
                            <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                {isOwner ? (
                                    <>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setShowActionMenu(false); setIsEditing(true); }}
                                            className="w-full px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-2"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            <span>Edit Post</span>
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setShowActionMenu(false); handleDelete(); }}
                                            className="w-full px-4 py-3 text-left text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-t border-gray-50 dark:border-slate-700 flex items-center space-x-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        className="w-full px-4 py-3 text-left text-xs font-bold text-slate-500 flex items-center space-x-2 cursor-not-allowed opacity-50"
                                    >
                                        <span>Report Post</span>
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </button>
            </div>
          </div>

          <div className="mb-4">
            {isEditing ? (
                <div className="space-y-3 animate-in fade-in zoom-in duration-200">
                    <textarea 
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-[17px] md:text-[18px] outline-none focus:border-teal-500 dark:focus:border-teal-500 text-slate-800 dark:text-slate-100 resize-none min-h-[120px]"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                        <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-opacity">Save</button>
                    </div>
                </div>
            ) : (
                <p className="text-slate-800 dark:text-slate-100 text-[17px] leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </p>
            )}
          </div>

          {/* AI Fact Check Result Display */}
          {checkResult && (
              <div className={`mb-4 p-4 rounded-2xl border-l-4 shadow-sm animate-in fade-in slide-in-from-top-2 ${checkResult.status === 'verified' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-500'}`}>
                  <div className="flex items-center gap-2 mb-2">
                      <Sparkles className={`w-4 h-4 fill-current ${checkResult.status === 'verified' ? 'text-emerald-600' : 'text-amber-600'}`} />
                      <h4 className={`font-black text-xs uppercase tracking-widest ${checkResult.status === 'verified' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                          Space AI Verification: {checkResult.status}
                      </h4>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">{checkResult.summary}</p>
                  {checkResult.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2">Verified Sources</p>
                          <div className="flex flex-wrap gap-2">
                              {checkResult.sources.map((source, i) => (
                                  <a 
                                      key={i} 
                                      href={source.uri} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:shadow-sm transition-all border border-slate-100 dark:border-slate-700"
                                  >
                                      <ExternalLink className="w-3 h-3" />
                                      <span className="truncate max-w-[150px]">{source.title}</span>
                                  </a>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* Poll Rendering */}
          {pollData && (
              <div className="mb-4 space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">{pollData.question}</h4>
                  {pollData.options.map(opt => {
                      const percentage = pollData.totalVotes > 0 ? Math.round((opt.votes / pollData.totalVotes) * 100) : 0;
                      const isVoted = pollData.userVotedOptionId === opt.id;
                      return (
                          <button
                              key={opt.id}
                              disabled={!!pollData.userVotedOptionId}
                              onClick={() => handleVotePoll(opt.id)}
                              className={`w-full relative h-10 rounded-xl overflow-hidden text-left text-sm font-bold transition-all ${isVoted ? 'ring-2 ring-teal-500' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                          >
                              <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700" />
                              <div 
                                  className={`absolute inset-0 transition-all duration-1000 ${isVoted ? 'bg-teal-200 dark:bg-teal-900/50' : 'bg-slate-300 dark:bg-slate-600'}`}
                                  style={{ width: `${percentage}%` }}
                              />
                              <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                                  <span className="text-slate-800 dark:text-slate-200">{opt.text}</span>
                                  {pollData.userVotedOptionId && <span className="text-slate-600 dark:text-slate-400">{percentage}%</span>}
                              </div>
                          </button>
                      );
                  })}
                  <div className="text-xs text-slate-400 font-bold text-right pt-1">{pollData.totalVotes} votes</div>
              </div>
          )}

          {(post.imageUrl || post.videoUrl) && !isEditing && (
          <div className="mb-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-inner-soft group/media relative">
              {isLive && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                      <div className="bg-red-600 text-white px-3 py-1 rounded-md font-black text-[10px] uppercase tracking-widest shadow-lg animate-pulse">
                          LIVE
                      </div>
                      <div className="bg-black/50 text-white px-3 py-1 rounded-md font-bold text-[10px] backdrop-blur-md">
                          0:00:24
                      </div>
                  </div>
              )}
              
              {post.videoUrl && !isLive ? (
              <div className="aspect-video relative">
                  {isDirectVideo ? <video src={post.videoUrl} className="w-full h-full object-contain" controls playsInline /> : <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>}
              </div>
              ) : (
              <div className="relative overflow-hidden cursor-pointer" onClick={() => isLive && post.liveSessionId && onJoinLive?.(post.liveSessionId)}>
                  <img src={post.imageUrl || post.author.avatarUrl} alt="" className={`w-full h-auto max-h-[500px] object-cover mx-auto transition-transform duration-700 group-hover/media:scale-[1.01] ${isLive ? 'aspect-video blur-sm scale-105' : ''}`} />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
                  {isLive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-black text-sm shadow-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                              <Play className="w-5 h-5 fill-current" />
                              <span>WATCH LIVE</span>
                          </button>
                      </div>
                  )}
              </div>
              )}
          </div>
          )}

          {post.originalSource && (
          <a href={post.originalSource.url} target="_blank" className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4 group/source hover:border-teal-200 transition-colors">
              <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:source:text-teal-500 transition-colors" />
              </div>
              <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Source Content</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">{post.originalSource.name}</p>
              </div>
              </div>
          </a>
          )}

          {/* Action Bar - Twitter Style */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
              {/* Comment */}
              <button 
                  onClick={() => setShowComments(!showComments)}
                  className="group flex items-center space-x-2 text-slate-500 hover:text-blue-500 transition-colors"
              >
                  <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold">{commentCount > 0 ? commentCount : ''}</span>
              </button>

              {/* Repost */}
              <button 
                  onClick={handleRepost}
                  className={`group flex items-center space-x-2 transition-colors ${isReposted ? 'text-green-500' : 'text-slate-500 hover:text-green-500'}`}
              >
                  <div className={`p-2 rounded-full transition-colors ${isReposted ? '' : 'group-hover:bg-green-50 dark:group-hover:bg-green-900/20'}`}>
                      <Repeat className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold">{reposts > 0 ? reposts : ''}</span>
              </button>

              {/* Like */}
              <button 
                  onClick={handleLike}
                  className={`group flex items-center space-x-2 transition-colors ${isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}
              >
                  <div className={`p-2 rounded-full transition-colors ${isLiked ? '' : 'group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20'}`}>
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </div>
                  <span className="text-xs font-bold">{likes > 0 ? likes : ''}</span>
              </button>

              {/* Verify / View Stats (Simulated) */}
              <button 
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className={`group flex items-center space-x-2 transition-colors ${checkResult ? (checkResult.status === 'verified' ? 'text-teal-500' : 'text-amber-500') : 'text-slate-500 hover:text-teal-500'}`}
              >
                  <div className="p-2 rounded-full group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
                      {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : checkResult ? <ShieldCheck className="w-5 h-5" /> : <BarChart2 className="w-5 h-5" />}
                  </div>
              </button>

              {/* Share */}
              <div className="relative">
                  <button 
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="group flex items-center space-x-2 text-slate-500 hover:text-teal-500 transition-colors"
                  >
                      <div className="p-2 rounded-full group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
                          <Share className="w-5 h-5" />
                      </div>
                  </button>
                  {/* Share Menu */}
                  {showShareMenu && (
                      <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)}></div>
                          <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                              <button onClick={handleShare} className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                  {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4 text-slate-400" />}
                                  <span className={`text-xs font-bold ${isCopied ? 'text-green-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                      {isCopied ? 'Link Copied!' : 'Copy Link'}
                                  </span>
                              </button>
                              <button onClick={() => onSave?.(post)} className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-t border-slate-100 dark:border-slate-700">
                                  {isSaved ? <Bookmark className="w-4 h-4 text-teal-500 fill-current" /> : <BookmarkPlus className="w-4 h-4 text-slate-400" />}
                                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                      {isSaved ? 'Saved' : 'Save Post'}
                                  </span>
                              </button>
                          </div>
                      </>
                  )}
              </div>
          </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800/50 p-5 md:p-7 animate-in slide-in-from-top-4">
            <div className="space-y-4 mb-6">
                {commentsList.length > 0 ? (
                    commentsList.map(comment => (
                        <CommentItem 
                          key={comment.id} 
                          comment={comment} 
                          onReply={handleReplySubmit} 
                        />
                    ))
                ) : (
                    <p className="text-center text-xs text-slate-400 italic py-4">No comments yet. Be the first!</p>
                )}
            </div>
            
            <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 p-2 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                <img src={CURRENT_USER.avatarUrl} className="w-8 h-8 rounded-full object-cover ml-1" alt="" />
                <input 
                    type="text" 
                    placeholder="Post your reply" 
                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                />
                <button 
                    onClick={handleCommentSubmit}
                    disabled={!commentInput.trim()}
                    className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors shadow-lg shadow-teal-500/30"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
