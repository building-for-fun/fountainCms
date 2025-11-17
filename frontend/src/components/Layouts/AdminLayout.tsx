import React from 'react';
import { useLocation, Link, useNavigate } from '@tanstack/react-router';

const adminNavItems = [
  { to: '/admin', icon: '🛠️', label: 'Dashboard' },
  { to: '/admin/users', icon: '👥', label: 'Users' },
  { to: '/admin/content-types', icon: '📦', label: 'Content Types' },
  { to: '/admin/entries', icon: '📝', label: 'Entries' },
  { to: '/admin/media', icon: '🖼️', label: 'Media' },
  { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
  { to: '/admin/roles', icon: '🔑', label: 'Roles' },
  { to: '/admin/logs', icon: '📜', label: 'Logs' },
  { to: '/admin/profile', icon: '🙍‍♂️', label: 'Profile' },
  // Add more admin routes here as needed
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication state here if needed
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav
        style={{
          width: 80,
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 0',
          minHeight: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 100,
          boxShadow: '0 0 10px rgba(0,0,0,0.05)',
        }}
      >
        {/* Logo or brand section */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'var(--color-primary)',
              color: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            A
          </div>
        </div>

        {/* Navigation items */}
        <div
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 66,
                  height: 56,
                  margin: '0.5rem 0',
                  borderRadius: 16,
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? 'var(--color-surface)' : 'var(--color-text-muted)',
                  fontSize: 24,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--color-hover)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-muted)';
                  }
                }}
              >
                <span style={{ lineHeight: 1 }}>{item.icon}</span>
                <span style={{ fontSize: 11, marginTop: 3, textAlign: 'center' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            marginBottom: '1rem',
            borderRadius: 16,
            background: 'transparent',
            color: 'var(--color-error)',
            fontSize: 22,
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,0,0,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <span>🚪</span>
          <span style={{ fontSize: 11, marginTop: 3 }}>Logout</span>
        </button>
      </nav>

      <div
        style={{
          flex: 1,
          marginLeft: 80,
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
