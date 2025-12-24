import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CustomerDashboard from './pages/CustomerDashboard';
import NewBooking from './pages/NewBooking';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children?: React.ReactNode; role?: 'customer' | 'admin' }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <StoreProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="auth" element={<AuthPage />} />
              
              {/* Customer Routes */}
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute role="customer">
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="book" 
                element={
                  <ProtectedRoute role="customer">
                    <NewBooking />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </StoreProvider>
      </AuthProvider>
    </HashRouter>
  );
}