import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered';

export interface Offer {
  id: string;
  gemId: string;
  buyerId: string;
  buyerName: string;
  ownerId: string;
  amount: number;
  message: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
  isViewingBooked: boolean;
  viewingDate?: string;
  depositPaid: boolean;
  depositDueDate?: string;
  showContactInfo: boolean;
}

interface OfferState {
  offers: Offer[];
  createOffer: (offer: Omit<Offer, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'isViewingBooked' | 'depositPaid' | 'depositDueDate' | 'showContactInfo'>) => Promise<string>;
  acceptOffer: (offerId: string) => Promise<void>;
  rejectOffer: (offerId: string) => Promise<void>;
  counterOffer: (offerId: string, amount: number) => Promise<void>;
  bookViewing: (offerId: string, date: string) => Promise<void>;
  payDeposit: (offerId: string) => Promise<void>;
  getOffersByGemId: (gemId: string) => Offer[];
  getOffersByBuyerId: (buyerId: string) => Offer[];
  getOffersByOwnerId: (ownerId: string) => Offer[];
  updateOfferContactVisibility: (offerId: string, showContact: boolean) => void;
}

// Sample offer data
const sampleOffers: Offer[] = [
  {
    id: 'offer-1',
    gemId: 'gem-1',
    buyerId: '2',
    buyerName: 'Jane Smith',
    ownerId: '1',
    amount: 7800,
    message: 'I\'m interested in this beautiful sapphire. Would you consider this offer?',
    status: 'pending',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
    isViewingBooked: false,
    depositPaid: false,
    showContactInfo: false
  },
  {
    id: 'offer-2',
    gemId: 'gem-2',
    buyerId: '2',
    buyerName: 'Jane Smith',
    ownerId: '1',
    amount: 11000,
    message: 'This ruby is exactly what I\'ve been looking for. Please consider my offer.',
    status: 'countered',
    createdAt: '2023-06-20T14:45:00Z',
    updatedAt: '2023-06-21T09:15:00Z',
    isViewingBooked: true,
    viewingDate: '2023-07-05T13:00:00Z',
    depositPaid: false,
    showContactInfo: false
  }
];

export const useOfferStore = create<OfferState>()(
  persist(
    (set, get) => ({
      offers: sampleOffers,
      
      createOffer: async (offerData) => {
        const newOffer: Offer = {
          ...offerData,
          id: `offer-${Date.now()}`,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isViewingBooked: false,
          depositPaid: false,
          showContactInfo: false
        };
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set((state) => ({
          offers: [...state.offers, newOffer],
        }));
        
        return newOffer.id;
      },
      
      acceptOffer: async (offerId) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === offerId
              ? {
                  ...offer,
                  status: 'accepted',
                  updatedAt: new Date().toISOString(),
                  depositDueDate: oneWeekFromNow.toISOString()
                }
              : offer
          ),
        }));
      },
      
      rejectOffer: async (offerId) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === offerId
              ? { ...offer, status: 'rejected', updatedAt: new Date().toISOString() }
              : offer
          ),
        }));
      },
      
      counterOffer: async (offerId, amount) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === offerId
              ? {
                  ...offer,
                  amount,
                  status: 'countered',
                  updatedAt: new Date().toISOString(),
                }
              : offer
          ),
        }));
      },
      
      bookViewing: async (offerId, date) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === offerId
              ? {
                  ...offer,
                  isViewingBooked: true,
                  viewingDate: date,
                  updatedAt: new Date().toISOString(),
                }
              : offer
          ),
        }));
      },

      payDeposit: async (offerId) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === offerId
              ? {
                  ...offer,
                  depositPaid: true,
                  showContactInfo: true,
                  updatedAt: new Date().toISOString(),
                }
              : offer
          ),
        }));
      },
      
      getOffersByGemId: (gemId) => {
        return get().offers.filter((offer) => offer.gemId === gemId);
      },
      
      getOffersByBuyerId: (buyerId) => {
        return get().offers.filter((offer) => offer.buyerId === buyerId);
      },
      
      getOffersByOwnerId: (ownerId) => {
        return get().offers.filter((offer) => offer.ownerId === ownerId);
      },

      updateOfferContactVisibility: (offerId, showContact) => {
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === offerId ? { ...offer, showContactInfo: showContact } : offer
          ),
        }));
      },
    }),
    {
      name: 'offer-storage',
    }
  )
);