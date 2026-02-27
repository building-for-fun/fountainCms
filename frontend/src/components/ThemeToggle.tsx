// src/components/ThemeToggle.tsx
import React from 'react';
import { useFountainTheme } from '../theme/ThemeProvider';

export default function ThemeToggle() {
  const { mode, toggleMode } = useFountainTheme();

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label="Toggle theme"
      className={[
        // base
        'relative inline-flex items-center justify-center gap-2',
        'rounded-2xl px-3 py-2 text-sm font-semibold',
        'transition-all duration-200 transform-gpu',
        // light mode (metallic sky-blue pill)
        'bg-white/55 text-sky-900',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(30,120,255,0.18)]',
        // hover "bulge"
        'hover:-translate-y-[2px] hover:scale-[1.06]',
        'hover:shadow-[0_14px_26px_rgba(30,120,255,0.30)]',
        'active:translate-y-0 active:scale-[0.99]',
        // subtle glossy highlight
        'before:content-[""] before:absolute before:inset-0 before:rounded-2xl',
        'before:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_55%)]',
        'before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        // dark mode fallback
        'dark:bg-white/10 dark:text-white/80 dark:shadow-none',
        'dark:hover:bg-white/15 dark:hover:text-white',
      ].join(' ')}
    >
      <span className="leading-none">{mode === 'light' ? '🌙' : '☀️'}</span>
      <span className="leading-none">{mode === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
