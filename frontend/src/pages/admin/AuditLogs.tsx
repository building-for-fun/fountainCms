import React, { useState } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs } from '../../api/admin.api';
import { AuditLog } from '../../types/admin';

type AuditLogsResponse = {
  data: AuditLog[];
  meta: { total: number; limit?: number; offset?: number };
};

const PAGE_SIZE = 20;

const AuditLogs = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error } = useQuery<AuditLogsResponse>({
    queryKey: ['admin', 'audit-logs', page],
    queryFn: () => fetchAuditLogs({ limit: PAGE_SIZE, offset: page * PAGE_SIZE }),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const total = data?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: 4 }}>Audit Logs</h1>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          Only write operations are logged (User and Role create, update, delete). Read operations
          are not recorded.
        </p>

        {isLoading && <p>Loading audit logs…</p>}

        {isError && <p style={{ color: 'var(--color-error, red)' }}>{error?.message}</p>}

        {data?.data?.length === 0 && !isLoading && (
          <p style={{ color: 'var(--color-text-muted)' }}>No audit logs yet.</p>
        )}

        {data?.data && data.data.length > 0 && (
          <>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'var(--color-background)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <th align="left" style={{ padding: 12, fontWeight: 600 }}>
                    Time
                  </th>
                  <th align="left" style={{ padding: 12, fontWeight: 600 }}>
                    Actor
                  </th>
                  <th align="left" style={{ padding: 12, fontWeight: 600 }}>
                    Action
                  </th>
                  <th align="left" style={{ padding: 12, fontWeight: 600 }}>
                    Entity
                  </th>
                  <th align="left" style={{ padding: 12, fontWeight: 600 }}>
                    Collection
                  </th>
                  <th align="left" style={{ padding: 12, fontWeight: 600 }}>
                    Entity ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((log: AuditLog) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 12 }}>{new Date(log.createdAt).toLocaleString()}</td>
                    <td style={{ padding: 12 }}>{log.user ? log.user.username : '—'}</td>
                    <td style={{ padding: 12 }}>{log.action}</td>
                    <td style={{ padding: 12 }}>{log.entity}</td>
                    <td style={{ padding: 12 }}>{log.collection ?? '—'}</td>
                    <td style={{ padding: 12 }}>
                      {log.entityId ? log.entityId.slice(0, 8) + '…' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    cursor: page === 0 ? 'not-allowed' : 'pointer',
                    opacity: page === 0 ? 0.6 : 1,
                  }}
                >
                  Previous
                </button>
                <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                  Page {page + 1} of {totalPages} ({total} total)
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                    opacity: page >= totalPages - 1 ? 0.6 : 1,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AuditLogs;
