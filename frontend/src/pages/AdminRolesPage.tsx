import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/Layouts/AdminLayout';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

interface Role {
  id: string; // Changed to string to match UUID from Prisma
  name: string;
  description: string;
}

const AdminRolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState({ name: '', description: '' });

  // FETCH ROLES
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/roles`)
      .then((res) => res.json())
      .then((data) => {
        // Backend returns { data: Role[] }
        setRoles(data.data || []);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

  // CREATE ROLE
  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name.trim()) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole),
      });
      const createdRole = await res.json();
      setRoles((prev) => [...prev, createdRole]);
      setNewRole({ name: '', description: '' });
    } catch (err) {
      console.error('Failed to create role', err);
    }
  };

  const handleEditClick = (role: Role) => {
    setEditingId(role.id);
    setEditRole({ name: role.name, description: role.description });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditRole((prev) => ({ ...prev, [name]: value }));
  };

  // UPDATE ROLE
  const handleEditSave = async (id: string) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editRole),
      });
      const updatedRole = await res.json();

      setRoles((prev) => prev.map((role) => (role.id === id ? updatedRole : role)));
      setEditingId(null);
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  // DELETE ROLE
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await fetch(`${apiBaseUrl}/api/roles/${id}`, { method: 'DELETE' });
      setRoles((prev) => prev.filter((role) => role.id !== id));
    } catch (err) {
      console.error('Failed to delete role', err);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-8 sm:p-12">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Roles & Permissions</h1>

        {/* Create Role Form */}
        <form
          onSubmit={handleAddRole}
          className="bg-white rounded-xl shadow p-6 mb-8 border border-blue-100"
        >
          <h2 className="text-lg font-semibold mb-4">Create New Role</h2>
          <div className="mb-3">
            <label className="block font-medium mb-1">Role Name</label>
            <input
              type="text"
              name="name"
              value={newRole.name}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={newRole.description}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={2}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Add Role
          </button>
        </form>

        {/* Roles List */}
        <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
          <h2 className="text-lg font-semibold mb-4">Existing Roles</h2>
          {loading ? (
            <p>Loading...</p>
          ) : roles.length === 0 ? (
            <div className="text-gray-500">No roles found.</div>
          ) : (
            <ul className="space-y-4">
              {roles.map((role) => (
                <li
                  key={role.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 last:border-b-0 last:pb-0"
                >
                  {editingId === role.id ? (
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        type="text"
                        name="name"
                        value={editRole.name}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold"
                      />
                      <textarea
                        name="description"
                        value={editRole.description}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="font-semibold text-blue-800">{role.name}</div>
                      <div className="text-gray-600 text-sm">{role.description}</div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    {editingId === role.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(role.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(role)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(role.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRolesPage;
