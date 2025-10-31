// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fountainLight, fountainDark, FountainTheme, ThemeMode } from './fountainTheme';

type ThemeContextValue = {
  theme: FountainTheme;
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (m: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = 'fountain_theme_mode';

function applyCssVars(theme: FountainTheme) {
  const root = document.documentElement;
  const c = theme.colors;

  root.style.setProperty('--color-primary', c.primary);
  root.style.setProperty('--color-primary-light', c.primaryLight);
  root.style.setProperty('--color-accent', c.accent);
  root.style.setProperty('--color-bg', c.background);
  root.style.setProperty('--color-surface', c.surface);
  root.style.setProperty('--color-border', c.border);
  root.style.setProperty('--color-text', c.text);
  root.style.setProperty('--color-text-muted', c.textMuted);
  root.style.setProperty('--color-error', c.error);
  root.style.setProperty('--color-warning', c.warning);

  // radius
  root.style.setProperty('--radius-sm', theme.radius.sm);
  root.style.setProperty('--radius-md', theme.radius.md);
  root.style.setProperty('--radius-lg', theme.radius.lg);

  // shadows (as raw strings)
  root.style.setProperty('--shadow-sm', theme.shadow.sm);
  root.style.setProperty('--shadow-md', theme.shadow.md);

  // set data-theme attribute (helpful for CSS selectors)
  root.setAttribute('data-theme', theme.mode);

  // also toggle the `dark` class on the root to support Tailwind's
  // class-based dark mode (and any other CSS relying on a `.dark` class)
  if (theme.mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const FountainThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const initial = ((): ThemeMode => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {}
    // fallback: check prefers-color-scheme
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  })();

  const [mode, setMode] = useState<ThemeMode>(initial);

  const theme = useMemo(() => (mode === 'light' ? fountainLight : fountainDark), [mode]);

  // apply css vars on theme change
  useEffect(() => {
    applyCssVars(theme);
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch {}
  }, [theme, mode]);

  const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useFountainTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useFountainTheme must be used within FountainThemeProvider');
  return ctx;
}
