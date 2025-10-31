import React, { useState } from 'react';
import AdminLayout from '../components/Layouts/AdminLayout';

interface Role {
  id: number;
  name: string;
  description: string;
}

const initialRoles: Role[] = [
  { id: 1, name: 'Admin', description: 'Full access to all features.' },
  { id: 2, name: 'Editor', description: 'Can edit content but not manage users.' },
  { id: 3, name: 'Viewer', description: 'Can view content only.' },
];

const AdminRolesPage = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState({ name: '', description: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name.trim()) return;
    setRoles((prev) => [
      { id: Date.now(), name: newRole.name.trim(), description: newRole.description.trim() },
      ...prev,
    ]);
    setNewRole({ name: '', description: '' });
  };

  const handleEditClick = (role: Role) => {
    setEditingId(role.id);
    setEditRole({ name: role.name, description: role.description });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditRole((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = (id: number) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === id ? { ...role, name: editRole.name, description: editRole.description } : role
      )
    );
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setRoles((prev) => prev.filter((role) => role.id !== id));
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
          {roles.length === 0 ? (
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
