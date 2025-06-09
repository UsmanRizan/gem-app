import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useAuthStore } from './stores/authStore';

// Lazy-loaded components
const HomePage = lazy(() => import('./pages/HomePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const GemDetailPage = lazy(() => import('./pages/GemDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const PostGemPage = lazy(() => import('./pages/PostGemPage'));
const BuyCreditsPage = lazy(() => import('./pages/BuyCreditsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Route guards
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const RoleRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: ('gem-owner' | 'gem-buyer' | 'admin')[];
}) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }
  
  return <Navigate to="/" />;
};

function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="large" /></div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/gems/:id" element={<GemDetailPage />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          
          {/* Role-specific routes */}
          <Route path="/admin" element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </RoleRoute>
          } />
          
          <Route path="/offers" element={
            <RoleRoute allowedRoles={['gem-buyer', 'gem-owner']}>
              <OffersPage />
            </RoleRoute>
          } />
          
          <Route path="/post-gem" element={
            <RoleRoute allowedRoles={['gem-owner']}>
              <PostGemPage />
            </RoleRoute>
          } />
          
          <Route path="/buy-credits" element={
            <PrivateRoute>
              <BuyCreditsPage />
            </PrivateRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;