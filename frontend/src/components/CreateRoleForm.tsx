import React from 'react';
import { PermissionMatrix } from './PermissionMatrix';

interface CreateRoleFormProps {
  newRole: { name: string; description: string; permissions: string[] };
  setNewRole: React.Dispatch<
    React.SetStateAction<{ name: string; description: string; permissions: string[] }>
  >;
  setShowCreateForm: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  handleAddRole: (e: React.FormEvent) => void;
  inputStyles: React.CSSProperties;
  buttonStyles: (variant: 'primary' | 'secondary' | 'danger' | 'success') => React.CSSProperties;
  cardStyles: React.CSSProperties;
  collections: Array<{ key: string; label: string }>;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({
  newRole,
  setNewRole,
  setShowCreateForm,
  isSubmitting,
  handleAddRole,
  inputStyles,
  buttonStyles,
  cardStyles,
  collections,
}) => (
  <div style={cardStyles}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}
    >
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          margin: 0,
        }}
      >
        Create New Role
      </h2>
      <button
        onClick={() => {
          setShowCreateForm(false);
          setNewRole({ name: '', description: '', permissions: [] });
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          fontSize: '1.5rem',
          padding: '0.25rem',
        }}
      >
        ×
      </button>
    </div>
    <form onSubmit={handleAddRole}>
      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="create-role-name"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-text)',
            marginBottom: '0.5rem',
          }}
        >
          Role Name <span style={{ color: 'var(--color-error)' }}>*</span>
        </label>
        <input
          type="text"
          id="create-role-name"
          name="name"
          value={newRole.name}
          onChange={(e) => setNewRole((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          style={inputStyles}
          placeholder="e.g., Administrator, Editor, Viewer"
          required
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="create-role-description"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-text)',
            marginBottom: '0.5rem',
          }}
        >
          Description
        </label>
        <textarea
          id="create-role-description"
          name="description"
          value={newRole.description}
          onChange={(e) => setNewRole((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          style={{
            ...inputStyles,
            minHeight: '100px',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
          placeholder="Describe the role's permissions and responsibilities..."
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-text)',
            marginBottom: '0.5rem',
          }}
        >
          Content permissions
        </div>
        <PermissionMatrix
          collections={collections}
          permissions={newRole.permissions}
          onChange={(permissions) => setNewRole((prev) => ({ ...prev, permissions }))}
          disabled={isSubmitting}
        />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => {
            setShowCreateForm(false);
            setNewRole({ name: '', description: '', permissions: [] });
          }}
          style={buttonStyles('secondary')}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={buttonStyles('primary')}
          disabled={isSubmitting || !newRole.name.trim()}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.opacity = '0.9';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.opacity = '1';
            }
          }}
        >
          {isSubmitting ? '⏳ Creating...' : '✅ Create Role'}
        </button>
      </div>
    </form>
  </div>
);

export default CreateRoleForm;
