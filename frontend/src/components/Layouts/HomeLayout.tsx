import React from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../PrimaryButton';
import ThemeToggle from '../ThemeToggle';

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-light) 100%)',
      color: 'var(--color-text)',
    }}
  >
    {/* Header */}
    <header
      style={{
        background: 'var(--color-primary)',
        color: 'var(--color-surface)',
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
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        padding: '0.75rem 0',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <Link
        to="/"
        style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
      >
        Home
      </Link>
      <Link
        to="/docs"
        style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
      >
        Documentation
      </Link>
      <Link
        to="/login"
        style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
      >
        Login
      </Link>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <ThemeToggle />
        <PrimaryButton>Get Started</PrimaryButton>
      </div>
    </nav>
    <main style={{ flex: 1, padding: '2rem 0' }}>{children}</main>
    <footer
      style={{
        background: 'var(--color-primary)',
        color: 'var(--color-surface)',
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
