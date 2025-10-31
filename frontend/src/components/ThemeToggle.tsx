// src/components/ThemeToggle.tsx
import React from 'react';
import { useFountainTheme } from '../theme/ThemeProvider';

export default function ThemeToggle() {
  const { mode, toggleMode } = useFountainTheme();
  return (
    <button
      onClick={toggleMode}
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--color-text)',
      }}
      aria-label="Toggle theme"
    >
      {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
