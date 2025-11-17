import React from 'react';
import { Link } from '@tanstack/react-router';
import { PrimaryButton } from '../../PrimaryButton';
import ThemeToggle from '../../ThemeToggle';

export const Navbar = () => {
  return (
    <nav
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          alignItems: 'center',
          justifyContent: 'center',

          width: '100%',
          padding: '1rem 1.5rem',
          boxSizing: 'border-box',
        }}
      >
        <Link
          to="/"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Home
        </Link>
        <Link
          to="/docs"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
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
