import React from 'react';

const features = [
  'API-first content management',
  'JAMstack ready integration',
  'Flexible content types',
  'RESTful endpoints',
  'Open-source & extensible',
];

const setupSteps = [
  'Clone the repo: git clone https://github.com/your-org/headless-cms.git',
  'Install dependencies: npm install',
  'Start the server: npm run dev',
  'Access API at http://localhost:3000/api/content',
];

const LandingPage: React.FC = () => (
  <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: 800, margin: 'auto' }}>
    <h1>Headless CMS</h1>
    <p>
      A modern, API-driven content management system for JAMstack and beyond.
    </p>
    <h2>Features</h2>
    <ul>
      {features.map(feature => (
        <li key={feature}>{feature}</li>
      ))}
    </ul>
    <h2>Installation & Setup</h2>
    <ol>
      {setupSteps.map((step, idx) => (
        <li key={idx}>{step}</li>
      ))}
    </ol>
    <h2>Documentation</h2>
    <p>
      For more details, visit our{' '}
      <a href="https://github.com/your-org/headless-cms#readme" target="_blank" rel="noopener noreferrer">
        README
      </a>.
    </p>
  </div>
);

export default LandingPage;