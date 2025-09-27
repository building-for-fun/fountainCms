import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true,
}));
app.use(express.json());


const contents: Record<string, any> = {
  FEATURES_TEXT: [
    'API-first content management',
    'JAMstack ready integration',
    'Flexible content types',
    'RESTful endpoints',
    'Open-source & extensible',
  ],
  SETUP_STEPS_TEXT: [
    'Clone the repo: git clone https://github.com/your-org/headless-cms.git',
    'Install dependencies: npm install',
    'Start the server: npm run dev',
    'Access API at http://localhost:3000/api/content',
  ],
  ACCENT_COLOR: '#6366f1',
  GETTING_STARTED: 'Headless CMS lets you manage content via APIs for JAMstack and modern web apps.',
  INSTALLATION_STEPS: [
    'Clone the repo: git clone https://github.com/your-org/headless-cms.git',
    'Install dependencies: npm install',
    'Start the server: npm run dev',
    'Access API at http://localhost:3000/api/content',
  ],
  API_REFERENCES: [
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
};

app.get('/api/content', (req, res) => {
  res.json(contents);
});

// Get content by key
app.get('/api/content/:key', (req, res) => {
  const item = contents[req.params.key];
  if (item === undefined) return res.status(404).json({ message: 'Not found' });
  res.json({ [req.params.key]: item });
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