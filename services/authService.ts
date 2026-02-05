
import { User } from '../types';
import { MOCK_USERS } from './mockData';

const USERS_KEY = 'space_users_v1';
const SESSION_KEY = 'space_session_v1';

// Initialize mock users into local storage if empty
const initializeUsers = () => {
  const existing = localStorage.getItem(USERS_KEY);
  if (!existing) {
    // Add passwords to mock users for simulation
    const seededUsers = MOCK_USERS.map(u => ({
      ...u,
      email: `${u.handle.replace('@', '')}@space.social`, // Generate fake emails
      password: 'password' // Default password for demo
    }));
    localStorage.setItem(USERS_KEY, JSON.stringify(seededUsers));
  }
};

initializeUsers();

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (user) {
      // Remove password before saving to session
      const { password, ...safeUser } = user;
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      return safeUser;
    }
    throw new Error('Invalid email or password');
  },

  register: async (name: string, email: string, password: string, handle: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email already registered');
    }
    
    if (users.find((u: any) => u.handle === handle)) {
      throw new Error('Handle already taken');
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name,
      email,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      password, // In a real app, hash this!
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
      isVerified: false,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      followers: 0,
      following: 0,
      status: 'online' as const,
      role: 'Member'
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto login
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    
    return safeUser;
  },

  updateCurrentUser: (updatedUser: User) => {
    // Update session
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const newUsers = users.map((u: any) => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
};
