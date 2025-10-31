import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/Layouts/AdminLayout';
import { Link } from 'react-router-dom';

interface User {
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

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export default function AdminUserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/user`)
      .then((res) => res.json())
      .then((data) => {
        // The API returns { data: user } (single user or null)
        if (data && data.data) {
          setUsers([data.data]);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch((err) => {
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
                <th style={{ padding: 8, border: '1px solid var(--color-border)' }}>ID</th>
                <th style={{ padding: 8, border: '1px solid var(--color-border)' }}>Role</th>
                <th style={{ padding: 8, border: '1px solid var(--color-border)' }}>Collection</th>
                <th style={{ padding: 8, border: '1px solid var(--color-border)' }}>Layout</th>
                <th style={{ padding: 8, border: '1px solid var(--color-border)' }}>Icon</th>
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
                      {user.id}
                    </Link>
                  </td>
                  <td style={{ padding: 8, border: '1px solid var(--color-border)' }}>
                    {user.role ?? '-'}
                  </td>
                  <td style={{ padding: 8, border: '1px solid var(--color-border)' }}>
                    {user.collection}
                  </td>
                  <td style={{ padding: 8, border: '1px solid var(--color-border)' }}>
                    {user.layout}
                  </td>
                  <td style={{ padding: 8, border: '1px solid var(--color-border)' }}>
                    {user.icon}
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
