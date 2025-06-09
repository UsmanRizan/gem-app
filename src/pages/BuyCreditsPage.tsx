import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Package, Shield, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useAlert } from '../contexts/AlertContext';
import { formatCurrency } from '../lib/utils';
import { motion } from 'framer-motion';

const CREDIT_PACKAGES = [
  { id: 'basic', credits: 10, price: 100, popular: false },
  { id: 'standard', credits: 25, price: 225, popular: true },
  { id: 'premium', credits: 50, price: 400, popular: false },
];

const BuyCreditsPage = () => {
  const { user, updateCredits } = useAuthStore();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !cardName || !expiryDate || !cvc) {
      showAlert('error', 'Please fill in all card details');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const packageInfo = CREDIT_PACKAGES.find((pkg) => pkg.id === selectedPackage);
      
      if (packageInfo) {
        updateCredits(user.credits + packageInfo.credits);
        showAlert('success', `Successfully purchased ${packageInfo.credits} credits!`);
        navigate('/profile');
      }
      
      setIsProcessing(false);
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-display mb-2">Buy Credits</h1>
          <p className="text-neutral-600 max-w-xl mx-auto">
            Credits are used to post gems, make offers, and book viewings. You receive 10 free credits every week.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-6">Select a Package</h2>
            
            <div className="space-y-4">
              {CREDIT_PACKAGES.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                    selectedPackage === pkg.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-200'
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 -right-3">
                      <span className="bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium capitalize mb-1">{pkg.id} Package</h3>
                      <p className="text-neutral-600 mb-4">{pkg.credits} Credits</p>
                      <div className="flex items-center text-sm text-neutral-500 space-x-4">
                        <div className="flex items-center">
                          <Check className="w-4 h-4 text-primary-500 mr-1" />
                          <span>Make {Math.floor(pkg.credits / 1)} offers</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="w-4 h-4 text-primary-500 mr-1" />
                          <span>Book {Math.floor(pkg.credits / 5)} viewings</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-right">
                      {formatCurrency(pkg.price)}
                    </div>
                  </div>
                  
                  {selectedPackage === pkg.id && (
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2">
                      <div className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 bg-neutral-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Shield className="w-5 h-5 text-primary-600 mr-2" />
                Secure Purchase
              </h3>
              <ul className="space-y-2 text-neutral-600">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                  <span>Your payment information is encrypted and secure</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                  <span>Credits are added to your account immediately</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                  <span>All transactions are protected by our secure payment system</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
            
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <form onSubmit={handlePurchase}>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="cardNumber" className="label">
                      Card Number
                    </label>
                    <div className="flex space-x-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" className="h-6" />
                    </div>
                  </div>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="input pl-10 w-full"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="cardName" className="label block mb-1">
                    Name on Card
                  </label>
                  <input
                    id="cardName"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Smith"
                    className="input w-full"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="expiryDate" className="label block mb-1">
                      Expiry Date
                    </label>
                    <input
                      id="expiryDate"
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="label block mb-1">
                      CVC
                    </label>
                    <input
                      id="cvc"
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                      className="input w-full"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-600">Package:</span>
                    <span className="font-medium capitalize">
                      {CREDIT_PACKAGES.find((pkg) => pkg.id === selectedPackage)?.id}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-600">Credits:</span>
                    <span className="font-medium">
                      {CREDIT_PACKAGES.find((pkg) => pkg.id === selectedPackage)?.credits}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-neutral-200 mt-2">
                    <span className="font-medium">Total:</span>
                    <span className="font-semibold text-primary-600">
                      {formatCurrency(
                        CREDIT_PACKAGES.find((pkg) => pkg.id === selectedPackage)?.price || 0
                      )}
                    </span>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  isLoading={isProcessing}
                  leftIcon={<Package className="w-4 h-4" />}
                  fullWidth
                >
                  Complete Purchase
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-lg border border-neutral-200">
          <h2 className="text-xl font-semibold mb-4">How Credits Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Posting Gems</h3>
              <p className="text-neutral-600">
                Posting a gem costs 1 credit. All gems must be approved by an admin before being listed on the marketplace.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Making Offers</h3>
              <p className="text-neutral-600">
                Making an offer on a gem costs 1 credit. You can't make new offers on a gem unless the owner makes a counter offer.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <div className="w-12 h-12 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 22h2c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7c0-.5-.2-1-.6-1.4-.4-.4-.9-.6-1.4-.6h-2"/><path d="M8 22H6c-.5 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4V7c0-.5.2-1 .6-1.4C5 5.2 5.5 5 6 5h2"/><path d="M2 14h12"/><path d="M10 10h4"/><path d="M10 18h4"/></svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Booking Viewings</h3>
              <p className="text-neutral-600">
                Booking a physical viewing of a gem costs 5 credits. Viewings allow you to inspect the gem in person before making a purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCreditsPage;