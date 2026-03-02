export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        background: 'var(--color-bg)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        error: 'var(--color-error)',
      },

      borderRadius: {
        md: 'var(--radius-md)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',

        /* Metallic / premium shadows */
        metallic:
          '0 8px 25px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',

        glow:
          '0 0 20px rgba(255,255,255,0.25), 0 8px 30px rgba(0,0,0,0.4)',
      },

      /* Animations */
      keyframes: {
        shimmer: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '100%': {
            backgroundPosition: '200% 50%',
          },
        },

        floaty: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-2px)',
          },
        },

        glowPulse: {
          '0%, 100%': {
            opacity: '0.6',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.2)',
          },
        },

        shineSweep: {
          '0%': {
            transform: 'translateX(-120%)',
          },
          '100%': {
            transform: 'translateX(120%)',
          },
        },
      },

      animation: {
        shimmer: 'shimmer 2.2s linear infinite',

        floaty: 'floaty 2.4s ease-in-out infinite',

        glowPulse: 'glowPulse 1.8s ease-in-out infinite',

        shineSweep: 'shineSweep 1.6s ease-in-out infinite',
      },
    },
  },
};