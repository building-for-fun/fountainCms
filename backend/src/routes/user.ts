import { Router } from 'express';

const router = Router();

// User type matching the provided structure
interface UserDetails {
  id: string;
  bookmark: any;
  user: string;
  role: any;
  collection: string;
  search: any;
  layout: string;
  layout_query: any;
  layout_options: any;
  refresh_interval: any;
  filter: any;
  icon: string;
  color: any;
}

// In-memory user store for demonstration
let users: UserDetails[] = [
  {
    id: '1',
    bookmark: null,
    user: '79df1726-6c1b-4871-832b-902ff3a9b618',
    role: null,
    collection: 'directus_users',
    search: null,
    layout: 'cards',
    layout_query: {
      cards: {
        sort: ['email'],
        page: 1,
      },
    },
    layout_options: {
      cards: {
        icon: 'account_circle',
        title: '{{ first_name }} {{ last_name }}',
        subtitle: '{{ email }}',
        size: 4,
      },
    },
    refresh_interval: null,
    filter: null,
    icon: 'bookmark',
    color: null,
  },
  {
    id: '2',
    bookmark: null,
    user: 'b2c1d2e3-f4a5-6789-0123-456789abcdef',
    role: 'admin',
    collection: 'directus_users',
    search: null,
    layout: 'cards',
    layout_query: {
      cards: {
        sort: ['name'],
        page: 2,
      },
    },
    layout_options: {
      cards: {
        icon: 'admin_panel_settings',
        title: '{{ first_name }} {{ last_name }}',
        subtitle: '{{ email }}',
        size: 4,
      },
    },
    refresh_interval: null,
    filter: null,
    icon: 'admin',
    color: '#ffcc00',
  },
];

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User management and CRUD operations
 * /api/user:
 *   get:
 *     tags: [User]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Returns all users
 *   post:
 *     tags: [User]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDetails'
 *     responses:
 *       201:
 *         description: User created
 *
 * /api/user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns user by ID
 *       404:
 *         description: Not found
 *   put:
 *     tags: [User]
 *     summary: Update user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDetails'
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [User]
 *     summary: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: Not found
 */

// Get all users
router.get('/', (req, res) => {
  // If there is at least one user, return the first user as { data: user }
  // Otherwise, return { data: null }
  if (users.length > 0) {
    res.json({ data: users[0] });
  } else {
    res.json({ data: null });
  }
});

// Create a new user
router.post('/', (req, res) => {
  const {
    id,
    bookmark = null,
    user,
    role = null,
    collection = '',
    search = null,
    layout = '',
    layout_query = {},
    layout_options = {},
    refresh_interval = null,
    filter = null,
    icon = '',
    color = null,
  } = req.body;
  const newUser: UserDetails = {
    id: id || Date.now().toString(),
    bookmark,
    user,
    role,
    collection,
    search,
    layout,
    layout_query,
    layout_options,
    refresh_interval,
    filter,
    icon,
    color,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
});

// Update user by ID
router.put('/:id', (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  Object.assign(user, req.body);
  res.json(user);
});

// Delete user by ID
router.delete('/:id', (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  users.splice(idx, 1);
  res.status(204).send();
});

export default router;
