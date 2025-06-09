import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Diamond, ShoppingCart, User, LogOut, LogIn, CreditCard } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  
  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <Diamond className="h-8 w-8 text-primary-600" />
          <span className="font-display text-xl md:text-2xl font-semibold text-primary-950">GemMarket</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-neutral-700 hover:text-primary-600 font-medium">Home</Link>
          {isAuthenticated && user?.role === 'gem-owner' && (
            <Link to="/post-gem" className="text-neutral-700 hover:text-primary-600 font-medium">Post Gem</Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="text-neutral-700 hover:text-primary-600 font-medium">Admin</Link>
          )}
          {isAuthenticated && (
            <Link to="/offers" className="text-neutral-700 hover:text-primary-600 font-medium">Offers</Link>
          )}
        </nav>
        
        {/* Desktop Auth/Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/buy-credits\" className="flex items-center space-x-1 text-sm font-medium bg-accent-50 text-accent-700 px-3 py-1 rounded-full">
                <CreditCard className="h-4 w-4" />
                <span>{user?.credits || 0} Credits</span>
              </Link>
              <div className="relative">
                <button 
                  onClick={toggleProfile}
                  className="flex items-center space-x-1 text-neutral-700 hover:text-primary-600"
                >
                  <User className="h-5 w-5" />
                  <span>{user?.name}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isProfileOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-neutral-100"
                    >
                      <Link 
                        to="/profile" 
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 text-neutral-700 hover:text-primary-600"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-neutral-100"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-neutral-700 hover:text-primary-600 font-medium"
              >
                Home
              </Link>
              
              {isAuthenticated && user?.role === 'gem-owner' && (
                <Link 
                  to="/post-gem" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-neutral-700 hover:text-primary-600 font-medium"
                >
                  Post Gem
                </Link>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-neutral-700 hover:text-primary-600 font-medium"
                >
                  Admin
                </Link>
              )}
              
              {isAuthenticated && (
                <Link 
                  to="/offers" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-neutral-700 hover:text-primary-600 font-medium"
                >
                  Offers
                </Link>
              )}
              
              <div className="pt-2 border-t border-neutral-100">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center py-2 text-neutral-700 hover:text-primary-600 font-medium"
                    >
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </Link>
                    <Link 
                      to="/buy-credits" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center py-2 text-neutral-700 hover:text-primary-600 font-medium"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Credits: {user?.credits || 0}
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center py-2 text-neutral-700 hover:text-primary-600 font-medium w-full"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-2 text-neutral-700 hover:text-primary-600 font-medium"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;