import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Gem {
  id: string;
  title: string;
  description: string;
  type: string;
  carat: number;
  color: string;
  clarity: string;
  origin: string;
  images: string[];
  price: number;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  isApproved: boolean;
  // New field to track if contact info should be shown
  showContactInfo: boolean;
}

interface GemState {
  gems: Gem[];
  pendingGems: Gem[];
  addGem: (gem: Omit<Gem, 'id' | 'createdAt' | 'isApproved' | 'showContactInfo'>) => Promise<string>;
  approveGem: (gemId: string) => Promise<void>;
  rejectGem: (gemId: string) => Promise<void>;
  getGemById: (gemId: string) => Gem | undefined;
  getPendingGems: () => Gem[];
  getApprovedGems: () => Gem[];
  updateGemContactVisibility: (gemId: string, showContact: boolean) => void;
}

// Sample gem data
const sampleGems: Gem[] = [
  {
    id: 'gem-1',
    title: 'Premium Blue Sapphire',
    description: 'A stunning blue sapphire with excellent clarity and color. This gemstone has been ethically sourced from Sri Lanka and has been certified by GIA.',
    type: 'Sapphire',
    carat: 3.5,
    color: 'Blue',
    clarity: 'VS1',
    origin: 'Sri Lanka',
    images: [
      'https://images.pexels.com/photos/4939546/pexels-photo-4939546.jpeg',
      'https://images.pexels.com/photos/14751300/pexels-photo-14751300.jpeg'
    ],
    price: 8500,
    ownerId: '1',
    ownerName: 'John Doe',
    createdAt: '2023-01-15T10:30:00Z',
    isApproved: true,
    showContactInfo: false
  },
  {
    id: 'gem-2',
    title: 'Natural Ruby',
    description: 'Vibrant red ruby with exceptional clarity. This gemstone has been sourced from Myanmar and has a beautiful natural color without any treatments.',
    type: 'Ruby',
    carat: 2.1,
    color: 'Red',
    clarity: 'VVS2',
    origin: 'Myanmar',
    images: [
      'https://images.pexels.com/photos/9424865/pexels-photo-9424865.jpeg',
      'https://images.pexels.com/photos/15873393/pexels-photo-15873393.jpeg'
    ],
    price: 12000,
    ownerId: '1',
    ownerName: 'John Doe',
    createdAt: '2023-02-20T14:45:00Z',
    isApproved: true,
    showContactInfo: false
  },
  {
    id: 'gem-3',
    title: 'Colombian Emerald',
    description: 'Rich green emerald with minor inclusions. This gemstone comes from the famous mines of Colombia and exhibits the classic green color that emeralds are known for.',
    type: 'Emerald',
    carat: 4.2,
    color: 'Green',
    clarity: 'SI1',
    origin: 'Colombia',
    images: [
      'https://images.pexels.com/photos/985014/pexels-photo-985014.jpeg',
      'https://images.pexels.com/photos/995172/pexels-photo-995172.jpeg'
    ],
    price: 15000,
    ownerId: '1',
    ownerName: 'John Doe',
    createdAt: '2023-03-10T09:15:00Z',
    isApproved: true,
    showContactInfo: false
  },
  {
    id: 'gem-4',
    title: 'Fancy Yellow Diamond',
    description: 'Brilliant fancy yellow diamond with excellent cut. This rare colored diamond has been certified and has exceptional brilliance and fire.',
    type: 'Diamond',
    carat: 1.8,
    color: 'Fancy Yellow',
    clarity: 'VS2',
    origin: 'South Africa',
    images: [
      'https://images.pexels.com/photos/4940760/pexels-photo-4940760.jpeg',
      'https://images.pexels.com/photos/10111307/pexels-photo-10111307.jpeg'
    ],
    price: 22000,
    ownerId: '1',
    ownerName: 'John Doe',
    createdAt: '2023-04-05T16:20:00Z',
    isApproved: true,
    showContactInfo: false
  },
  {
    id: 'gem-5',
    title: 'Tanzanite Gemstone',
    description: 'Deep blue-purple tanzanite with excellent clarity. This gemstone is from Tanzania and exhibits the beautiful blue-purple color shift that tanzanite is famous for.',
    type: 'Tanzanite',
    carat: 5.7,
    color: 'Blue-Purple',
    clarity: 'VVS1',
    origin: 'Tanzania',
    images: [
      'https://images.pexels.com/photos/19051773/pexels-photo-19051773/free-photo-of-a-blue-gemstone-on-a-white-background.jpeg',
      'https://images.pexels.com/photos/19021739/pexels-photo-19021739/free-photo-of-blue-gemstone-on-white-background.jpeg'
    ],
    price: 7500,
    ownerId: '1',
    ownerName: 'John Doe',
    createdAt: '2023-05-12T11:10:00Z',
    isApproved: false,
    showContactInfo: false
  }
];

export const useGemStore = create<GemState>()(
  persist(
    (set, get) => ({
      gems: sampleGems,
      pendingGems: [],
      
      addGem: async (gemData) => {
        const newGem: Gem = {
          ...gemData,
          id: `gem-${Date.now()}`,
          createdAt: new Date().toISOString(),
          isApproved: false,
          showContactInfo: false
        };
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set((state) => ({
          gems: [...state.gems, newGem],
        }));
        
        return newGem.id;
      },
      
      approveGem: async (gemId) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set((state) => ({
          gems: state.gems.map((gem) =>
            gem.id === gemId ? { ...gem, isApproved: true } : gem
          ),
        }));
      },
      
      rejectGem: async (gemId) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set((state) => ({
          gems: state.gems.filter((gem) => gem.id !== gemId),
        }));
      },
      
      getGemById: (gemId) => {
        return get().gems.find((gem) => gem.id === gemId);
      },
      
      getPendingGems: () => {
        return get().gems.filter((gem) => !gem.isApproved);
      },
      
      getApprovedGems: () => {
        return get().gems.filter((gem) => gem.isApproved);
      },

      updateGemContactVisibility: (gemId, showContact) => {
        set((state) => ({
          gems: state.gems.map((gem) =>
            gem.id === gemId ? { ...gem, showContactInfo: showContact } : gem
          ),
        }));
      },
    }),
    {
      name: 'gem-storage',
    }
  )
);