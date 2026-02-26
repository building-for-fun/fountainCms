import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, hasRole, login as persistLogin } from '../lib/auth';
import { fetchMe } from '../api/auth';

type Props = {
  children: React.ReactElement;
  requiredRole?: string;
};

export default function RequireAuth({ children, requiredRole }: Readonly<Props>) {
  const location = useLocation();
  const [checkingSession, setCheckingSession] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setSessionRestored(true);
      return;
    }
    setCheckingSession(true);
    fetchMe()
      .then((me) => {
        persistLogin({
          id: me.id,
          email: me.email,
          role: me.role ?? 'Super Admin',
        });
        setSessionRestored(true);
      })
      .catch(() => {
        setSessionRestored(false);
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, []);

  if (checkingSession) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <p style={{ opacity: 0.8 }}>Checking session...</p>
      </div>
    );
  }

  if (!sessionRestored && !isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
