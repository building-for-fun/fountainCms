import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useToast } from '../../components/Toast';
import {
  createApiToken,
  fetchApiTokens,
  revokeApiToken,
  type ApiTokenMeta,
} from '../../api/apiTokens';
import {
  pageStyles,
  headerStyles,
  titleStyles,
  cardStyles,
  buttonStyles,
  inputStyles,
} from '../../lib/ui';

function parsePermissions(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ApiTokens() {
  const { showToast } = useToast();
  const [items, setItems] = useState<ApiTokenMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPermissions, setNewPermissions] = useState('posts:read\nposts:create');
  const [newExpiresAt, setNewExpiresAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revealedSecret, setRevealedSecret] = useState<{
    token: string;
    meta: ApiTokenMeta;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApiTokens();
      setItems(data);
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'message' in e
          ? String((e as { message: unknown }).message)
          : 'Failed to load API tokens';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const permissions = parsePermissions(newPermissions);
    if (!newName.trim() || permissions.length === 0) {
      showToast('Name and at least one permission are required.', 'warning');
      return;
    }
    try {
      setSubmitting(true);
      const expiresAt =
        newExpiresAt.trim() === '' ? undefined : new Date(newExpiresAt).toISOString();
      const res = await createApiToken({
        name: newName.trim(),
        permissions,
        expiresAt,
      });
      setItems((prev) => [res.meta, ...prev]);
      setRevealedSecret({ token: res.token, meta: res.meta });
      setShowCreate(false);
      setNewName('');
      setNewPermissions('posts:read\nposts:create');
      setNewExpiresAt('');
      showToast('API token created.', 'success');
    } catch {
      showToast('Could not create token.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm('Revoke this token? Apps using it will stop working.')) {
      return;
    }
    try {
      await revokeApiToken(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      showToast('Token revoked.', 'success');
    } catch {
      showToast('Could not revoke token.', 'error');
    }
  };

  const copySecret = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard.', 'success');
    } catch {
      showToast('Copy failed — select and copy manually.', 'warning');
    }
  };

  return (
    <AdminLayout>
      <div style={pageStyles}>
        <header style={headerStyles}>
          <h1 style={titleStyles}>
            <span aria-hidden>🔐</span> API tokens
          </h1>
          <PrimaryButton type="button" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? 'Cancel' : 'New token'}
          </PrimaryButton>
        </header>

        <div style={{ ...cardStyles, marginBottom: '1.5rem' }}>
          <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
            Use tokens for scripts and frontends that call the <strong>Content API</strong> only (
            <code>/api/content/...</code>). Send the secret as{' '}
            <code>Authorization: Bearer &lt;token&gt;</code> or <code>X-Api-Key</code>.
            Unauthenticated <code>GET</code> requests return <strong>published</strong> entries
            only; drafts require a user session or a token with read permission.
          </p>
        </div>

        {error && (
          <div
            style={{
              ...cardStyles,
              marginBottom: '1rem',
              borderLeft: '4px solid var(--color-error)',
              color: 'var(--color-error)',
            }}
          >
            {error}
          </div>
        )}

        {showCreate && (
          <form
            onSubmit={handleCreate}
            style={{ ...cardStyles, marginBottom: '1.5rem', maxWidth: 560 }}
          >
            <h2 style={{ marginTop: 0, fontSize: '1.125rem' }}>Create token</h2>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              Name
            </label>
            <input
              style={{
                ...inputStyles,
                width: '100%',
                marginBottom: '1rem',
                boxSizing: 'border-box',
              }}
              value={newName}
              onChange={(ev) => setNewName(ev.target.value)}
              placeholder="CI — production site"
              required
            />
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              Permissions (one per line or comma-separated)
            </label>
            <textarea
              style={{
                ...inputStyles,
                width: '100%',
                minHeight: 100,
                marginBottom: '0.35rem',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                fontSize: 13,
              }}
              value={newPermissions}
              onChange={(ev) => setNewPermissions(ev.target.value)}
              placeholder={'posts:read\nposts:create'}
            />
            <p style={{ margin: '0 0 1rem', fontSize: 12, color: 'var(--color-text-muted)' }}>
              Same format as roles: <code>collection:operation</code> (create, read, update,
              delete), wildcards <code>posts:*</code> or <code>*:*</code>.
            </p>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              Expires (optional)
            </label>
            <input
              type="datetime-local"
              style={{ ...inputStyles, marginBottom: '1rem' }}
              value={newExpiresAt}
              onChange={(ev) => setNewExpiresAt(ev.target.value)}
            />
            <button type="submit" disabled={submitting} style={buttonStyles('primary')}>
              {submitting ? 'Creating…' : 'Generate token'}
            </button>
          </form>
        )}

        {revealedSecret && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="secret-dialog-title"
            style={{
              ...cardStyles,
              marginBottom: '1.5rem',
              border: '2px solid var(--color-primary)',
              maxWidth: 640,
            }}
          >
            <h2 id="secret-dialog-title" style={{ marginTop: 0, color: 'var(--color-error)' }}>
              Save this secret now
            </h2>
            <p style={{ marginTop: 0, color: 'var(--color-text-muted)' }}>
              It is shown only once. Token <strong>{revealedSecret.meta.name}</strong> (
              {revealedSecret.meta.id.slice(0, 8)}…).
            </p>
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'stretch',
                flexWrap: 'wrap',
              }}
            >
              <code
                style={{
                  flex: '1 1 240px',
                  padding: '12px',
                  background: 'var(--color-bg)',
                  borderRadius: 8,
                  wordBreak: 'break-all',
                  fontSize: 13,
                }}
              >
                {revealedSecret.token}
              </code>
              <button
                type="button"
                style={buttonStyles('secondary')}
                onClick={() => copySecret(revealedSecret.token)}
              >
                Copy
              </button>
              <button
                type="button"
                style={buttonStyles('primary')}
                onClick={() => setRevealedSecret(null)}
              >
                I’ve stored it
              </button>
            </div>
          </div>
        )}

        <div style={cardStyles}>
          <h2 style={{ marginTop: 0, fontSize: '1.125rem' }}>Active tokens</h2>
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
          ) : items.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No tokens yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '10px 8px' }}>Name</th>
                    <th style={{ padding: '10px 8px' }}>Permissions</th>
                    <th style={{ padding: '10px 8px' }}>Expires</th>
                    <th style={{ padding: '10px 8px' }}>Created</th>
                    <th style={{ padding: '10px 8px', width: 100 }} />
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>{row.name}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <code style={{ fontSize: 12 }}>{row.permissions.join(', ')}</code>
                      </td>
                      <td style={{ padding: '10px 8px', color: 'var(--color-text-muted)' }}>
                        {row.expiresAt ? new Date(row.expiresAt).toLocaleString() : '—'}
                      </td>
                      <td style={{ padding: '10px 8px', color: 'var(--color-text-muted)' }}>
                        {new Date(row.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <button
                          type="button"
                          style={buttonStyles('danger')}
                          onClick={() => handleRevoke(row.id)}
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
