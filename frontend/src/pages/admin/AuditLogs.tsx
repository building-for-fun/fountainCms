import React from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs } from '../../api/admin.api';
import { AuditLog } from '../../types/admin';

type AuditLogsResponse = {
  data: AuditLog[];
  meta: { total: number };
};

const AuditLogs = () => {
  const { data, isLoading, isError, error } = useQuery<AuditLogsResponse>({
    queryKey: ['admin', 'audit-logs'],
    queryFn: fetchAuditLogs,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <h1>Audit Logs</h1>

        {isLoading && <p>Loading audit logs…</p>}

        {isError && <p style={{ color: 'red' }}>{error.message}</p>}

        {data?.data?.length === 0 && <p>No audit logs yet.</p>}

        {data?.data && data.data.length > 0 && (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1rem',
            }}
          >
            <thead>
              <tr>
                <th align="left">Time</th>
                <th align="left">User</th>
                <th align="left">Action</th>
                <th align="left">Entity</th>
                <th align="left">Collection</th>
                <th align="left">Entity ID</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((log: AuditLog) => (
                <tr key={log.id}>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>{log.user ? log.user.username : 'System'}</td>
                  <td>{log.action}</td>
                  <td>{log.entity}</td>
                  <td>{log.collection ?? '-'}</td>
                  <td>{log.entityId ? log.entityId.slice(0, 8) + '…' : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AuditLogs;
