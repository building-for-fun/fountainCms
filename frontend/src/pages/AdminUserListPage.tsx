import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/Layouts/AdminLayout';

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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && users.length === 0 && <p>No users found.</p>}
        {!loading && users.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>ID</th>
                <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Role</th>
                <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Collection</th>
                <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Layout</th>
                <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Icon</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{user.id}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{user.role ?? '-'}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{user.collection}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{user.layout}</td>
                  <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{user.icon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
