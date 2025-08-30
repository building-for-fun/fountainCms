import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Example content storage (in-memory)
let contents: any[] = [];

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