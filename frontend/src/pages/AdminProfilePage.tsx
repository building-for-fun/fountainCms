import React, { useState } from 'react';
import AdminLayout from '../components/Layouts/AdminLayout';

const InputGroup = ({
  label,
  name,
  value,
  onChange,
  disabled,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  type?: string;
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
        border: '1px solid var(--color-border)',
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
        e.target.style.borderColor = 'var(--color-border)';
        e.target.style.boxShadow = 'none';
      }}
    />
  </div>
);

const AdminProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@fountaincms.com',
    role: 'Super Admin',
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      // prompt success or toast
    }, 500);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset data if needed, for now just toggle
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>
          Profile
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>
          Manage your account settings and preferences.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
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
              {formData.firstName[0]}
              {formData.lastName[0]}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>
              {formData.firstName} {formData.lastName}
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
              {formData.role}
            </span>
          </div>

          {/* Details Form */}
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 16,
              padding: 32,
              border: '1px solid var(--color-border)',
              gridColumn: 'span 2', // Take up more space on wider screens
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
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'var(--color-primary)',
                    color: '#fff',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-dark, #1d4ed8)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary)')}
                >
                  Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: 'var(--color-primary)',
                      color: '#fff',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <InputGroup
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <InputGroup
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <InputGroup
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                type="email"
              />
              <InputGroup
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={true} // Role usually not editable by self
              />
            </div>

            {isEditing && (
              <div style={{ marginTop: 32 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Change Password</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                  <InputGroup
                    label="Current Password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    disabled={false}
                    type="password"
                  />
                  <InputGroup
                    label="New Password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={false}
                    type="password"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
