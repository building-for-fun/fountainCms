import React, { useEffect, useState } from 'react';
import {FEATURES_TEXT, SETUP_STEPS_TEXT, ACCENT_COLOR} from './../helper/constant';

type Content = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

const LandingPage: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('http://localhost:4000/api/content')
      .then(res => res.json())
      .then(data => {
        setContents(data);
        setLoading(false);
      });
  }, []);
  
  return (
  <div
    style={{
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      minHeight: '100vh',
      padding: '3rem 0',
    }}
  >
    <div
      style={{
        background: '#fff',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(99,102,241,0.08)',
        maxWidth: 700,
        margin: 'auto',
        padding: '2.5rem 2rem',
      }}
    >
      <h1 style={{
        fontSize: '2.8rem',
        fontWeight: 800,
        color: ACCENT_COLOR,
        marginBottom: '0.5rem',
        letterSpacing: '-1px',
      }}>
        Headless CMS
      </h1>
      <p style={{
        fontSize: '1.25rem',
        color: '#334155',
        marginBottom: '2rem',
      }}>
        A modern, API-driven content management system for JAMstack and beyond.
      </p>
      <h2 style={{
        fontSize: '1.4rem',
        color: ACCENT_COLOR,
        marginBottom: '0.5rem',
        marginTop: '2rem',
      }}>
        🚀 Features
      </h2>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        marginBottom: '2rem',
      }}>
        {FEATURES_TEXT.map(feature => (
          <li key={feature} style={{
            marginBottom: '0.75rem',
            fontSize: '1.1rem',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{
              display: 'inline-block',
              width: 24,
              height: 24,
              background: ACCENT_COLOR,
              borderRadius: '50%',
              color: '#fff',
              textAlign: 'center',
              marginRight: 12,
              fontWeight: 700,
              fontSize: '1rem',
              lineHeight: '24px',
            }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <h2 style={{
        fontSize: '1.4rem',
        color: ACCENT_COLOR,
        marginBottom: '0.5rem',
      }}>
        🛠️ Installation & Setup
      </h2>
      <ol style={{
        marginBottom: '2rem',
        paddingLeft: '1.2rem',
        color: '#475569',
        fontSize: '1.08rem',
      }}>
        {SETUP_STEPS_TEXT.map((step, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem' }}>{step}</li>
        ))}
      </ol>
      <h2 style={{
        fontSize: '1.4rem',
        color: ACCENT_COLOR,
        marginBottom: '0.5rem',
      }}>
        📚 Documentation
      </h2>
      <p style={{ fontSize: '1.08rem', color: '#334155' }}>
        For more details, visit our{' '}
        <a
          href="https://github.com/your-org/headless-cms#readme"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: ACCENT_COLOR,
            textDecoration: 'underline',
            fontWeight: 600,
          }}
        >
          README
        </a>.
      </p>
    </div>
  </div>
);
}

export default LandingPage;