import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // If still checking authentication status, show nothing
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  // If authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
