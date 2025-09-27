import React from 'react';
import AdminLayout from '../components/Layouts/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the FountainCMS Admin page. Add your admin features here.</p>
      </div>
    </AdminLayout>
  );
}
