
import { Post, User, Space, DirectMessageThread, SourceCategory, Product, Note, CalendarEvent, Notification, ExploreItem, Todo, Habit, Book, LiveSession, MessengerNote } from '../types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  handle: '@arivera',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto-format&fit=facearea&facepad=2&w=256&h=256&q=80',
  isVerified: true,
  status: 'online',
  role: 'Developer'
};

export const MOCK_USERS: User[] = [
    CURRENT_USER,
    { id: 'u2', name: 'Tech Bot', handle: '@techbot', avatarUrl: 'https://ui-avatars.com/api/?name=TB&background=000&color=fff', isVerified: true, status: 'online', role: 'AI Assistant' },
    { id: 'u3', name: 'Sarah Jenkins', handle: '@sarahj', avatarUrl: 'https://i.pravatar.cc/150?u=a3', isVerified: true, status: 'idle', role: 'Moderator' },
    { id: 'u4', name: 'Marcus Chen', handle: '@mchen', avatarUrl: 'https://i.pravatar.cc/150?u=a4', isVerified: false, status: 'dnd', role: 'Member' },
    { id: 'u5', name: 'Emily Watson', handle: '@emilyw', avatarUrl: 'https://i.pravatar.cc/150?u=a5', isVerified: true, status: 'online', role: 'Designer' }
];

export const MOCK_MESSENGER_NOTES: MessengerNote[] = [
  {
    id: 'note1',
    user: MOCK_USERS[2], // Sarah
    content: 'At the cafe ☕️',
    timestamp: '2h ago'
  },
  {
    id: 'note2',
    user: MOCK_USERS[3], // Marcus
    content: 'Working on a new feature! 🚀',
    timestamp: '5h ago'
  },
  {
    id: 'note3',
    user: MOCK_USERS[4], // Emily
    content: '🎨🖌️',
    timestamp: '8h ago'
  },
];


export const MOCK_LIVE_SESSIONS: LiveSession[] = [
  {
    id: 'live1',
    title: 'M4 Chip Teardown & Analysis',
    host: MOCK_USERS[2], // Sarah Jenkins
    type: 'live',
    viewers: 12500
  },
  {
    id: 'story1',
    title: '', // Story
    host: MOCK_USERS[4], // Emily Watson
    type: 'story',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'live3',
    title: 'Live Coding Session: Building a React Hook',
    host: CURRENT_USER,
    type: 'live',
    viewers: 4500
  },
  {
    id: 'story2',
    title: '', // Story
    host: MOCK_USERS[3], // Marcus Chen
    type: 'story',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  }
];

const SPACE_POSTS_TECH: Post[] = [
    {
      id: 'sp1',
      author: MOCK_USERS[2],
      content: 'Just saw the keynote for the new M4 chips. The performance claims are insane! Neural engine speeds are off the charts. Anyone else catch it?',
      timestamp: '2h ago',
      likes: 128,
      comments: 32,
      shares: 11,
      category: 'Tech'
    },
    {
      id: 'sp2',
      author: MOCK_USERS[4],
      content: 'Here’s a look at the new concept electric vehicle from Aura. That transparent roof is something else.',
      imageUrl: 'https://images.unsplash.com/photo-1542282088-fe84a4589da1?auto=format&fit=crop&w=800&q=80',
      timestamp: '5h ago',
      likes: 302,
      comments: 78,
      shares: 45,
      category: 'Tech'
    },
    {
        id: 'sp3',
        author: MOCK_USERS[1],
        content: 'There is a new claim that a recent solar flare event is expected to supercharge the Aurora Borealis, making it visible as far south as Alabama and central California tonight.',
        timestamp: '1d ago',
        likes: 1500,
        comments: 420,
        shares: 250,
        category: 'Science',
        factCheck: {
            summary: "This claim is verified. NOAA's Space Weather Prediction Center issued a G4 (Severe) Geomagnetic Storm Watch. This level of storm can indeed push the aurora viewing line much farther south than usual.",
            sources: [
                { title: "NOAA SWPC", uri: "https://www.swpc.noaa.gov/" },
                { title: "Space.com Coverage", uri: "https://www.space.com/" }
            ],
            status: 'verified'
        }
    }
];

const SPACE_POSTS_DEVS: Post[] = [
    {
      id: 'spd1',
      author: CURRENT_USER,
      content: "Pushing a fix for the real-time sync issue in the chat module. Should be deployed to staging in 5. Let me know if you see any more latency.",
      timestamp: '30m ago',
      likes: 15,
      comments: 4,
      shares: 1,
      category: 'Tech'
    },
];

export const MOCK_SPACES: Space[] = [
  {
    id: 's1',
    name: 'Tech Enthusiasts',
    description: 'A place for the latest in technology and gadgets.',
    members: 12400,
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    iconUrl: 'https://ui-avatars.com/api/?name=TE&background=0298db&color=fff',
    channels: [
      { id: 'ch1', name: 'general', type: 'text', messages: [{ id: 'm1', senderId: 'u2', content: 'Welcome to the tech space!', timestamp: '9:00 AM', type: 'text' }] },
      { id: 'ch2', name: 'reviews', type: 'text', messages: [] },
      { id: 'ch3', name: 'live-hangout', type: 'voice', messages: [] }
    ],
    planner: [
      { id: 'mt1', title: 'CES 2025 Deep Dive', startTime: 'In Progress', hostId: 'u3', attendeeCount: 42, isActive: true },
      { id: 'mt2', title: 'Weekly Gadget Roundup', startTime: 'Tomorrow, 10:00 AM', hostId: 'u2', attendeeCount: 0, isActive: false }
    ],
    posts: SPACE_POSTS_TECH
  },
  {
    id: 's2',
    name: 'Space Devs',
    description: 'Developers building the future of Space.',
    members: 850,
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    iconUrl: 'https://ui-avatars.com/api/?name=SD&background=0a556e&color=fff',
    channels: [],
    planner: [],
    posts: SPACE_POSTS_DEVS
  },
  {
    id: 's3',
    name: 'Creative Arts',
    description: 'Painting, digital art, and contemporary designs.',
    members: 4500,
    bannerUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecea8f82?auto=format&fit=crop&w=800&q=80',
    iconUrl: 'https://ui-avatars.com/api/?name=CA&background=f472b6&color=fff',
    channels: [],
    planner: [],
    posts: []
  },
  {
    id: 's4',
    name: 'Science Pioneers',
    description: 'Physics, biology, and chemistry research discussions.',
    members: 9200,
    bannerUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    iconUrl: 'https://ui-avatars.com/api/?name=SP&background=4f46e5&color=fff',
    channels: [],
    planner: [],
    posts: []
  },
  {
    id: 's5',
    name: 'Hobbyist Woodworking',
    description: 'Build your own furniture and crafts.',
    members: 1200,
    bannerUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    iconUrl: 'https://ui-avatars.com/api/?name=HW&background=92400e&color=fff',
    channels: [],
    planner: [],
    posts: []
  },
  {
    id: 's6',
    name: 'Space Exploration',
    description: 'All about NASA, SpaceX, and the cosmos.',
    members: 35000,
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    iconUrl: 'https://ui-avatars.com/api/?name=SE&background=1e293b&color=fff',
    channels: [],
    planner: [],
    posts: []
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'The Future of AI',
    author: 'Dr. Sarah Smith',
    coverUrl: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&w=400&h=600&q=80',
    description: 'A deep dive into how artificial intelligence will shape the next decade of human history.',
    type: 'ebook',
    price: 1499, 
    rating: 4.8,
    pages: 320,
    category: 'Technology',
    isOwned: false
  },
  {
    id: 'b2',
    title: 'Space: The Journey',
    author: 'Alex Rivera',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&h=600&q=80',
    description: 'The story behind building a decentralized social network.',
    type: 'audiobook',
    price: 0,
    rating: 5.0,
    duration: '6h 12m',
    category: 'Bio',
    isOwned: true
  },
  {
    id: 'b3',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://images.unsplash.com/photo-1543004629-142a76c50c9e?auto=format&fit=crop&w=400&h=600&q=80',
    description: 'Tiny changes, remarkable results.',
    type: 'ebook',
    price: 999,
    rating: 4.9,
    pages: 280,
    category: 'Self-Help',
    isOwned: true
  },
  {
    id: 'b4',
    title: 'Dune',
    author: 'Frank Herbert',
    coverUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=400&h=600&q=80',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.',
    type: 'audiobook',
    price: 1200,
    rating: 4.9,
    duration: '21h 2m',
    category: 'Sci-Fi',
    isOwned: false
  },
  {
    id: 'b5',
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&h=600&q=80',
    description: 'Your journey to mastery. One of the best books for coding.',
    type: 'ebook',
    price: 1800,
    rating: 4.9,
    pages: 352,
    category: 'Technology',
    isOwned: false
  }
];

export const MOCK_TODOS: Todo[] = [
  { id: 't1', text: 'Refactor Space Explore grid', completed: false, category: 'Work', date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '11:00' },
  { id: 't2', text: 'Design new branding assets', completed: true, category: 'Deep Work', date: new Date().toISOString().split('T')[0], startTime: '13:00', endTime: '15:30' },
  { id: 't3', text: 'Weekly Sync with Sarah', completed: false, category: 'Work', date: new Date().toISOString().split('T')[0], startTime: '16:00', endTime: '17:00' },
];

export const MOCK_HABITS: Habit[] = [
  { id: 'h1', name: 'Coding', icon: 'Code', completedDates: [], streak: 12, color: 'teal' },
  { id: 'h2', name: 'Reading', icon: 'BookOpen', completedDates: [], streak: 5, color: 'amber' },
  { id: 'h3', name: 'Meditation', icon: 'Zap', completedDates: [], streak: 8, color: 'indigo' },
];

export const MOCK_EXPLORE: ExploreItem[] = [
  {
    id: 'd1',
    type: 'image',
    title: 'Minimalist Workspace Setup',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    category: 'Design',
    source: { name: 'Dribbble', url: '#' },
    likes: 1200,
    views: '300k',
    commentsCount: 45,
    timestamp: '1d ago'
  },
  {
    id: 'anime1',
    type: 'anime',
    title: 'Stunning Scene from Your Name',
    description: 'A beautiful shot of the comet from the critically acclaimed anime movie "Your Name".',
    imageUrl: 'https://images.unsplash.com/photo-1582862817372-52bd5966993a?auto=format&fit=crop&w=800&q=80',
    category: 'Anime',
    source: { name: 'Crunchyroll', url: '#' },
    likes: 4800,
    views: '1.2M views',
    commentsCount: 350,
    timestamp: '5h ago'
  },
  {
    id: 'anime2',
    type: 'anime',
    title: 'Attack on Titan Final Season Hype',
    description: 'Discussion and theories about the upcoming finale of Attack on Titan.',
    imageUrl: 'https://images.unsplash.com/photo-1629814438515-995472d2b151?auto=format&fit=crop&w=800&q=80',
    category: 'Anime',
    source: { name: 'MyAnimeList', url: '#' },
    likes: 8200,
    views: '3.5M views',
    commentsCount: 1200,
    timestamp: '2d ago'
  },
  {
    id: 'coding1',
    type: 'coding',
    title: 'React Server Components Explained',
    description: 'A deep dive into how React Server Components work and how they will change the way we build apps.',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    category: 'Coding',
    source: { name: 'Vercel', url: '#' },
    likes: 3100,
    views: '500k views',
    commentsCount: 150,
    timestamp: '8h ago'
  },
  {
    id: 'games1',
    type: 'games',
    title: 'Elden Ring: Shadow of the Erdtree First Impressions',
    description: 'Reviewing the highly anticipated DLC for Elden Ring. Is it as hard as they say?',
    imageUrl: 'https://images.unsplash.com/photo-1611942385313-207a307994f7?auto=format&fit=crop&w=800&q=80',
    category: 'Games',
    source: { name: 'IGN', url: '#' },
    likes: 9500,
    views: '2.1M views',
    commentsCount: 980,
    timestamp: '1h ago'
  },
  {
    id: 'news1',
    type: 'news',
    title: 'Breakthrough in Fusion Energy Announced',
    description: 'Scientists at a national lab have achieved a net energy gain in a fusion reaction for the second time, a major milestone for clean energy.',
    imageUrl: 'https://images.unsplash.com/photo-1633123381039-33d9814438515?auto=format&fit=crop&w=800&q=80',
    category: 'News',
    source: { name: 'Reuters', url: '#' },
    likes: 12000,
    views: '4.0M views',
    commentsCount: 2300,
    timestamp: '30m ago'
  },
   {
    id: 'sports1',
    type: 'sports',
    title: 'Highlights from the Champions League Final',
    description: 'An incredible match ends with a last-minute goal. Watch the highlights here.',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    category: 'Sports',
    source: { name: 'ESPN', url: '#' },
    likes: 7600,
    views: '1.8M views',
    commentsCount: 800,
    timestamp: '1d ago'
  },
  {
    id: 'science1',
    type: 'science',
    title: 'James Webb Telescope Discovers Most Distant Galaxy Yet',
    description: 'The JWST continues to break records, finding a galaxy that existed just 290 million years after the Big Bang.',
    imageUrl: 'https://images.unsplash.com/photo-1614726343553-73d0628a5091?auto=format&fit=crop&w=800&q=80',
    category: 'Science',
    source: { name: 'NASA', url: '#' },
    likes: 25000,
    views: '6.2M views',
    commentsCount: 4500,
    timestamp: '12h ago'
  }
];

export const MOCK_SHORTS: ExploreItem[] = [
  {
    id: 's1',
    type: 'video',
    title: 'Satisfying Kinetic Sand ASMR',
    description: 'Relaxing sand cutting video.',
    imageUrl: 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=600&q=80',
    category: 'Vertical Shorts',
    source: { name: 'TikTok', url: '#' },
    likes: 45000,
    views: '1.2M',
    commentsCount: 120,
    timestamp: '1h ago'
  },
  {
    id: 's2',
    type: 'video',
    title: 'Hidden MacOS Tricks You Didnt Know',
    description: 'Productivity tips for Mac users.',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
    category: 'Vertical Shorts',
    source: { name: 'YouTube', url: '#' },
    likes: 8900,
    views: '500k',
    commentsCount: 340,
    timestamp: '3h ago'
  },
  {
    id: 's3',
    type: 'video',
    title: 'Easy 5-Min Breakfast Recipe',
    description: 'Healthy and quick morning meal.',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80',
    category: 'Vertical Shorts',
    source: { name: 'Instagram', url: '#' },
    likes: 23000,
    views: '800k',
    commentsCount: 90,
    timestamp: '5h ago'
  },
  {
    id: 's4',
    type: 'video',
    title: 'POV: You Live in Switzerland',
    description: 'Breathtaking views from the Swiss Alps.',
    imageUrl: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=600&q=80',
    category: 'Vertical Shorts',
    source: { name: 'TikTok', url: '#' },
    likes: 150000,
    views: '3.5M',
    commentsCount: 2000,
    timestamp: '1d ago'
  },
  {
    id: 's5',
    type: 'video',
    title: 'Coding Setup Transformation',
    description: 'Upgrading the developer workspace.',
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80',
    category: 'Vertical Shorts',
    source: { name: 'YouTube', url: '#' },
    likes: 6700,
    views: '200k',
    commentsCount: 85,
    timestamp: '2d ago'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'mention', title: 'Sarah Jenkins mentioned you', content: '"@arivera what do you think about the new planner UI?"', timestamp: '2m ago', isRead: false, avatarUrl: MOCK_USERS[2].avatarUrl },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p-global-1',
    author: CURRENT_USER,
    content: "Just updated the Space architecture. It feels way more like a professional collaboration hub now!",
    timestamp: 'Just now',
    likes: 42,
    reactions: { like: 30, love: 10, haha: 2, sad: 0, angry: 0 },
    comments: 12,
    shares: 2,
    category: 'Tech'
  },
  {
    id: 'p-global-2',
    author: MOCK_USERS[4],
    content: "My new workspace setup. Clean and simple. What do you all think?",
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    timestamp: '15m ago',
    likes: 256,
    comments: 48,
    shares: 10,
    category: 'Design'
  },
  {
    id: 'p-global-3',
    author: MOCK_USERS[3],
    content: 'Just read an interesting article on decentralized identity. The future is SSI! #web3',
    timestamp: '45m ago',
    likes: 98,
    comments: 22,
    shares: 5,
    category: 'Tech',
    originalSource: {
      name: 'a16z crypto',
      url: 'https://a16zcrypto.com/posts/article/an-introduction-to-self-sovereign-identity/'
    }
  },
  {
    id: 'p-global-4',
    author: MOCK_USERS[2],
    content: 'This new tutorial on state management in React is a must-watch for any frontend dev.',
    videoUrl: 'https://www.youtube.com/watch?v=Nqkdcrb_g74',
    imageUrl: 'https://img.youtube.com/vi/Nqkdcrb_g74/0.jpg',
    timestamp: '1h ago',
    likes: 150,
    comments: 30,
    shares: 20,
    category: 'Tech'
  },
  ...SPACE_POSTS_TECH, // Include space-specific posts in the main feed too
];

export const MOCK_DMS: DirectMessageThread[] = [
    {
        id: 'dm1',
        participants: [CURRENT_USER, MOCK_USERS[2]],
        user: MOCK_USERS[2],
        isGroup: false,
        lastMessage: 'Hey! Did you see the new design?',
        lastTimestamp: '10:30 AM',
        unread: true,
        messages: [
            { id: 'm1', senderId: 'u3', content: 'Hey! Did you see the new design?', timestamp: '10:30 AM', type: 'text' }
        ]
    }
];

export const MOCK_NOTES: Note[] = [
  { id: 'n1', title: 'Space Launch', content: 'Prepare all assets for the big launch!', timestamp: 'Dec 24, 2024', color: '#e0f6ff', isPinned: true },
];

export const MOCK_EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'Product Review Meeting', date: '2024-12-25', time: '14:00', endTime: '15:30', description: 'Monthly product review session.', category: 'Meeting', attendees: ['u1', 'u3'] },
  { id: 'e2', title: 'Community Social Mixer', date: '2024-12-26', time: '19:00', endTime: '21:00', description: 'Relaxed hangout with the community.', category: 'Social' }
];

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'pr1', 
    name: 'Mechanical Keyboard Z4', 
    price: '৳12900', // Updated symbol and logic
    rating: 4.8, 
    imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=500&q=80', 
    sourceName: 'Tech Shop', 
    sourceUrl: '#', 
    category: 'Tech Gadgets',
    paymentDetails: { bkashNumber: '01700000000', nagadNumber: '01900000000' }
  }
];

export const MOCK_SOURCE_CATEGORIES: SourceCategory[] = [];
export const MOCK_PRODUCTS_AI: Product[] = MOCK_PRODUCTS;
export const FALLBACK_POSTS = MOCK_POSTS;
export const MOCK_COMMUNITIES = MOCK_SPACES;
