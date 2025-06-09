import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useGemStore } from '../stores/gemStore';
import { formatCurrency } from '../lib/utils';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePage = () => {
  const { getApprovedGems } = useGemStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const gems = getApprovedGems();
  const filteredGems = gems.filter(gem => 
    gem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gem.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gem.color.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const nextGem = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredGems.length);
  };
  
  const prevGem = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredGems.length) % filteredGems.length);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-neutral-500">Loading premium gems...</p>
      </div>
    );
  }
  
  if (filteredGems.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, type, color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          <div className="text-center py-16">
            <h2 className="text-2xl font-display mb-4">No gems found</h2>
            <p className="text-neutral-500 mb-8">We couldn't find any gems matching your search criteria.</p>
            <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
          </div>
        </div>
      </div>
    );
  }
  
  const currentGem = filteredGems[currentIndex];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, type, color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>
        
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <span className="badge badge-primary">{currentGem.type}</span>
          </div>
          
          <div className="relative h-80 bg-neutral-100">
            <motion.img
              key={currentGem.id}
              src={currentGem.images[0]}
              alt={currentGem.title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="p-6">
            <motion.div
              key={`details-${currentGem.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-display">{currentGem.title}</h2>
                <p className="text-xl font-semibold text-primary-600">{formatCurrency(currentGem.price)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
                <div>
                  <span className="text-neutral-500">Carat:</span>{' '}
                  <span className="font-medium">{currentGem.carat}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Color:</span>{' '}
                  <span className="font-medium">{currentGem.color}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Clarity:</span>{' '}
                  <span className="font-medium">{currentGem.clarity}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Origin:</span>{' '}
                  <span className="font-medium">{currentGem.origin}</span>
                </div>
              </div>
              
              <p className="text-neutral-600 mb-6 line-clamp-2">{currentGem.description}</p>
              
              <div className="flex justify-between">
                <Link to={`/gems/${currentGem.id}`} className="btn btn-primary">
                  View Details
                </Link>
                
                <div className="flex space-x-2">
                  <span className="text-sm text-neutral-500 self-center">
                    {currentIndex + 1} of {filteredGems.length}
                  </span>
                  <button
                    onClick={prevGem}
                    className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                    aria-label="Previous gem"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextGem}
                    className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                    aria-label="Next gem"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-display mb-4">Welcome to GemMarket</h2>
        <p className="max-w-2xl mx-auto text-neutral-600 mb-8">
          The premier marketplace for rare and precious gemstones, connecting buyers and sellers in a secure environment.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse Gems</h3>
            <p className="text-neutral-600">Discover our collection of premium gemstones from around the world.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-neutral-600">Connect with reputable gem owners and make secure transactions.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m14.5 9-5 5"/><path d="m9.5 9 5 5"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Trade Safely</h3>
            <p className="text-neutral-600">Our secure platform ensures your transactions are protected at all times.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;