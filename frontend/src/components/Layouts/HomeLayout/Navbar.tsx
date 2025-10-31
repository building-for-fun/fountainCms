import React from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../../PrimaryButton';
import ThemeToggle from '../../ThemeToggle';

export const Navbar = () => {
  return (
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
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
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
        <ThemeToggle />
        <Link to="/login">
          <PrimaryButton>Get Started</PrimaryButton>
        </Link>
      </div>
    </nav>
  );
};
