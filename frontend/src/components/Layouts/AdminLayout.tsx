import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Mobile Header */}
      {isMobile && (
        <header
          style={{
            height: 60,
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18 }}>Admin</div>
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            style={{
              padding: 8,
              fontSize: 24,
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
            }}
          >
            {isMobileNavOpen ? '✕' : '☰'}
          </button>
        </header>
      )}

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <nav
          style={{
            width: 240,
            background: 'var(--color-surface)',
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem 1rem',
            position: isMobile ? 'absolute' : 'sticky',
            left: 0,
            top: isMobile ? 0 : 0,
            height: isMobile ? 'calc(100vh - 60px)' : '100vh',
            overflowY: 'auto',
            zIndex: 99,
            transform: isMobile && !isMobileNavOpen ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 0.3s ease',
            boxShadow: isMobile && isMobileNavOpen ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          {/* Logo (Desktop only) */}
          {!isMobile && (
            <div
              style={{
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                paddingLeft: 8,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--color-primary)',
                  color: 'var(--color-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                A
              </div>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Admin Panel</span>
            </div>
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => isMobile && setIsMobileNavOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? 'var(--color-surface)' : 'var(--color-text-muted)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                      e.currentTarget.style.color = 'var(--color-text)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                    }
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 14 }}>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <button
            onClick={handleLogout}
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: 'var(--color-error)',
              cursor: 'pointer',
              fontWeight: 500,
              textAlign: 'left',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            <span style={{ fontSize: 14 }}>Logout</span>
          </button>
        </nav>

        <main
          style={{
            flex: 1,
            background: 'var(--color-bg)',
            overflowX: 'hidden',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
