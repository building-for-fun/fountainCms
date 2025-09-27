import React, { useEffect, useState } from 'react';
import { PRIMARY_COLOR } from '../helper/constant';
import HomeLayout from '../components/Layouts/HomeLayout';

type Content = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

type ContentsType = {
  FEATURES_TEXT: string[];
  SETUP_STEPS_TEXT: string[];
  ACCENT_COLOR: string;
  GETTING_STARTED: string;
  INSTALLATION_STEPS: string[];
  API_REFERENCES: { method: string; endpoint: string; description: string }[];
};

const LandingPage: React.FC = () => {
  const [contents, setContents] = useState<ContentsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/content')
      .then((res) => res.json())
      .then((data) => {
        setContents(data);
        setLoading(false);
      });
  }, []);

  return (
    <HomeLayout>
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
          <h1
            style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              color: PRIMARY_COLOR,
              marginBottom: '0.5rem',
              letterSpacing: '-1px',
            }}
          >
            FountainCMS
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#334155', marginBottom: '2rem' }}>
            A modern, API-driven content management system for JAMstack and beyond.
          </p>
          <h2
            style={{
              fontSize: '1.4rem',
              color: PRIMARY_COLOR,
              marginBottom: '0.5rem',
              marginTop: '2rem',
            }}
          >
            🚀 Content
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              {contents?.FEATURES_TEXT.map((feature, idx) => (
                <li
                  key={feature}
                  style={{
                    marginBottom: '0.75rem',
                    fontSize: '1.1rem',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 24,
                      height: 24,
                      background: PRIMARY_COLOR,
                      borderRadius: '50%',
                      color: '#fff',
                      textAlign: 'center',
                      marginRight: 12,
                      fontWeight: 700,
                      fontSize: '1rem',
                      lineHeight: '24px',
                    }}
                  >
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
              {contents?.GETTING_STARTED ? (
                <li
                  key={'getting started'}
                  style={{
                    marginBottom: '0.75rem',
                    fontSize: '1.1rem',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 24,
                      height: 24,
                      background: PRIMARY_COLOR,
                      borderRadius: '50%',
                      color: '#fff',
                      textAlign: 'center',
                      marginRight: 12,
                      fontWeight: 700,
                      fontSize: '1rem',
                      lineHeight: '24px',
                    }}
                  >
                    ✓
                  </span>
                  {contents?.GETTING_STARTED}
                </li>
              ) : (
                <></>
              )}
            </ul>
          )}
        </div>
      </div>
    </HomeLayout>
  );
};

export default LandingPage;
