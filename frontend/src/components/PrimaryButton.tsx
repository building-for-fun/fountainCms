// src/components/PrimaryButton.tsx
import React from 'react';

export function PrimaryButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        color: '#fff',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        transition: 'transform 0.14s ease',
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(1px)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
    >
      {children}
    </button>
  );
}
