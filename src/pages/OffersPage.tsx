import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, DollarSign, Eye, MessageSquare, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useOfferStore, Offer } from '../stores/offerStore';
import { useGemStore } from '../stores/gemStore';
import { formatCurrency, formatDate } from '../lib/utils';
import { useAlert } from '../contexts/AlertContext';
import { motion } from 'framer-motion';

const OffersPage = () => {
  const { user } = useAuthStore();
  const { offers, acceptOffer, rejectOffer, counterOffer } = useOfferStore();
  const { getGemById } = useGemStore();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const userOffers = user.role === 'gem-owner'
    ? offers.filter(offer => offer.ownerId === user.id)
    : offers.filter(offer => offer.buyerId === user.id);
  
  const handleAcceptOffer = async (offerId: string) => {
    setIsSubmitting(true);
    
    try {
      await acceptOffer(offerId);
      showAlert('success', 'Offer accepted successfully');
    } catch (error) {
      showAlert('error', 'Failed to accept offer');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRejectOffer = async (offerId: string) => {
    setIsSubmitting(true);
    
    try {
      await rejectOffer(offerId);
      showAlert('success', 'Offer rejected');
    } catch (error) {
      showAlert('error', 'Failed to reject offer');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openCounterModal = (offer: Offer) => {
    setSelectedOffer(offer);
    setCounterAmount(offer.amount.toString());
    setIsCounterModalOpen(true);
  };
  
  const handleCounterOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOffer) return;
    
    setIsSubmitting(true);
    
    try {
      await counterOffer(selectedOffer.id, Number(counterAmount));
      showAlert('success', 'Counter offer sent successfully');
      setIsCounterModalOpen(false);
    } catch (error) {
      showAlert('error', 'Failed to send counter offer');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-neutral-100 text-neutral-800">Pending</span>;
      case 'accepted':
        return <span className="badge bg-success-100 text-success-800">Accepted</span>;
      case 'rejected':
        return <span className="badge bg-error-100 text-error-800">Rejected</span>;
      case 'countered':
        return <span className="badge bg-accent-100 text-accent-800">Countered</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display mb-2">
            {user.role === 'gem-owner' ? 'Offers Received' : 'Your Offers'}
          </h1>
          <p className="text-neutral-600">
            {user.role === 'gem-owner'
              ? 'Manage offers from potential buyers'
              : 'Track your offers on gems'}
          </p>
        </div>
        
        {userOffers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No offers yet</h2>
            <p className="text-neutral-600 mb-6">
              {user.role === 'gem-owner'
                ? "You haven't received any offers yet."
                : "You haven't made any offers yet."}
            </p>
            <Button
              onClick={() => navigate('/')}
              variant="primary"
            >
              {user.role === 'gem-owner' ? 'Post a Gem' : 'Browse Gems'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOffers.map((offer) => {
              const gem = getGemById(offer.gemId);
              
              if (!gem) return null;
              
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="p-6 md:border-r border-neutral-100">
                      <div className="aspect-square rounded-lg overflow-hidden mb-4">
                        <img
                          src={gem.images[0]}
                          alt={gem.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium mb-1">{gem.title}</h3>
                      <p className="text-sm text-neutral-500 mb-2">
                        {gem.carat} carats · {gem.color} · {gem.clarity}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-primary-600 font-medium">
                          Listed: {formatCurrency(gem.price)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/gems/${gem.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-6 col-span-2">
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium flex items-center">
                            <DollarSign className="h-4 w-4 text-accent-500 mr-1" />
                            Offer: {formatCurrency(offer.amount)}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            {user.role === 'gem-owner'
                              ? `From: ${offer.buyerName}`
                              : `To: ${gem.ownerName}`}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {formatDate(offer.createdAt)}
                          </p>
                        </div>
                        <div>
                          {getStatusBadge(offer.status)}
                          {offer.isViewingBooked && (
                            <div className="mt-2 flex items-center text-sm text-primary-600">
                              <Eye className="h-4 w-4 mr-1" />
                              Viewing booked
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {offer.message && (
                        <div className="mb-4 bg-neutral-50 p-3 rounded-md">
                          <div className="flex items-start mb-2">
                            <MessageSquare className="h-4 w-4 text-neutral-500 mr-1 mt-0.5" />
                            <span className="text-sm font-medium">Message:</span>
                          </div>
                          <p className="text-sm text-neutral-600">{offer.message}</p>
                        </div>
                      )}
                      
                      {user.role === 'gem-owner' && offer.status === 'pending' && (
                        <div className="flex space-x-3 mt-4">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleAcceptOffer(offer.id)}
                            disabled={isSubmitting}
                            leftIcon={<Check className="h-4 w-4" />}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openCounterModal(offer)}
                            disabled={isSubmitting}
                            leftIcon={<DollarSign className="h-4 w-4" />}
                          >
                            Counter
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRejectOffer(offer.id)}
                            disabled={isSubmitting}
                            leftIcon={<X className="h-4 w-4" />}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      {offer.status === 'accepted' && (
                        <div className="flex items-center mt-4 p-3 bg-success-50 text-success-700 rounded-md">
                          <Check className="h-5 w-5 mr-2" />
                          <div>
                            <p className="font-medium">Offer accepted!</p>
                            <p className="text-sm">
                              {user.role === 'gem-owner'
                                ? "You've accepted this offer. Contact information will be exchanged once the 10% deposit is paid."
                                : "Your offer has been accepted! Please pay the 10% deposit to finalize the purchase."}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {offer.status === 'rejected' && (
                        <div className="flex items-center mt-4 p-3 bg-error-50 text-error-700 rounded-md">
                          <X className="h-5 w-5 mr-2" />
                          <p>
                            {user.role === 'gem-owner'
                              ? "You've rejected this offer."
                              : "Your offer has been rejected."}
                          </p>
                        </div>
                      )}
                      
                      {offer.status === 'countered' && (
                        <div className="flex items-center mt-4 p-3 bg-accent-50 text-accent-700 rounded-md">
                          <Clock className="h-5 w-5 mr-2" />
                          <div>
                            <p className="font-medium">Counter offer received</p>
                            <p className="text-sm">
                              {user.role === 'gem-owner'
                                ? "You've sent a counter offer. Waiting for buyer's response."
                                : "The seller has countered your offer. You can make a new offer without spending additional credits."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Counter Offer Modal */}
      {isCounterModalOpen && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Make a Counter Offer</h3>
              <p className="text-neutral-600 mb-6">
                Making a counter offer will cost 1 credit. You currently have {user.credits} credits.
              </p>
              
              <form onSubmit={handleCounterOffer}>
                <div className="mb-6">
                  <label htmlFor="counterAmount" className="label block mb-1">
                    Counter Offer Amount (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="counterAmount"
                      type="number"
                      min="1"
                      step="1"
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(e.target.value)}
                      className="input pl-10 w-full"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    fullWidth
                  >
                    Send Counter Offer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCounterModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersPage;