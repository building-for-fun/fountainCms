import { Router } from 'express';

const router = Router();

const contents: Record<string, any> = {
  FEATURES_TEXT: [
    'API-first content management',
    'JAMstack ready integration',
    'Flexible content types',
    'RESTful endpoints',
    'Open-source & extensible',
  ],
  SETUP_STEPS_TEXT: [
    'Clone the repo: git clone https://github.com/building-for-fun/fountainCms',
    'Install dependencies: npm install',
    'Start the server: npm run dev',
    'Access API at http://localhost:3000/api/content',
  ],
  ACCENT_COLOR: '#6366f1',
  GETTING_STARTED: 'FountainCMS lets you manage content via APIs for JAMstack and modern web apps.',
  INSTALLATION_STEPS: [
    'Clone the repo: git clone https://github.com/building-for-fun/fountainCms',
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

/**
 * @openapi
 * /api/content:
 *   get:
 *     summary: Get all content
 *     responses:
 *       200:
 *         description: Returns all content
 *   post:
 *     summary: Create new content
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Content created
 *
 * /api/content/{key}:
 *   get:
 *     summary: Get content by key
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns content by key
 *       404:
 *         description: Not found
 */

router.get('/', (req, res) => {
  res.json(contents);
});

router.get('/:key', (req, res) => {
  const item = contents[req.params.key];
  if (item === undefined) return res.status(404).json({ message: 'Not found' });
  res.json({ [req.params.key]: item });
});

router.post('/', (req, res) => {
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

export default router;
