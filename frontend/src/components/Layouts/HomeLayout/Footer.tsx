import React from 'react';

export const Footer = () => {
  return (
    <footer
      style={{
        background: 'none',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'var(--color-text)',
        opacity: 0.7,
        textAlign: 'center',
        padding: '2rem 0',
        fontSize: '0.9rem',
        marginTop: 'auto',
      }}
    >
      &copy; {new Date().getFullYear()} FountainCMS. All rights reserved.
    </footer>
  );
};
