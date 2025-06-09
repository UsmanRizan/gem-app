import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '../lib/utils';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface Alert {
  id: string;
  type: AlertType;
  message: string;
}

interface AlertContextType {
  alerts: Alert[];
  showAlert: (type: AlertType, message: string) => void;
  hideAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (type: AlertType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setAlerts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      hideAlert(id);
    }, 5000);
  };

  const hideAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert, hideAlert }}>
      {children}
      <AlertContainer />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

const AlertContainer = () => {
  const { alerts, hideAlert } = useAlert();

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2 md:right-4 md:top-4">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative flex items-center rounded-lg p-4 shadow-md',
              {
                'bg-success-50 text-success-900 border border-success-500/20': alert.type === 'success',
                'bg-error-50 text-error-900 border border-error-500/20': alert.type === 'error',
                'bg-accent-50 text-accent-900 border border-accent-500/20': alert.type === 'warning',
                'bg-primary-50 text-primary-900 border border-primary-500/20': alert.type === 'info',
              }
            )}
          >
            <div className="mr-3">
              {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-success-500" />}
              {alert.type === 'error' && <AlertCircle className="h-5 w-5 text-error-500" />}
              {alert.type === 'warning' && <AlertCircle className="h-5 w-5 text-accent-500" />}
              {alert.type === 'info' && <Info className="h-5 w-5 text-primary-500" />}
            </div>
            <div className="flex-1">{alert.message}</div>
            <button
              onClick={() => hideAlert(alert.id)}
              className="ml-3 rounded-full p-1 hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};