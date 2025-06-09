import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Diamond, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useAuthStore, UserRole } from '../stores/authStore';
import { useAlert } from '../contexts/AlertContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('gem-buyer');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuthStore();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        showAlert('success', 'Successfully logged in!');
      } else {
        await register(name, email, password, role);
        showAlert('success', 'Account created successfully!');
      }
      navigate('/');
    } catch (error) {
      showAlert('error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Quick login buttons for demo purposes
  const handleQuickLogin = async (userType: 'owner' | 'buyer' | 'admin') => {
    setIsLoading(true);
    
    try {
      let email, password;
      
      switch (userType) {
        case 'owner':
          email = 'owner@example.com';
          password = 'password';
          break;
        case 'buyer':
          email = 'buyer@example.com';
          password = 'password';
          break;
        case 'admin':
          email = 'admin@example.com';
          password = 'password';
          break;
      }
      
      await login(email, password);
      showAlert('success', 'Successfully logged in!');
      navigate('/');
    } catch (error) {
      showAlert('error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Diamond className="h-12 w-12 text-primary-600" />
            </div>
            <h1 className="text-3xl font-display mb-2">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-neutral-600">
              {isLogin
                ? 'Sign in to access your account'
                : 'Join GemMarket to buy and sell premium gemstones'}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {!isLogin && (
                  <div>
                    <label htmlFor="name\" className="label block mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input w-full"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="label block mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input w-full"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="label block mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                {!isLogin && (
                  <div>
                    <label htmlFor="role" className="label block mb-1">
                      I want to:
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="select w-full"
                      required
                    >
                      <option value="gem-buyer">Buy Gems</option>
                      <option value="gem-owner">Sell Gems</option>
                    </select>
                  </div>
                )}
                
                <Button
                  type="submit"
                  isLoading={isLoading}
                  fullWidth
                  leftIcon={isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-primary-600 hover:underline text-sm"
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Sign in'}
                  </button>
                </div>
              </motion.form>
            </AnimatePresence>
            
            {isLogin && (
              <div className="mt-8 pt-6 border-t border-neutral-100">
                <p className="text-sm text-center text-neutral-500 mb-4">Demo Accounts (Quick Login)</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin('buyer')}
                    disabled={isLoading}
                  >
                    Gem Buyer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin('owner')}
                    disabled={isLoading}
                  >
                    Gem Owner
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin('admin')}
                    disabled={isLoading}
                  >
                    Admin
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;