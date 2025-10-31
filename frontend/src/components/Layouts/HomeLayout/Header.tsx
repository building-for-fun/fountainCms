import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../ThemeToggle';
import { PrimaryButton } from '../../PrimaryButton';
import { Navbar } from './Navbar';

export const Header = () => {
  return (
    <>
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
      <Navbar />
    </>
  );
};
