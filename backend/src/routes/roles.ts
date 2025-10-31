import { Router } from 'express';

const router = Router();

interface RoleDetails {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

let roles: RoleDetails[] = [
  { id: 'r1', name: 'editor', description: 'Can edit content', permissions: ['read', 'write'] },
  { id: 'r2', name: 'admin', description: 'Full access', permissions: ['read', 'write', 'delete', 'admin'] },
];

/**
 * @openapi
 * tags:
 *   - name: Roles
 *     description: Roles management and CRUD operations
 * /api/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles
 *     responses:
 *       200:
 *         description: Returns all roles
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleDetails'
 *     responses:
 *       201:
 *         description: Role created
 *
 * /api/roles/{id}:
 *   get:
 *     tags: [Roles]
 *     summary: Get role by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns role by ID
 *       404:
 *         description: Not found
 *   put:
 *     tags: [Roles]
 *     summary: Update role by ID
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
 *             $ref: '#/components/schemas/RoleDetails'
 *     responses:
 *       200:
 *         description: Role updated
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Roles]
 *     summary: Delete role by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Role deleted
 *       404:
 *         description: Not found
 */

router.get('/', (req, res) => {
  res.json({ data: roles });
});

router.post('/', (req, res) => {
  const { id, name, description = '', permissions = [] } = req.body;
  const newRole: RoleDetails = { id: id || Date.now().toString(), name, description, permissions };
  roles.push(newRole);
  res.status(201).json(newRole);
});

router.get('/:id', (req, res) => {
  const role = roles.find((r) => r.id === req.params.id);
  if (!role) return res.status(404).json({ message: 'Not found' });
  res.json(role);
});

router.put('/:id', (req, res) => {
  const role = roles.find((r) => r.id === req.params.id);
  if (!role) return res.status(404).json({ message: 'Not found' });
  Object.assign(role, req.body);
  res.json(role);
});

router.delete('/:id', (req, res) => {
  const idx = roles.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  roles.splice(idx, 1);
  res.status(204).send();
});

export default router;
