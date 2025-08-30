import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true,
}));
app.use(express.json());

// Example content storage (in-memory)
let contents: any[] = [
  {
    id: 'FEATURES_TEXT',
    value: [
      'API-first content management',
      'JAMstack ready integration',
      'Flexible content types',
      'RESTful endpoints',
      'Open-source & extensible',
    ],
  },
  {
    id: 'SETUP_STEPS_TEXT',
    value: [
      'Clone the repo: git clone https://github.com/your-org/headless-cms.git',
      'Install dependencies: npm install',
      'Start the server: npm run dev',
      'Access API at http://localhost:3000/api/content',
    ],
  },
  {
    id: 'ACCENT_COLOR',
    value: '#6366f1',
  },
  {
    id: 'GETTING_STARTED',
    value: `Headless CMS lets you manage content via APIs for JAMstack and modern web apps.`,
  },
  {
    id: 'INSTALLATION_STEPS',
    value: [
      'Clone the repo: git clone https://github.com/your-org/headless-cms.git',
      'Install dependencies: npm install',
      'Start the server: npm run dev',
      'Access API at http://localhost:3000/api/content',
    ],
  },
  {
    id: 'API_REFERENCES',
    value: [
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
    ],
  },
];

// Get all content
app.get('/api/content', (req, res) => {
  res.json(contents);
});

// Get content by ID
app.get('/api/content/:id', (req, res) => {
  const item = contents.find(c => c.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// Create new content
app.post('/api/content', (req, res) => {
  const { title, body } = req.body;
  const newContent = {
    id: Date.now().toString(),
    title,
    body,
    createdAt: new Date().toISOString(),
  };
  contents.push(newContent);
  res.status(201).json(newContent);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Headless CMS backend running on port ${PORT}`);
});