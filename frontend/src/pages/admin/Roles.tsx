import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

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
        if (!res.ok) throw new Error('Failed to fetch roles');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

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

      if (!res.ok) throw new Error('Failed to create role');

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

      if (!res.ok) throw new Error('Failed to update role');

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

  // DELETE ROLE
  const handleDelete = async (id: string) => {
    const roleName = roles.find((r) => r.id === id)?.name || 'this role';
    if (
      !window.confirm(
        `Are you sure you want to delete "${roleName}"? This action cannot be undone.`
      )
    )
      return;

    try {
      const res = await fetch(`${apiBaseUrl}/roles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete role');
      setRoles((prev) => prev.filter((role) => role.id !== id));
    } catch (err) {
      setError('Failed to delete role. Please try again.');
      console.error('Failed to delete role', err);
    }
  };

  const pageStyles: React.CSSProperties = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const buttonStyles = (
    variant: 'primary' | 'secondary' | 'danger' | 'success'
  ): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '0.625rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 600,
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          background: 'var(--color-primary)',
          color: 'var(--color-surface)',
        };
      case 'secondary':
        return {
          ...base,
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
        };
      case 'danger':
        return {
          ...base,
          background: 'var(--color-error)',
          color: 'var(--color-surface)',
        };
      case 'success':
        return {
          ...base,
          background: '#10b981',
          color: 'var(--color-surface)',
        };
      default:
        return base;
    }
  };

  const cardStyles: React.CSSProperties = {
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--color-border)',
    marginBottom: '1.5rem',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const roleCardStyles: React.CSSProperties = {
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    padding: '1.25rem',
    border: '1px solid var(--color-border)',
    marginBottom: '1rem',
    transition: 'all 0.2s ease',
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

        {/* Create Role Form */}
        {showCreateForm && (
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
                Create New Role
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewRole({ name: '', description: '' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '0.25rem',
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddRole}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Role Name <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newRole.name}
                  onChange={handleInputChange}
                  style={inputStyles}
                  placeholder="e.g., Administrator, Editor, Viewer"
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
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={newRole.description}
                  onChange={handleInputChange}
                  style={{
                    ...inputStyles,
                    minHeight: '100px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Describe the role's permissions and responsibilities..."
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
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewRole({ name: '', description: '' });
                  }}
                  style={buttonStyles('secondary')}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={buttonStyles('primary')}
                  disabled={isSubmitting || !newRole.name.trim()}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.opacity = '0.9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                >
                  {isSubmitting ? '⏳ Creating...' : '✅ Create Role'}
                </button>
              </div>
            </form>
          </div>
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

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <div>Loading roles...</div>
            </div>
          ) : roles.length === 0 ? (
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
          ) : (
            <div>
              {roles.map((role) => (
                <div
                  key={role.id}
                  style={roleCardStyles}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {editingId === role.id ? (
                    <div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'var(--color-text)',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Role Name <span style={{ color: 'var(--color-error)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editRole.name}
                          onChange={handleEditChange}
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
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'var(--color-text)',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editRole.description}
                          onChange={handleEditChange}
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Roles;
