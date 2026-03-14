import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* Requires login */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><div className="spinner"/></div>;

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return children;
};

/* Requires admin or superadmin role */
export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null;

  if (!user)    return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/"     replace />;

  return children;
};

/* Redirect logged-in users away from login/signup */
export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user)    return <Navigate to="/" replace />;

  return children;
};
