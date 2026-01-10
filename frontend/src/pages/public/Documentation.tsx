import React from 'react';
import {
  API_REFERENCES,
  GETTING_STARTED,
  INSTALLATION_STEPS,
} from '../../helper/constant';
import HomeLayout from '../../components/Layouts/HomeLayout/HomeLayout';

const Documentation: React.FC = () => {
  return (
    <HomeLayout>
      <section
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: '64px 16px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 6vw, 3.2rem)',
            fontWeight: 900,
            color: 'var(--color-primary)',
            marginBottom: 16,
          }}
        >
          📚 Documentation
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.15rem)',
            color: 'var(--color-text-secondary)',
            marginBottom: 48,
            maxWidth: 700,
          }}
        >
          Everything you need to get started and work with FountainCMS APIs.
        </p>

        {/* GETTING STARTED */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={sectionTitle}>🚀 Getting Started</h2>

          <div
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              borderRadius: 16,
              padding: '20px 24px',
              lineHeight: 1.6,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            {GETTING_STARTED}
          </div>
        </section>

        {/* INSTALLATION */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={sectionTitle}>⚙️ Installation</h2>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              display: 'grid',
              gap: 16,
              maxWidth: 800,
            }}
          >
            {INSTALLATION_STEPS.map((step, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  color: 'var(--color-text)',
                }}
              >
                <span
                  style={{
                    minWidth: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ lineHeight: 1.6 }}>{step}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* API REFERENCE */}
        <section>
          <h2 style={sectionTitle}>🔗 API Reference</h2>

          {/* MOBILE SCROLL HINT */}
          <p
            style={{
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              marginBottom: 8,
            }}
          >
            Swipe horizontally to view the full table →
          </p>

          <div
            style={{
              overflowX: 'auto',
              borderRadius: 16,
              background: 'var(--color-surface)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            <table
              style={{
                width: '100%',
                minWidth: 600,
                borderCollapse: 'collapse',
                color: 'var(--color-text)',
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>Method</th>
                  <th style={thStyle}>Endpoint</th>
                  <th style={thStyle}>Description</th>
                </tr>
              </thead>

              <tbody>
                {API_REFERENCES.map((api, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            api.method === 'GET'
                              ? 'rgba(59,130,246,0.15)'
                              : api.method === 'POST'
                              ? 'rgba(34,197,94,0.15)'
                              : 'rgba(148,163,184,0.2)',
                          color:
                            api.method === 'GET'
                              ? '#3B82F6'
                              : api.method === 'POST'
                              ? '#22C55E'
                              : 'var(--color-text)',
                        }}
                      >
                        {api.method}
                      </span>
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        fontFamily: 'monospace',
                        fontSize: 13,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {api.endpoint}
                    </td>

                    <td style={tdStyle}>{api.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </HomeLayout>
  );
};

/* ---------- STYLES ---------- */

const sectionTitle: React.CSSProperties = {
  fontSize: '1.6rem',
  fontWeight: 800,
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: 'var(--color-text)',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '16px',
  fontWeight: 700,
  fontSize: 13,
  color: 'var(--color-primary)',
};

const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  fontSize: 14,
};

export default Documentation;
