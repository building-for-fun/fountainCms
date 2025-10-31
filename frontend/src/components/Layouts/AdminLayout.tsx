import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

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
          width: 64,
          background: '#fff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem 0',
          minHeight: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ flex: 1, width: '100%' }}>
          {adminNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              title={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                margin: '0.5rem 0',
                borderRadius: 12,
                background: location.pathname === item.to ? '#6366f1' : 'transparent',
                color: location.pathname === item.to ? '#fff' : '#6366f1',
                fontSize: 24,
                textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              <span>{item.icon}</span>
              <span style={{ fontSize: 10, marginTop: 2 }}>{item.label}</span>
            </Link>
          ))}
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            margin: '0.5rem 0',
            borderRadius: 12,
            background: 'transparent',
            color: '#ef4444',
            fontSize: 24,
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <span>🚪</span>
          <span style={{ fontSize: 10, marginTop: 2 }}>Logout</span>
        </button>
      </nav>
      <div style={{ flex: 1, marginLeft: 64 }}>{children}</div>
    </div>
  );
}
