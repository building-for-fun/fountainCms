import React from 'react';
import { Link } from 'react-router-dom';

const PRIMARY_COLOR = '#6366f1';

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
    }}
  >
    {/* Header */}
    <header
      style={{
        background: PRIMARY_COLOR,
        color: '#fff',
        padding: '1.5rem 0',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-1px',
      }}
    >
      FountainCMS
    </header>
    {/* Navigation */}
    <nav
      style={{
        background: '#fff',
        boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
        padding: '0.75rem 0',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <Link to="/" style={{ color: PRIMARY_COLOR, textDecoration: 'none', fontWeight: 600 }}>
        Home
      </Link>
      <Link to="/docs" style={{ color: PRIMARY_COLOR, textDecoration: 'none', fontWeight: 600 }}>
        Documentation
      </Link>
    </nav>
    <main style={{ flex: 1, padding: '2rem 0' }}>{children}</main>
    <footer
      style={{
        background: PRIMARY_COLOR,
        color: '#fff',
        textAlign: 'center',
        padding: '1rem 0',
        fontSize: '1rem',
        marginTop: 'auto',
      }}
    >
      &copy; {new Date().getFullYear()} FountainCMS. All rights reserved.
    </footer>
  </div>
);

export default HomeLayout;
