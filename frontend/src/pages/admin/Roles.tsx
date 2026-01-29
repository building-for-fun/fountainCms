import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import CreateRoleForm from '../../components/CreateRoleForm';
import RoleCard from '../../components/RoleCard';
import {
  pageStyles,
  headerStyles,
  titleStyles,
  buttonStyles,
  cardStyles,
  inputStyles,
} from '../../lib/ui';
import { apiBaseUrl } from '../../lib/api';

interface Role {
  id: string;
  name: string;
  description: string;
}

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form states
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FETCH ROLES
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiBaseUrl}/roles`);
        if (!res.ok) {
          const text = await res.text().catch(() => 'Failed to fetch roles');
          setError(text || 'Failed to fetch roles');
          setRoles([]);
          return;
        }
        const data = await res.json();
        setRoles(data.data || []);
      } catch (err) {
        setError('Failed to load roles. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // CREATE ROLE
  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`${apiBaseUrl}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => 'Failed to create role');
        setError(text || 'Failed to create role');
        return;
      }

      const createdRole = await res.json();
      setRoles((prev) => [...prev, createdRole]);
      setNewRole({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create role. Please try again.');
      console.error('Failed to create role', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (role: Role) => {
    setEditingId(role.id);
    setEditRole({ name: role.name, description: role.description || '' });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditRole((prev) => ({ ...prev, [name]: value }));
  };

  // UPDATE ROLE
  const handleEditSave = async (id: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`${apiBaseUrl}/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editRole),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => 'Failed to update role');
        setError(text || 'Failed to update role');
        return;
      }

      const updatedRole = await res.json();
      setRoles((prev) => prev.map((role) => (role.id === id ? updatedRole : role)));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update role. Please try again.');
      console.error('Failed to update role', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditRole({ name: '', description: '' });
  };

  const handleDelete = async (id: string) => {
    const roleName = roles.find((r) => r.id === id)?.name || 'this role';
    if (
      !globalThis.confirm(
        `Are you sure you want to delete "${roleName}"? This action cannot be undone.`
      )
    )
      return;

    try {
      const res = await fetch(`${apiBaseUrl}/roles/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text().catch(() => 'Failed to delete role');
        setError(text || 'Failed to delete role');
        return;
      }

      setRoles((prev) => prev.filter((role) => role.id !== id));
    } catch (err) {
      setError('Failed to delete role. Please try again.');
      console.error('Failed to delete role', err);
    }
  };

  // Render helper to avoid nested ternaries for roles list
  const renderRolesContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>⏳</div>
          <div>Loading roles...</div>
        </div>
      );
    }

    if (roles.length === 0) {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <div
            style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              marginBottom: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            No roles found
          </div>
          <div style={{ marginBottom: '1.5rem' }}>Get started by creating your first role.</div>
          {!showCreateForm && (
            <button onClick={() => setShowCreateForm(true)} style={buttonStyles('primary')}>
              <span>➕</span>
              <span>Create Your First Role</span>
            </button>
          )}
        </div>
      );
    }

    return (
      <div>
        {roles.map((role) => (
          <RoleCard key={role.id} role={role}>
            {editingId === role.id ? (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor={`edit-role-name-${role.id}`}>
                    Role Name <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editRole.name}
                    onChange={handleEditChange}
                    id={`edit-role-name-${role.id}`}
                    style={inputStyles}
                    required
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor={`edit-role-description-${role.id}`}>Description</label>
                  <textarea
                    name="description"
                    value={editRole.description}
                    onChange={handleEditChange}
                    id={`edit-role-description-${role.id}`}
                    style={{
                      ...inputStyles,
                      minHeight: '80px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleEditCancel}
                    style={buttonStyles('secondary')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEditSave(role.id)}
                    style={buttonStyles('success')}
                    disabled={isSubmitting || !editRole.name.trim()}
                  >
                    {isSubmitting ? '⏳' : '💾'} Save
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>🛡️</span>
                    <span>{role.name}</span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.6,
                    }}
                  >
                    {role.description || (
                      <span style={{ fontStyle: 'italic', opacity: 0.6 }}>
                        No description provided
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    onClick={() => handleEditClick(role)}
                    style={{
                      ...buttonStyles('secondary'),
                      padding: '0.5rem 1rem',
                      fontSize: '0.8125rem',
                    }}
                    title="Edit role"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-primary)';
                      e.currentTarget.style.color = 'var(--color-surface)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--color-surface)';
                      e.currentTarget.style.color = 'var(--color-text)';
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    style={{
                      ...buttonStyles('danger'),
                      padding: '0.5rem 1rem',
                      fontSize: '0.8125rem',
                    }}
                    title="Delete role"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}
          </RoleCard>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div style={pageStyles}>
        {/* Header */}
        <div style={headerStyles}>
          <h1 style={titleStyles}>
            <span>🔑</span>
            <span>Roles & Permissions</span>
          </h1>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              style={buttonStyles('primary')}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>➕</span>
              <span>Create Role</span>
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: 'var(--color-error)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: 'var(--color-error)',
                cursor: 'pointer',
                fontSize: '1.25rem',
              }}
            >
              ×
            </button>
          </div>
        )}

        {showCreateForm && (
          <CreateRoleForm
            newRole={newRole}
            setNewRole={setNewRole}
            setShowCreateForm={setShowCreateForm}
            isSubmitting={isSubmitting}
            handleAddRole={handleAddRole}
            inputStyles={inputStyles}
            buttonStyles={buttonStyles}
            cardStyles={cardStyles}
          />
        )}

        {/* Roles List */}
        <div style={cardStyles}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: 0,
              }}
            >
              Existing Roles
            </h2>
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                background: 'var(--color-bg)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {roles.length} {roles.length === 1 ? 'role' : 'roles'}
            </span>
          </div>

          {renderRolesContent()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Roles;
