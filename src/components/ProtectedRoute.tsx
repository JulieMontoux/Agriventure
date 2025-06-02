import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// composant pour protéger les différentes pages

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireVendor?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin, requireVendor }) => {
  const { user, isAdmin, isVendor } = useAuth();

  // Pas connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Accès admin seulement
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/landing-page" replace />;
  }

  // Accès vendeur seulement
  if (requireVendor && !isVendor) {
    return <Navigate to="/landing-page" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
