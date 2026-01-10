import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { Link } from 'react-router-dom';
import type { User } from '../../types/user';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/user`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.data)) {
          setUsers(data.data);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <h1>Users Directory</h1>
        {loading && <p>Loading users...</p>}
        {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
        {!loading && users.length === 0 && <p>No users found.</p>}
        {!loading && users.length > 0 && (
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
