export const FEATURES_TEXT = [
  'API-first content management',
  'JAMstack ready integration',
  'Flexible content types',
  'RESTful endpoints',
  'Open-source & extensible',
];

export const SETUP_STEPS_TEXT = [
  'Clone the repo: git clone https://github.com/your-org/headless-cms.git',
  'Install dependencies: npm install',
  'Start the server: npm run dev',
  'Access API at http://localhost:3000/api/content',
];

export const ACCENT_COLOR = '#6366f1';

export const GETTING_STARTED = `
Headless CMS lets you manage content via APIs for JAMstack and modern web apps.
`;

export const INSTALLATION_STEPS = [
  'Clone the repo: git clone https://github.com/your-org/headless-cms.git',
  'Install dependencies: npm install',
  'Start the server: npm run dev',
  'Access API at http://localhost:3000/api/content',
];

export const API_REFERENCES = [
  {
    method: 'GET',
    endpoint: '/api/content',
    description: 'List all content items',
  },
  {
    method: 'GET',
    endpoint: '/api/content/:id',
    description: 'Get a single content item by ID',
  },
  {
    method: 'POST',
    endpoint: '/api/content',
    description: 'Create a new content item',
  },
];