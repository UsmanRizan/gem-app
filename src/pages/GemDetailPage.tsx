import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, ExternalLink, Heart, Share2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useGemStore } from '../stores/gemStore';
import { useOfferStore } from '../stores/offerStore';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency, formatDate } from '../lib/utils';
import { useAlert } from '../contexts/AlertContext';

const GemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGemById } = useGemStore();
  const { createOffer, bookViewing, getOffersByGemId } = useOfferStore();
  const { isAuthenticated, user } = useAuthStore();
  const { showAlert } = useAlert();
  
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [viewingDate, setViewingDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const gem = id ? getGemById(id) : undefined;
  const offers = id ? getOffersByGemId(id) : [];
  
  if (!gem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display mb-4">Gem Not Found</h2>
        <p className="text-neutral-600 mb-8">The gem you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  // Check if the current user is admin
  const isAdmin = user?.role === 'admin';
  
  // Check if contact info should be shown
  const showContactInfo = isAdmin || (offers.some(o => 
    (o.buyerId === user?.id || o.ownerId === user?.id) && 
    o.status === 'accepted' && 
    o.depositPaid
  ));
  
  const handleMakeOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      showAlert('error', 'You must be logged in to make an offer');
      navigate('/auth');
      return;
    }
    
    if (user.role !== 'gem-buyer') {
      showAlert('error', 'Only gem buyers can make offers');
      return;
    }
    
    if (user.id === gem.ownerId) {
      showAlert('error', 'You cannot make an offer on your own gem');
      return;
    }
    
    if (user.credits < 1) {
      showAlert('error', 'You need at least 1 credit to make an offer');
      navigate('/buy-credits');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createOffer({
        gemId: gem.id,
        buyerId: user.id,
        buyerName: user.name,
        ownerId: gem.ownerId,
        amount: Number(offerAmount),
        message: offerMessage,
      });
      
      showAlert('success', 'Your offer has been submitted successfully');
      setIsOfferModalOpen(false);
      setOfferAmount('');
      setOfferMessage('');
    } catch (error) {
      showAlert('error', 'Failed to submit offer');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBookViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      showAlert('error', 'You must be logged in to book a viewing');
      navigate('/auth');
      return;
    }
    
    if (user.role !== 'gem-buyer') {
      showAlert('error', 'Only gem buyers can book viewings');
      return;
    }
    
    if (user.credits < 5) {
      showAlert('error', 'You need at least 5 credits to book a viewing');
      navigate('/buy-credits');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const offerId = await createOffer({
        gemId: gem.id,
        buyerId: user.id,
        buyerName: user.name,
        ownerId: gem.ownerId,
        amount: 0,
        message: `I would like to book a viewing on ${viewingDate}`,
      });
      
      await bookViewing(offerId, viewingDate);
      
      showAlert('success', 'Your viewing request has been submitted successfully');
      setIsViewingModalOpen(false);
      setViewingDate('');
    } catch (error) {
      showAlert('error', 'Failed to book viewing');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="p-6">
              <div className="relative overflow-hidden rounded-lg bg-neutral-100 mb-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={gem.images[activeImageIndex]}
                    alt={gem.title}
                    className="w-full h-80 object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </div>
              
              <div className="flex space-x-2">
                {gem.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                      index === activeImageIndex
                        ? 'border-primary-500'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${gem.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Gem Details */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-display">{gem.title}</h1>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors">
                    <Heart className="h-5 w-5 text-neutral-600" />
                  </button>
                  <button className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors">
                    <Share2 className="h-5 w-5 text-neutral-600" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <span className="text-2xl font-semibold text-primary-600">
                  {formatCurrency(gem.price)}
                </span>
                <span className="ml-2 badge badge-accent">
                  {gem.type}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-neutral-50 p-3 rounded-md">
                  <span className="text-neutral-500">Carat Weight</span>
                  <p className="font-medium">{gem.carat}</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-md">
                  <span className="text-neutral-500">Color</span>
                  <p className="font-medium">{gem.color}</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-md">
                  <span className="text-neutral-500">Clarity</span>
                  <p className="font-medium">{gem.clarity}</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-md">
                  <span className="text-neutral-500">Origin</span>
                  <p className="font-medium">{gem.origin}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-neutral-600">{gem.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Seller</h3>
                {showContactInfo ? (
                  <div className="flex items-center text-neutral-600">
                    <span>{gem.ownerName}</span>
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </div>
                ) : (
                  <div className="flex items-center text-neutral-500">
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Contact information will be available after offer acceptance and deposit payment</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {isAuthenticated && user?.role === 'gem-buyer' && user?.id !== gem.ownerId && (
                  <>
                    <Button
                      variant="primary"
                      fullWidth
                      leftIcon={<DollarSign className="h-4 w-4" />}
                      onClick={() => setIsOfferModalOpen(true)}
                    >
                      Make an Offer
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      leftIcon={<Calendar className="h-4 w-4" />}
                      onClick={() => setIsViewingModalOpen(true)}
                    >
                      Book Viewing
                    </Button>
                  </>
                )}
                
                {(!isAuthenticated || user?.id === gem.ownerId) && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => !isAuthenticated && navigate('/auth')}
                  >
                    {!isAuthenticated
                      ? 'Sign In to Make an Offer'
                      : 'This is Your Gem'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Make Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Make an Offer</h3>
              <p className="text-neutral-600 mb-6">
                Making an offer will cost 1 credit. You currently have {user?.credits} credits.
              </p>
              
              <form onSubmit={handleMakeOffer}>
                <div className="mb-4">
                  <label htmlFor="amount" className="label block mb-1">
                    Your Offer Amount (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="amount"
                      type="number"
                      min="1"
                      step="1"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      className="input pl-10 w-full"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="label block mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    className="textarea w-full"
                    placeholder="Tell the seller why you're interested"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    fullWidth
                  >
                    Submit Offer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOfferModalOpen(false)}
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
      
      {/* Book Viewing Modal */}
      {isViewingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Book a Viewing</h3>
              <p className="text-neutral-600 mb-6">
                Booking a viewing will cost 5 credits. You currently have {user?.credits} credits.
              </p>
              
              <form onSubmit={handleBookViewing}>
                <div className="mb-6">
                  <label htmlFor="date" className="label block mb-1">
                    Preferred Date and Time
                  </label>
                  <input
                    id="date"
                    type="datetime-local"
                    value={viewingDate}
                    onChange={(e) => setViewingDate(e.target.value)}
                    className="input w-full"
                    required
                  />
                </div>
                
                
                
                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    fullWidth
                  >
                    Book Viewing
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsViewingModalOpen(false)}
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

export default GemDetailPage;