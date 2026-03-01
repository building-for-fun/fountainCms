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
        'relative inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold',
        'transition-all duration-200 transform-gpu',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-transparent',

        // light mode: metallic sky-blue pill
        'bg-white/55 text-sky-900',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_12px_rgba(30,120,255,0.18)]',

        // hover bulge + polish
        'hover:-translate-y-[2px] hover:scale-[1.06]',
        'hover:shadow-[0_14px_26px_rgba(30,120,255,0.30)]',
        'active:translate-y-0 active:scale-[0.99]',

        // glossy sweep (LIGHT mode only, subtle)
        'before:content-[""] before:absolute before:inset-0 before:rounded-2xl',
        'before:pointer-events-none',
        'before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent',
        'before:opacity-0 hover:before:opacity-60',
        'dark:before:opacity-0 dark:hover:before:opacity-0', // ✅ disable shine in dark mode
        'before:transition-opacity',
        'before:mix-blend-overlay',
        'before:animate-shineSweep',
        // ✅ disable sweep in dark mode
        'dark:before:opacity-0 dark:hover:before:opacity-0',
        'before:transition-opacity',
        'before:mix-blend-overlay',
        'before:animate-shineSweep',

        // dark mode fallback
        'dark:bg-white/10 dark:text-white dark:shadow-none',
        'dark:hover:bg-white/15',
      ].join(' ')}
    >
      <span className="text-base leading-none">{mode === 'light' ? '🌙' : '☀️'}</span>
      <span className="leading-none">{mode === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
