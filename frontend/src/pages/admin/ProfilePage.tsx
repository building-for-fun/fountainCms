import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { getUser, login as persistLogin } from '../../lib/auth';
import { api } from '../../api/client';
import { changePassword as apiChangePassword } from '../../api/auth';
import { getUserRole } from '../../helper/userHelper';
import type { User } from '../../types/user';

const InputGroup = ({
  label,
  name,
  value,
  onChange,
  disabled,
  type = 'text',
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  type?: string;
  error?: string;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label
      style={{
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--color-text-muted)',
      }}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        padding: '10px 14px',
        borderRadius: 8,
        border: `1px solid ${error ? 'var(--color-error, #dc2626)' : 'var(--color-border)'}`,
        background: disabled ? 'rgba(0,0,0,0.02)' : 'var(--color-surface)',
        color: 'var(--color-text)',
        fontSize: 15,
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onFocus={(e) => {
        if (!disabled) {
          e.target.style.borderColor = 'var(--color-primary)';
          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        }
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? 'var(--color-error, #dc2626)' : 'var(--color-border)';
        e.target.style.boxShadow = 'none';
      }}
    />
    {error && <span style={{ fontSize: 13, color: 'var(--color-error, #dc2626)' }}>{error}</span>}
  </div>
);

const ProfilePage = () => {
  const currentUser = getUser();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    role: '',
    currentPassword: '',
    newPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('Not logged in');
      return;
    }
    setLoading(true);
    setError(null);
    api<User>(`/user/${userId}`)
      .then((user) => {
        setProfile(user);
        const roleName = getUserRole(user);
        setFormData({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          email: user.email ?? '',
          username: user.username ?? '',
          role: roleName,
          currentPassword: '',
          newPassword: '',
        });
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!formData.firstName?.trim()) err.firstName = 'First name is required';
    if (!formData.lastName?.trim()) err.lastName = 'Last name is required';
    if (!formData.email?.trim()) err.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) err.email = 'Invalid email';
    if (!formData.username?.trim()) err.username = 'Username is required';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!userId || !profile) return;
    if (!validate()) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await api<User>(`/user/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          username: formData.username.trim(),
          role: formData.role || undefined,
        }),
      });

      setProfile(updated);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully.');

      const roleName = getUserRole(updated);
      persistLogin({
        id: updated.id,
        email: updated.email,
        role: roleName,
      });
    } catch (e) {
      const message =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to save profile';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    const roleName = getUserRole(profile);
    setFormData({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      email: profile.email ?? '',
      username: profile.username ?? '',
      role: roleName,
      currentPassword: '',
      newPassword: '',
    });
    setFieldErrors({});
    setIsEditing(false);
    setError(null);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    const current = formData.currentPassword.trim();
    const newPw = formData.newPassword.trim();
    if (!newPw) {
      setPasswordError('New password is required');
      return;
    }
    if (newPw.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await apiChangePassword(current, newPw);
      setPasswordSuccess('Password updated successfully.');
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to change password';
      setPasswordError(message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading profile...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!userId || !profile) {
    return (
      <AdminLayout>
        <div style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ color: 'var(--color-error, #dc2626)' }}>
            {error || 'Unable to load profile.'}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>
          Profile
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>
          Manage your account settings and preferences.
        </p>

        {successMessage && (
          <div
            style={{
              marginBottom: 24,
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(34, 197, 94, 0.1)',
              color: 'var(--color-success, #16a34a)',
              fontSize: 14,
            }}
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div
            style={{
              marginBottom: 24,
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(220, 38, 38, 0.1)',
              color: 'var(--color-error, #dc2626)',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {/* Profile Card */}
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 16,
              padding: 24,
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              height: 'fit-content',
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 16,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }}
            >
              {(formData.firstName[0] || '?').toUpperCase()}
              {(formData.lastName[0] || '?').toUpperCase()}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>
              {formData.firstName || formData.lastName
                ? `${formData.firstName} ${formData.lastName}`.trim()
                : '—'}
            </h2>
            <span
              style={{
                display: 'inline-block',
                marginTop: 8,
                padding: '4px 12px',
                borderRadius: 20,
                background: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--color-primary)',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {formData.role || '—'}
            </span>
          </div>

          {/* Details Form */}
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 16,
              padding: 32,
              border: '1px solid var(--color-border)',
              gridColumn: '1 / -1',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: 16,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Account Details</h3>
              {isEditing ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontWeight: 500,
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: 'var(--color-primary)',
                      color: '#fff',
                      fontWeight: 500,
                      cursor: saving ? 'not-allowed' : 'pointer',
                      border: 'none',
                      opacity: saving ? 0.8 : 1,
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'var(--color-primary)',
                    color: '#fff',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--color-primary-dark, #1d4ed8)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary)')}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 20,
              }}
            >
              <InputGroup
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                error={fieldErrors.firstName}
              />
              <InputGroup
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                error={fieldErrors.lastName}
              />
              <InputGroup
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                type="email"
                error={fieldErrors.email}
              />
              <InputGroup
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                error={fieldErrors.username}
              />
              <InputGroup
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={true}
              />
            </div>

            <div style={{ marginTop: 32 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Change Password</h4>
              {passwordSuccess && (
                <p
                  style={{ fontSize: 14, color: 'var(--color-success, #16a34a)', marginBottom: 12 }}
                >
                  {passwordSuccess}
                </p>
              )}
              {passwordError && (
                <p style={{ fontSize: 14, color: 'var(--color-error, #dc2626)', marginBottom: 12 }}>
                  {passwordError}
                </p>
              )}
              <form
                onSubmit={handleChangePassword}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 20,
                  alignItems: 'end',
                }}
              >
                <InputGroup
                  label="Current Password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={changingPassword}
                  type="password"
                />
                <InputGroup
                  label="New Password (min 6 characters)"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={changingPassword}
                  type="password"
                />
                <div>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 8,
                      background: 'var(--color-primary)',
                      color: '#fff',
                      fontWeight: 500,
                      cursor: changingPassword ? 'not-allowed' : 'pointer',
                      border: 'none',
                      opacity: changingPassword ? 0.8 : 1,
                    }}
                  >
                    {changingPassword ? 'Updating...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfilePage;
