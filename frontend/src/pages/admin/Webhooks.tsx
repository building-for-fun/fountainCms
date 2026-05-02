import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useToast } from '../../components/Toast';
import {
  createWebhook,
  deleteWebhook,
  fetchWebhooks,
  updateWebhook,
  type WebhookMeta,
} from '../../api/webhooks';
import {
  pageStyles,
  headerStyles,
  titleStyles,
  cardStyles,
  buttonStyles,
  inputStyles,
} from '../../lib/ui';

const EVENT_HINT =
  'content.entry.created, content.entry.updated, content.entry.deleted, content.entry.*';

function parseLines(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function Webhooks() {
  const { showToast } = useToast();
  const [items, setItems] = useState<WebhookMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newEvents, setNewEvents] = useState('content.entry.*');
  const [newCollections, setNewCollections] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revealedSecret, setRevealedSecret] = useState<{
    secret: string;
    title: string;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWebhooks();
      setItems(data);
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'message' in e
          ? String((e as { message: unknown }).message)
          : 'Failed to load webhooks';
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
    const events = parseLines(newEvents);
    if (!newName.trim() || !newUrl.trim() || events.length === 0) {
      showToast('Name, URL, and at least one event are required.', 'warning');
      return;
    }
    const collections = parseLines(newCollections);
    try {
      setSubmitting(true);
      const res = await createWebhook({
        name: newName.trim(),
        url: newUrl.trim(),
        events,
        collections: collections.length ? collections : undefined,
      });
      setItems((prev) => [res.meta, ...prev]);
      setRevealedSecret({
        secret: res.secret,
        title: `Webhook “${res.meta.name}”`,
      });
      setShowCreate(false);
      setNewName('');
      setNewUrl('');
      setNewEvents('content.entry.*');
      setNewCollections('');
      showToast('Webhook created.', 'success');
    } catch {
      showToast('Could not create webhook.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this webhook? Endpoints will stop receiving events.')) {
      return;
    }
    try {
      await deleteWebhook(id);
      setItems((prev) => prev.filter((w) => w.id !== id));
      showToast('Webhook deleted.', 'success');
    } catch {
      showToast('Could not delete webhook.', 'error');
    }
  };

  const handleToggle = async (row: WebhookMeta) => {
    try {
      const res = await updateWebhook(row.id, { enabled: !row.enabled });
      setItems((prev) => prev.map((w) => (w.id === row.id ? res.meta : w)));
      showToast(row.enabled ? 'Webhook disabled.' : 'Webhook enabled.', 'success');
    } catch {
      showToast('Could not update webhook.', 'error');
    }
  };

  const handleRotate = async (row: WebhookMeta) => {
    if (
      !window.confirm(
        'Generate a new signing secret? Update your receiver to verify with the new secret.'
      )
    ) {
      return;
    }
    try {
      const res = await updateWebhook(row.id, { regenerateSecret: true });
      setItems((prev) => prev.map((w) => (w.id === row.id ? res.meta : w)));
      if (res.secret) {
        setRevealedSecret({
          secret: res.secret,
          title: `Rotated secret for “${row.name}”`,
        });
      }
      showToast('Secret rotated.', 'success');
    } catch {
      showToast('Could not rotate secret.', 'error');
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
            <span aria-hidden>⚡</span> Webhooks
          </h1>
          <PrimaryButton type="button" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? 'Cancel' : 'New webhook'}
          </PrimaryButton>
        </header>

        <div style={{ ...cardStyles, marginBottom: '1.5rem' }}>
          <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
            Fountain POSTs JSON to your URL when content entries change. Verify payloads with{' '}
            <code>HMAC-SHA256</code> over the raw body using your signing secret; we send{' '}
            <code>X-Fountain-Signature: sha256=&lt;hex&gt;</code> and{' '}
            <code>X-Fountain-Delivery</code> (unique id per attempt). Allowed event names:{' '}
            <code>{EVENT_HINT}</code>. Leave collections empty to receive all collections.
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
            <h2 style={{ marginTop: 0, fontSize: '1.125rem' }}>Create webhook</h2>
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
              placeholder="Production rebuild"
              required
            />
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              URL
            </label>
            <input
              style={{
                ...inputStyles,
                width: '100%',
                marginBottom: '1rem',
                boxSizing: 'border-box',
              }}
              value={newUrl}
              onChange={(ev) => setNewUrl(ev.target.value)}
              placeholder="https://example.com/cms-hook"
              required
            />
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              Events (one per line or comma-separated)
            </label>
            <textarea
              style={{
                ...inputStyles,
                width: '100%',
                minHeight: 72,
                marginBottom: '0.35rem',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                fontSize: 13,
              }}
              value={newEvents}
              onChange={(ev) => setNewEvents(ev.target.value)}
              placeholder="content.entry.*"
            />
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              Collections (optional)
            </label>
            <textarea
              style={{
                ...inputStyles,
                width: '100%',
                minHeight: 56,
                marginBottom: '1rem',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                fontSize: 13,
              }}
              value={newCollections}
              onChange={(ev) => setNewCollections(ev.target.value)}
              placeholder={'posts\npages'}
            />
            <button type="submit" disabled={submitting} style={buttonStyles('primary')}>
              {submitting ? 'Creating…' : 'Create webhook'}
            </button>
          </form>
        )}

        {revealedSecret && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wh-secret-title"
            style={{
              ...cardStyles,
              marginBottom: '1.5rem',
              border: '2px solid var(--color-primary)',
              maxWidth: 640,
            }}
          >
            <h2 id="wh-secret-title" style={{ marginTop: 0, color: 'var(--color-error)' }}>
              Save this signing secret now
            </h2>
            <p style={{ marginTop: 0, color: 'var(--color-text-muted)' }}>{revealedSecret.title}</p>
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
                {revealedSecret.secret}
              </code>
              <button
                type="button"
                style={buttonStyles('secondary')}
                onClick={() => copySecret(revealedSecret.secret)}
              >
                Copy
              </button>
              <button
                type="button"
                style={buttonStyles('primary')}
                onClick={() => setRevealedSecret(null)}
              >
                Done
              </button>
            </div>
          </div>
        )}

        <div style={cardStyles}>
          <h2 style={{ marginTop: 0, fontSize: '1.125rem' }}>Subscriptions</h2>
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
          ) : items.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No webhooks yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '10px 8px' }}>Name</th>
                    <th style={{ padding: '10px 8px' }}>URL</th>
                    <th style={{ padding: '10px 8px' }}>Events</th>
                    <th style={{ padding: '10px 8px' }}>Collections</th>
                    <th style={{ padding: '10px 8px' }}>Status</th>
                    <th style={{ padding: '10px 8px', width: 280 }} />
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>{row.name}</td>
                      <td
                        style={{
                          padding: '10px 8px',
                          maxWidth: 220,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={row.url}
                      >
                        <code style={{ fontSize: 12 }}>{row.url}</code>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <code style={{ fontSize: 11 }}>{row.events.join(', ')}</code>
                      </td>
                      <td style={{ padding: '10px 8px', color: 'var(--color-text-muted)' }}>
                        {row.collections.length ? row.collections.join(', ') : 'All'}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        {row.enabled ? (
                          <span style={{ color: 'var(--color-success, #16a34a)' }}>On</span>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)' }}>Off</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          <button
                            type="button"
                            style={buttonStyles('secondary')}
                            onClick={() => handleToggle(row)}
                          >
                            {row.enabled ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            type="button"
                            style={buttonStyles('secondary')}
                            onClick={() => handleRotate(row)}
                          >
                            Rotate secret
                          </button>
                          <button
                            type="button"
                            style={buttonStyles('danger')}
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </button>
                        </div>
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
