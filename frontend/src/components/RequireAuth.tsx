import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../lib/auth';

type Props = {
  children: React.ReactElement;
  requiredRole?: string;
};

export default function RequireAuth({ children, requiredRole }: Readonly<Props>) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
