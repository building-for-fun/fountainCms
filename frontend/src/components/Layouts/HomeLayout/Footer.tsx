import React from 'react';

export const Footer = () => {
  return (
    <footer
  style={{
    padding: '24px 16px',
    textAlign: 'center',
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    borderTop: '1px solid var(--color-border)',
    width: '100%',
  }}
>
      © {new Date().getFullYear()} FountainCMS. All rights reserved.
    </footer>
  );
};
