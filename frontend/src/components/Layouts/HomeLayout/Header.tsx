import React from 'react';
import { Navbar } from './Navbar';

export const Header = () => {
  return (
    <>
      <header
        style={{
          background: 'none',
          padding: '0rem 0',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: 'var(--color-primary)',
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-1px',
          }}
        >
          FountainCMS
        </h1>
      </header>
      <Navbar />
    </>
  );
};
