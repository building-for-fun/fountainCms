import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { Link } from 'react-router-dom';
import type { User } from '../../types/user';
import { LoadingState, EmptyState, ErrorState } from '../../components/states';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/user`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRetry = () => {
    fetchUsers();
  };

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem', fontWeight: 700 }}>
          Users Directory
        </h1>

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

        {/* Users Table */}
        {!loading && !error && users.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface)' }}>
                <th style={{ padding: 8, border: '1px solid var(--color-border)' }}>Username</th>
                <th style={{ padding: 8, border: '1px solid var(--color-border)' }}>First Name</th>
                <th style={{ padding: 8, border: '1px solid var(--color-border)' }}>Last Name</th>
                <th style={{ padding: 8, border: '1px solid var(--color-border)' }}>Email</th>
                <th style={{ padding: 8, border: '1px solid var(--color-border)' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: 8, border: '1px solid var(--color-border)' }}>
                    <Link
                      to={`/admin/users/${user.id}`}
                      style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                    >
                      {user.username}
                    </Link>
                  </td>
                  <td style={{ padding: 8, border: '1px solid var(--color-border)' }}>
                    {user.firstName ?? '-'}
                  </td>
                  <td style={{ padding: 8, border: '1px solid var(--color-border)' }}>
                    {user.lastName ?? '-'}
                  </td>
                  <td style={{ padding: 8, border: '1px solid var(--color-border)' }}>
                    {user.email ?? '-'}
                  </td>
                  <td style={{ padding: 8, border: '1px solid var(--color-border)' }}>
                    {user.role?.name ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
