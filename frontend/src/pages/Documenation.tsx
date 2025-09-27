import React from 'react';
import { GETTING_STARTED, INSTALLATION_STEPS, API_REFERENCES } from './../helper/constant';
import HomeLayout from '../components/Layouts/HomeLayout';

const accent = '#6366f1';

const Documentation: React.FC = () => (
  <HomeLayout>
    <div
      style={{
        maxWidth: 700,
        margin: '2rem auto',
        background: '#fff',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(99,102,241,0.08)',
        padding: '2.5rem 2rem',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <h1 style={{ color: accent, fontWeight: 800, fontSize: '2rem', marginBottom: '1rem' }}>
        📚 Documentation
      </h1>
      <h2 style={{ color: accent, fontSize: '1.2rem', marginTop: '2rem' }}>Getting Started</h2>
      <p style={{ color: '#334155', fontSize: '1.08rem', marginBottom: '1.5rem' }}>
        {GETTING_STARTED}
      </p>
      <h2 style={{ color: accent, fontSize: '1.2rem', marginTop: '2rem' }}>Installation</h2>
      <ol
        style={{
          color: '#475569',
          fontSize: '1.08rem',
          marginBottom: '1.5rem',
          paddingLeft: '1.2rem',
        }}
      >
        {INSTALLATION_STEPS.map((step, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem' }}>
            {step}
          </li>
        ))}
      </ol>
      <h2 style={{ color: accent, fontSize: '1.2rem', marginTop: '2rem' }}>API Reference</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem', color: accent }}>Method</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', color: accent }}>Endpoint</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', color: accent }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {API_REFERENCES.map((api, idx) => (
            <tr key={idx}>
              <td style={{ padding: '0.5rem', color: '#475569', fontWeight: 600 }}>{api.method}</td>
              <td style={{ padding: '0.5rem', color: '#475569', fontFamily: 'monospace' }}>
                {api.endpoint}
              </td>
              <td style={{ padding: '0.5rem', color: '#334155' }}>{api.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </HomeLayout>
);

export default Documentation;
