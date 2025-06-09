import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuthStore } from '../../stores/authStore';
import { AlertProvider } from '../../contexts/AlertContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <AlertProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </AlertProvider>
  );
};

export default Layout;