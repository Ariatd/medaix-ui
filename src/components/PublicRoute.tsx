import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingAnimation from './LoadingAnimation';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingAnimation message="Loading..." />
      </div>
    );
  }


  if (isAuthenticated) {
    return <Navigate to="/upload" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
