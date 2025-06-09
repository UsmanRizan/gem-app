import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Diamond } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Diamond className="h-24 w-24 text-neutral-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-600">404</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-display mb-4">Page Not Found</h1>
          <p className="text-neutral-600 max-w-md mx-auto mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <Button
            onClick={() => navigate('/')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;