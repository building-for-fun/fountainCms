import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { Link } from 'react-router-dom';
import type { User } from '../../types/user';
import { LoadingState, EmptyState, ErrorState } from '../../components/states';
import { PrimaryButton } from '../../components/PrimaryButton';
import { api } from '../../api/client';

interface Role {
  id: string;
  name: string;
  description?: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    roleName: '',
    isActive: true,
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api<{ data: User[] }>('/user');
      setUsers(Array.isArray(data?.data) ? data.data : []);

      if (Array.isArray(data?.data)) {
        setUsers(data.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Unable to load users. Please check your connection and try again.';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const data = await api<{ data: Role[] }>('/roles');
      setRoles(data.data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleRetry = () => {
    fetchUsers();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'isActive') {
      setNewUser((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (!newUser.username || !newUser.firstName || !newUser.lastName || !newUser.email) {
        setFormError('Please fill in all required fields');
        return;
      }

      const userData: any = {
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        isActive: newUser.isActive,
      };

      if (newUser.roleName) {
        userData.role = {
          connect: {
            name: newUser.roleName,
          },
        };
      }

      await api('/user', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      setNewUser({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        roleName: '',
        isActive: true,
      });

      setShowAddModal(false);
      await fetchUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create user. Please try again.';
      setFormError(errorMessage);
      console.error('Error creating user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormError(null);
    setNewUser({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      roleName: '',
      isActive: true,
    });
  };

  const handleDeleteUser = async (user: User) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${user.username}"? This action cannot be undone.`
      )
    ) {
      return;
    }
    setDeleteError(null);
    setDeletingId(user.id);
    try {
      await api(`/user/${user.id}`, { method: 'DELETE' });
      await fetchUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete user. Please try again.';
      setDeleteError(errorMessage);
      console.error('Error deleting user:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Shared input style (uses theme-aware CSS variables) ──────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    border: '1.5px solid var(--color-border)',
    // FIX: use --color-input-bg so inputs stay readable in both themes
    backgroundColor: 'var(--color-input-bg, var(--color-background))',
    color: 'var(--color-text)',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>Users Directory</h1>
          <PrimaryButton onClick={() => setShowAddModal(true)}>+ Add New User</PrimaryButton>
        </div>

        {/* Loading State */}
        {loading && <LoadingState message="Loading users..." />}

        {/* Error State */}
        {!loading && error && (
          <ErrorState title="Failed to Load Users" message={error} onRetry={handleRetry} />
        )}

        {/* Empty State */}
        {!loading && !error && users.length === 0 && (
          <EmptyState
            title="No Users Found"
            message="There are no users in the system yet. Users will appear here once they are created."
            icon="👥"
          />
        )}

        {/* Delete error */}
        {deleteError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              backgroundColor: 'var(--color-error)',
              color: 'var(--color-surface)',
              borderRadius: '6px',
              fontSize: '0.875rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{deleteError}</span>
            <button
              type="button"
              onClick={() => setDeleteError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '1.25rem',
                padding: '0 0.25rem',
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && users.length > 0 && (
          <div
            style={{
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              marginTop: '1.5rem',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    // FIX: use --color-surface for table header (consistent with modal)
                    background: 'var(--color-surface)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  {['Username', 'First Name', 'Last Name', 'Email', 'Role', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-muted, var(--color-text))',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <Link
                        to={`/admin/users/${user.id}`}
                        style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                      >
                        {user.username}
                      </Link>
                    </td>
                    <td style={{ padding: '10px 14px' }}>{user.firstName ?? '-'}</td>
                    <td style={{ padding: '10px 14px' }}>{user.lastName ?? '-'}</td>
                    <td style={{ padding: '10px 14px' }}>{user.email ?? '-'}</td>
                    <td style={{ padding: '10px 14px' }}>{user.role?.name ?? '-'}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user)}
                        disabled={deletingId === user.id}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '4px',
                          border: '1px solid var(--color-error)',
                          backgroundColor: 'transparent',
                          color: 'var(--color-error)',
                          cursor: deletingId === user.id ? 'not-allowed' : 'pointer',
                          fontSize: '0.875rem',
                          opacity: deletingId === user.id ? 0.6 : 1,
                        }}
                      >
                        {deletingId === user.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // FIX: was hardcoded rgba(0,0,0,0.5) — now theme-aware via CSS variable
              backgroundColor: 'var(--color-overlay, rgba(0, 0, 0, 0.5))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(2px)',
            }}
            onClick={handleCloseModal}
          >
            <div
              style={{
                // FIX: was --color-background (page bg) — switched to --color-surface
                // so the modal sits visually "above" the page in both themes
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '2rem',
                borderRadius: '10px',
                width: '90%',
                maxWidth: '480px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Add New User</h2>
                <button
                  onClick={handleCloseModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: 'var(--color-text)',
                    padding: '0.25rem 0.5rem',
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>

              {/* Form Error Banner */}
              {formError && (
                <div
                  style={{
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    backgroundColor: 'var(--color-error)',
                    color: 'var(--color-surface)',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                  }}
                >
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddUser}>
                {/* Username */}
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    Username <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* First Name */}
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    First Name <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={newUser.firstName}
                    onChange={handleInputChange}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Last Name */}
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    Last Name <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={newUser.lastName}
                    onChange={handleInputChange}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    Email <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Role */}
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    Role
                  </label>
                  <select
                    name="roleName"
                    value={newUser.roleName}
                    onChange={handleInputChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">No Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Active User */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={newUser.isActive}
                      onChange={handleInputChange}
                      style={{
                        cursor: 'pointer',
                        accentColor: 'var(--color-primary)',
                        width: '15px',
                        height: '15px',
                      }}
                    />
                    <span>Active User</span>
                  </label>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      color: 'var(--color-text)',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                  >
                    Cancel
                  </button>
                  <PrimaryButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create User'}
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
