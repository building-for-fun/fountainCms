import React from 'react';

/** Includes `publish` (draft → published). Schema admin uses create/read/update/delete only. */
const MATRIX_OPERATIONS = ['create', 'read', 'update', 'publish', 'delete'] as const;

export function permissionKey(collection: string, op: string): string {
  return `${collection}:${op}`;
}

/** Check if permission is explicitly set (for matrix checkbox state) */
export function hasPermission(permissions: string[], collection: string, op: string): boolean {
  return permissions.includes(permissionKey(collection, op));
}

function togglePermission(
  permissions: string[],
  collection: string,
  op: string,
  checked: boolean
): string[] {
  const key = permissionKey(collection, op);
  if (checked) {
    return permissions.includes(key) ? permissions : [...permissions, key];
  }
  return permissions.filter((p) => p !== key);
}

interface PermissionMatrixProps {
  collections: Array<{ key: string; label: string }>;
  permissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

export function PermissionMatrix({
  collections,
  permissions,
  onChange,
  disabled = false,
}: PermissionMatrixProps) {
  if (collections.length === 0) {
    return (
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
        No content types yet. Create data models first to assign permissions.
      </p>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
        }}
        aria-label="Content permissions"
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                padding: '0.5rem 0.75rem',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                fontWeight: 600,
              }}
            >
              Content type
            </th>
            {MATRIX_OPERATIONS.map((op) => (
              <th
                key={op}
                style={{
                  textAlign: 'center',
                  padding: '0.5rem 0.75rem',
                  borderBottom: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {op}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {collections.map(({ key, label }) => (
            <tr key={key}>
              <td
                style={{
                  padding: '0.5rem 0.75rem',
                  borderBottom: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontFamily: 'monospace',
                }}
              >
                {label || key}
              </td>
              {MATRIX_OPERATIONS.map((op) => {
                if (key === 'schema' && op === 'publish') {
                  return (
                    <td
                      key={op}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid var(--color-border)',
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                      }}
                      aria-label="Not applicable for schema"
                    >
                      —
                    </td>
                  );
                }
                const checked = hasPermission(permissions, key, op);
                return (
                  <td
                    key={op}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderBottom: '1px solid var(--color-border)',
                      textAlign: 'center',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={(e) => {
                        onChange(togglePermission(permissions, key, op, e.target.checked));
                      }}
                      aria-label={`${label || key} ${op}`}
                      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p
        style={{
          margin: '0.75rem 0 0',
          fontSize: '0.8125rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
        }}
      >
        <strong>Publish</strong> is required to create an entry as published or to change status
        from draft to published. Editing an already-published entry still uses{' '}
        <strong>update</strong>.
      </p>
    </div>
  );
}
