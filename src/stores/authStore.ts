import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'gem-owner' | 'gem-buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  credits: number;
  joinedAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateCredits: (newCredits: number) => void;
}

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'owner@example.com',
    password: 'password',
    role: 'gem-owner' as UserRole,
    credits: 15,
    joinedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'buyer@example.com',
    password: 'password',
    role: 'gem-buyer' as UserRole,
    credits: 20,
    joinedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin' as UserRole,
    credits: 100,
    joinedAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      
      login: async (email, password) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          set({
            isAuthenticated: true,
            user: userWithoutPassword,
          });
        } else {
          throw new Error('Invalid email or password');
        }
      },
      
      register: async (name, email, password, role) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const existingUser = mockUsers.find((u) => u.email === email);
        
        if (existingUser) {
          throw new Error('Email already exists');
        }
        
        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          role,
          credits: 10, // Start with 10 free credits
          joinedAt: new Date().toISOString(),
        };
        
        mockUsers.push({ ...newUser, password });
        
        set({
          isAuthenticated: true,
          user: newUser,
        });
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
      
      updateCredits: (newCredits) => {
        set((state) => ({
          user: state.user ? { ...state.user, credits: newCredits } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);