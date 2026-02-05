
// FIX: Add React import for React.ReactNode type
import React from 'react';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bannerUrl?: string;
  isVerified: boolean;
  bio?: string;
  location?: string;
  website?: string;
  joinDate?: string;
  followers?: number;
  following?: number;
  language?: 'en' | 'bn';
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  role?: string;
  isHandRaised?: boolean;
}

export interface Source {
  name: string;
  url: string;
  favicon?: string;
  isVerified?: boolean;
}

export interface FactCheckResult {
  summary: string;
  sources: { title: string; uri: string }[];
  status: 'verifying' | 'verified' | 'unverified' | 'error';
}

export interface Reactions {
  like: number;
  love: number;
  haha: number;
  sad: number;
  angry: number;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likes?: number;
  replies?: Comment[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  author: User;
  timestamp: string;
  likes: number; 
  reactions?: Reactions;
  comments: number;
  commentsList?: Comment[]; // Added for functional comments
  shares: number;
  location?: string; // Added for location
  poll?: Poll; // Added for polls
  originalSource?: Source;
  isAiFlagged?: boolean; 
  category: 'News' | 'Tech' | 'Design' | 'Lifestyle' | 'General' | 'Science' | 'Finance' | 'Art' | 'Video' | 'Live';
  communityId?: string;
  factCheck?: FactCheckResult;
  importance?: 'High' | 'Medium' | 'Low'; 
  liveSessionId?: string; // Link to live session
}

export type ExploreItemType = 'image' | 'video' | 'news' | 'space' | 'coding' | 'sports' | 'tour' | 'games' | 'hobby' | 'arts' | 'crafts' | 'engineering' | 'science' | 'anime' | 'wallpaper' | 'gallery';

export interface ExploreItem {
  id: string;
  type: ExploreItemType;
  title: string;
  description?: string;
  imageUrl: string;
  videoUrl?: string;
  category: string;
  source: Source;
  likes: number;
  upvotes?: number;
  downvotes?: number;
  views?: string;
  duration?: string;
  commentsCount?: number;
  spaceId?: string;
  timestamp?: string;
  importance?: 'High' | 'Medium' | 'Low'; 
}

export type ChannelType = 'text' | 'voice' | 'announcement' | 'stage' | 'meeting' | 'video';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'audio_call' | 'video_call' | 'location';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  location?: { lat: number; lng: number; address?: string };
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  description?: string;
  messages: Message[];
  unreadCount?: number;
  members?: number;
  isPrivate?: boolean;
  allowedUserIds?: string[]; // Added for private channel access control
  bannerUrl?: string;
  posts?: Post[];
}

export interface SpacePlannerItem {
  id: string;
  title: string;
  startTime: string;
  hostId: string;
  attendeeCount: number;
  isActive: boolean;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  bannerUrl?: string;
  iconUrl?: string;
  members: number;
  channels: Channel[];
  posts: Post[];
  planner: SpacePlannerItem[];
  isJoined?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  type: 'ebook' | 'audiobook'; // ebook implies PDF/EPUB
  price: number; 
  rating: number;
  duration?: string; 
  pages?: number; 
  category: string;
  isOwned?: boolean; // New field to separate Store from Library
}

export interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  imageUrl: string;
  sourceName: string;
  sourceUrl: string;
  category: string;
  isUserListing?: boolean;
  sellerId?: string;
  status?: 'active' | 'sold' | 'pending'; // Added status
  isWishlisted?: boolean;
  condition?: 'New' | 'Used - Like New' | 'Used - Good';
  auditResult?: {
    verdict: string;
    pros: string[];
    cons: string[];
    priceAnalysis: 'Fair' | 'High' | 'Great Deal';
  };
  paymentDetails?: {
    bkashNumber?: string;
    nagadNumber?: string;
    qrCodeUrl?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  color: string;
  isPinned?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; 
  time: string; 
  endTime?: string; 
  description: string;
  category: 'Meeting' | 'Reminder' | 'Personal' | 'Event' | 'Social' | 'Workshop' | 'Travel';
  location?: string;
  attendees?: string[];
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: 'Work' | 'Health' | 'Personal' | 'Urgent' | 'Deep Work' | 'Learning' | 'Hobby' | 'Errands';
  date: string; 
  startTime?: string;
  endTime?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string; 
  completedDates: string[]; 
  streak: number;
  color: string;
}

export interface DirectMessageThread {
  id:string;
  user?: User; 
  participants: User[];
  isGroup: boolean;
  groupName?: string;
  groupIcon?: string;
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
  messages: Message[];
  isActiveCall?: 'audio' | 'video' | null;
}

export interface Notification {
  id: string;
  type: 'like' | 'mention' | 'system' | 'marketplace' | 'space';
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  avatarUrl?: string;
}

export interface LocationShare {
  userId: string;
  userName: string;
  avatarUrl: string;
  lat: number;
  lng: number;
  distance: string;
  lastActive: string;
  status?: string;
}

export interface SourceCategory {
  id: string;
  name: string;
  sources: {
    id: string;
    name: string;
    enabled: boolean;
  }[];
}

export interface CommunityMeeting {
  id: string;
  title: string;
  startTime: string;
  hostId: string;
  attendeeCount: number;
  isActive: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  bannerUrl?: string;
  iconUrl?: string;
  members: number;
  channels: Channel[];
  posts: Post[];
  meetings: CommunityMeeting[];
  isJoined?: boolean;
}

export enum ViewState {
  FEED = 'FEED',
  EXPLORE = 'EXPLORE',
  VIDEO = 'VIDEO',
  SPACES = 'SPACES',
  MESSENGER = 'MESSENGER',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  WATCH = 'WATCH',
  SHOP = 'SHOP',
  SELL = 'SELL',
  NOTEPAD = 'NOTEPAD',
  CALENDAR = 'CALENDAR',
  AI_CHAT = 'AI_CHAT',
  STICKY_BOARD = 'STICKY_BOARD',
  NOTIFICATIONS = 'NOTIFICATIONS',
  LIBRARY = 'LIBRARY',
  COLLECTION = 'COLLECTION',
  SHARE = 'SHARE'
}

export interface ExploreTopic {
  id: string;
  label: string;
  icon: React.ReactNode;
  filter: string;
  enabled: boolean;
  sources: string[];
}

export interface VideoTopic {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
}

export interface HomeFeedConfig {
  prioritizeFactChecked: boolean;
  showSubspaces: boolean;
  enableAiSynthesis: boolean;
  feedSorting: 'Recent' | 'Trending' | 'Relevant';
  discoveryMode: boolean;
  contentTypes: {
    images: boolean;
    videos: boolean;
    text: boolean;
    polls: boolean;
  };
}

export interface PrivacyConfig {
  privateProfile: boolean;
  showOnlineStatus: boolean;
  readReceipts: boolean;
  allowSearchIndexing: boolean;
  shareDataWithAI: boolean;
}

export interface FeedSynthesisResult {
  themes: string[];
  hotTake: {
    content: string;
    author: string;
  };
  deeperDive: string;
}

export interface LiveSession {
  id: string;
  title: string;
  host: User;
  viewers?: number;
  type: 'live' | 'story';
  imageUrl?: string;
}

export interface MessengerNote {
  id: string;
  user: User;
  content: string;
  timestamp: string;
}
