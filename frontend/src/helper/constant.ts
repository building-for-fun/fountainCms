export const FEATURES_TEXT = [
  'API-first content management',
  'JAMstack ready integration',
  'Flexible content types',
  'RESTful endpoints',
  'Open-source & extensible',
];

export const SETUP_STEPS_TEXT = [
  'Clone the repo: git clone https://github.com/building-for-fun/fountainCms',
  'Install dependencies: npm install',
  'Start the server: npm run dev',
  'Access API at http://localhost:4000/api/content/collections/<your-content-type>',
];

export const GETTING_STARTED = `
FountainCMS lets you manage content via REST APIs for JAMstack and modern web apps.
Content is exposed under /api/content/collections/:collection — use your content type name (e.g. posts, pages) as the collection.
Unauthenticated GET requests return published entries only. Authenticated users (JWT cookie or Bearer) and optional API tokens (Bearer or X-Api-Key, created in Admin → API tokens) can read drafts and mutate content according to permissions.
`;

export const INSTALLATION_STEPS = [
  'Clone the repo: git clone https://github.com/building-for-fun/fountainCms',
  'Install dependencies: npm install',
  'Start the server: npm run dev',
  'Access API at http://localhost:4000/api/content/collections/<your-content-type>',
];

export const API_REFERENCES = [
  {
    method: 'GET',
    endpoint: '/api/content/collections/:collection',
    description: 'List entries for a content type (e.g. posts, pages)',
  },
  {
    method: 'GET',
    endpoint: '/api/content/collections/:collection/:id',
    description: 'Get a single entry by ID',
  },
  {
    method: 'POST',
    endpoint: '/api/content/collections/:collection',
    description: 'Create a new entry',
  },
  {
    method: 'PATCH',
    endpoint: '/api/content/collections/:collection/:id',
    description: 'Update an entry',
  },
  {
    method: 'DELETE',
    endpoint: '/api/content/collections/:collection/:id',
    description: 'Delete an entry',
  },
];
