import type { CSSProperties } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

export const pageStyles: CSSProperties = {
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
  minHeight: '100vh',
};

export const headerStyles: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  gap: '1rem',
};

export const titleStyles: CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  color: 'var(--color-text)',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

export const buttonStyles = (variant: ButtonVariant): CSSProperties => {
  const base: CSSProperties = {
    padding: '0.625rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  switch (variant) {
    case 'primary':
      return {
        ...base,
        background: 'var(--color-primary)',
        color: 'var(--color-surface)',
      };
    case 'secondary':
      return {
        ...base,
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
      };
    case 'danger':
      return {
        ...base,
        background: 'var(--color-error)',
        color: 'var(--color-surface)',
      };
    case 'success':
      return {
        ...base,
        background: '#10b981',
        color: 'var(--color-surface)',
      };
    default:
      return base;
  }
};

export const cardStyles: CSSProperties = {
  background: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-md)',
  border: '1px solid var(--color-border)',
  marginBottom: '1.5rem',
};

export const inputStyles: CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};
