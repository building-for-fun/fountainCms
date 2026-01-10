import React from 'react';
import HomeLayout from '../../components/Layouts/HomeLayout/HomeLayout';
import { FEATURES_TEXT, GETTING_STARTED } from '../../helper/constant';

export default function Landing() {
  return (
    <HomeLayout>
      <section
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '64px 16px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            fontWeight: 900,
            textAlign: 'center',
            color: 'var(--color-primary)',
          }}
        >
          FountainCMS
        </h1>

        <p
          style={{
            textAlign: 'center',
            marginTop: 16,
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            color: 'var(--color-text-secondary)',
          }}
        >
          A modern, API-driven content management system for JAMstack and beyond.
        </p>

        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>
            🚀 Content
          </h2>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              display: 'grid',
              gap: 16,
            }}
          >
            {FEATURES_TEXT.map((feature) => (
              <li
                key={feature}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    minWidth: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  ✓
                </span>
                <span style={{ lineHeight: 1.5 }}>{feature}</span>
              </li>
            ))}

            {GETTING_STARTED && (
              <li
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    minWidth: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  ✓
                </span>
                <span style={{ lineHeight: 1.5 }}>
                  {GETTING_STARTED}
                </span>
              </li>
            )}
          </ul>
        </div>
      </section>
    </HomeLayout>
  );
}
