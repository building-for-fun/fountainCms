import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/Layouts/AdminLayout';
import { User } from '../types/user';
import { getUserRole, getPermissionsFromRole } from '../helper/userHelper';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('user');

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
        const roleName = getUserRole(data);
        setSelectedRole(roleName);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load user');
        setLoading(false);
      });
  }, [id]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };

  const handleSave = async () => {
    if (!user || !id) return;
    setSaving(true);
    setError(null);

    const updated = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      isActive: user.isActive,
      role: selectedRole,
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Save failed');
      }
      const saved = await res.json();
      if (!saved || !saved.id) {
        throw new Error('Invalid response from server');
      }
      setUser(saved);
      const roleName = getUserRole(saved);
      setSelectedRole(roleName);
      setSaving(false);
      alert('User saved successfully');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save user');
      setSaving(false);
    }
  };

  if (!id) return <div>Missing user id</div>;

  const permissions = getPermissionsFromRole(selectedRole);

  return (
    <AdminLayout>
      <div style={{ padding: '16px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'flex-start',
            marginBottom: '16px',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>User Details</h1>
          <div>
            <Link
              to="/admin/users"
              style={{ color: 'var(--color-primary)', fontSize: '14px', textDecoration: 'none' }}
            >
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
          <div style={{ marginTop: 16, maxWidth: '100%' }}>
            <div style={{ marginBottom: 16, wordBreak: 'break-word' }}>
              <strong>ID:</strong> <span>{user.id}</span>
            </div>
            <div style={{ marginBottom: 16, wordBreak: 'break-word' }}>
              <strong>Firstname:</strong> <span>{user.firstName}</span>
            </div>
            <div style={{ marginBottom: 16, wordBreak: 'break-word' }}>
              <strong>Lastname:</strong> <span>{user.lastName}</span>
            </div>
            <div style={{ marginBottom: 16, wordBreak: 'break-word' }}>
              <strong>Username:</strong> <span>{user.username}</span>
            </div>

            <section style={{ marginTop: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Role</h3>
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '300px',
                }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </section>

            <section style={{ marginTop: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                Permissions (based on role)
              </h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {permissions.map((permission) => (
                  <div
                    key={permission}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'var(--color-primary)',
                      color: 'var(--color-surface)',
                      boxShadow: 'var(--shadow-sm)',
                      fontSize: '14px',
                    }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{permission}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: 8 }}>
                {selectedRole === 'admin'
                  ? 'Admin role has full access to all features'
                  : 'User role has read-only access'}
              </p>
            </section>

            <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  background: 'var(--color-primary)',
                  color: 'var(--color-surface)',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1,
                  fontSize: '14px',
                  fontWeight: 500,
                  minWidth: '100px',
                  flex: '1 1 auto',
                  maxWidth: '200px',
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  minWidth: '100px',
                  flex: '1 1 auto',
                  maxWidth: '200px',
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
