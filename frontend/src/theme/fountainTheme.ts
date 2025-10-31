export const fountainLight = {
  mode: 'light' as const,
  colors: {
    primary: '#2563EB',
    primaryLight: '#60A5FA',
    primaryDark: '#1E3A8A',
    accent: '#14B8A6',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#CBD5E1',
    text: '#0F172A',
    textMuted: '#475569',
    error: '#EF4444',
    warning: '#F59E0B',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  shadow: {
    sm: '0 1px 2px rgba(2,6,23,0.04)',
    md: '0 4px 14px rgba(2,6,23,0.06)',
  },
};

export const fountainDark = {
  mode: 'dark' as const,
  colors: {
    primary: '#60A5FA',
    primaryLight: '#A5C9FF',
    primaryDark: '#1E3A8A',
    accent: '#14B8A6',
    background: '#0F172A',
    surface: '#0B1220',
    border: '#334155',
    text: '#E2E8F0',
    textMuted: '#94A3B8',
    error: '#F87171',
    warning: '#FBBF24',
  },
  radius: fountainLight.radius,
  shadow: fountainLight.shadow,
};

// FountainTheme can be either the light or dark theme shape
export type FountainTheme = typeof fountainLight | typeof fountainDark;
export type ThemeMode = 'light' | 'dark';
