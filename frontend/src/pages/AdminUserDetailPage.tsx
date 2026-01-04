import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/Layouts/AdminLayout';
import { User } from '../types/user';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    read: false,
    write: false,
    admin: false,
    delete: false,
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${apiBaseUrl}/api/user/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: User) => {
        setUser(data);
        // derive permissions from user.permissions or role
        const perms: Record<string, boolean> = {
          read: false,
          write: false,
          admin: false,
          delete: false,
        };
        if ((data as any).permissions && Array.isArray((data as any).permissions)) {
          for (const p of (data as any).permissions) perms[p] = true;
        }
        if (data.role?.name === 'admin') perms.admin = true;
        // default read for all users
        perms.read = true;
        setPermissions(perms);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load user');
        setLoading(false);
      });
  }, [id]);

  const toggle = (key: string) => {
    setPermissions((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = async () => {
    if (!user || !id) return;
    setSaving(true);
    setError(null);

    const permsArray = Object.entries(permissions)
      .filter(([, v]) => v)
      .map(([k]) => k);
    const updated: Partial<User> = {
      ...user,
      permissions: permsArray,
      role: { name: permissions.admin ? 'admin' : null },
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Save failed');
      const saved = await res.json();
      setUser(saved);
      setSaving(false);
      // navigate back to users list
      // keep on page and show success message briefly
      alert('Permissions saved');
    } catch (e) {
      setError('Failed to save user');
      setSaving(false);
    }
  };

  if (!id) return <div>Missing user id</div>;

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>User Details</h1>
          <div>
            <Link to="/admin/users" style={{ marginRight: 12, color: 'var(--color-primary)' }}>
              ← Back to users
            </Link>
            <button
              onClick={() => navigate('/admin/users')}
              style={{ display: 'none' }}
              aria-hidden
            />
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
        {!loading && user && (
          <div style={{ marginTop: 16, maxWidth: 800 }}>
            <div style={{ marginBottom: 16 }}>
              <strong>ID:</strong> <span>{user.id}</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Firstname:</strong> <span>{user.firstName}</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Lastname:</strong> <span>{user.lastName}</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Username:</strong> <span>{user.username}</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Role:</strong> <span>{user?.role?.name ?? '-'}</span>
            </div>

            <section style={{ marginTop: 8 }}>
              <h3>Permissions</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['read', 'write', 'admin', 'delete'].map((p) => (
                  <label
                    key={p}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: permissions[p] ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: permissions[p] ? 'var(--color-surface)' : 'var(--color-text)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!permissions[p]}
                      onChange={() => toggle(p)}
                      style={{ width: 16, height: 16 }}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{p}</span>
                  </label>
                ))}
              </div>
            </section>

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  background: 'var(--color-primary)',
                  color: 'var(--color-surface)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
