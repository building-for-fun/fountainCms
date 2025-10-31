import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/Layouts/AdminLayout';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

function StatCard({ title, value, children }: { title: string; value: string; children?: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        padding: 16,
        borderRadius: 12,
        boxShadow: 'var(--shadow-sm)',
        minWidth: 180,
      }}
    >
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{value}</div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}

function Sparkline({ data, color = 'var(--color-primary)' }: { data: number[]; color?: string }) {
  const w = 120;
  const h = 36;
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => `${(i / (data.length - 1 || 1)) * w},${h - (v / max) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth={2} points={points} />
    </svg>
  );
}

export default function AdminPage() {
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // mock storage metrics — in a real app these would come from the backend
  const [imagesSizeMB, setImagesSizeMB] = useState(124.5);
  const [storageUsedGB, setStorageUsedGB] = useState(12.3);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLoadingUsers(true);
    fetch(`${apiBaseUrl}/api/user`)
      .then((res) => res.json())
      .then((data) => {
        // backend returns { data: user } (single user) or { data: null }
        if (!data) return setUsersCount(0);
        if (Array.isArray(data)) return setUsersCount(data.length);
        if (data.data == null) return setUsersCount(0);
        // data.data could be an array or single user
        if (Array.isArray(data.data)) setUsersCount(data.data.length);
        else setUsersCount(1);
      })
      .catch(() => setError('Failed to fetch users'))
      .finally(() => setLoadingUsers(false));
  }, []);

  const sparkDataUsers = useMemo(() => [2, 3, 4, 5, usersCount ?? 5, (usersCount ?? 5) + 1, usersCount ?? 5], [usersCount]);
  const sparkDataImages = [80, 90, 100, 110, 120, 130, imagesSizeMB];
  const sparkDataStorage = [8, 9, 10, 11, 11.5, 12, storageUsedGB];

  const handleRefreshStorage = () => {
    // simulate fetching storage stats; in a real integration you'd call an API
    setImagesSizeMB((s) => Math.round((s + Math.random() * 10 - 3) * 10) / 10);
    setStorageUsedGB((s) => Math.round((s + Math.random() * 1 - 0.3) * 10) / 10);
    setLastUpdated(new Date());
  };

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          <div style={{ color: 'var(--color-text-muted)' }}>{lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : ''}</div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
          <StatCard title="Users" value={loadingUsers ? 'Loading…' : usersCount?.toString() ?? '-'}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Sparkline data={sparkDataUsers} />
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>active</div>
            </div>
          </StatCard>

          <StatCard title="Images (MB)" value={`${imagesSizeMB} MB`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Sparkline data={sparkDataImages} color="var(--color-accent)" />
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>images total size</div>
            </div>
          </StatCard>

          <StatCard title="Storage (GB)" value={`${storageUsedGB} GB`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Sparkline data={sparkDataStorage} color="var(--color-warning)" />
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>used</div>
            </div>
          </StatCard>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handleRefreshStorage}
              style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--color-primary)', color: 'var(--color-surface)', border: 'none' }}
            >
              Refresh stats
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent' }}
            >
              Reload
            </button>
          </div>
        </div>

        <section style={{ marginTop: 28 }}>
          <h2 style={{ marginBottom: 12 }}>Activity</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'var(--color-surface)', padding: 12, borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginTop: 0 }}>Recent users</h3>
              <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Shows latest user signups (mocked).</p>
              <ul style={{ marginTop: 8 }}>
                <li>user-a@example.com</li>
                <li>user-b@example.com</li>
                <li>user-c@example.com</li>
              </ul>
            </div>
            <div style={{ background: 'var(--color-surface)', padding: 12, borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginTop: 0 }}>Storage breakdown</h3>
              <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Images, backups and other files</p>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Images</span>
                  <span>{Math.round((imagesSizeMB / (storageUsedGB * 1024)) * 100)}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 8, overflow: 'hidden', marginTop: 6 }}>
                  <div style={{ width: `${Math.min(100, Math.round((imagesSizeMB / (storageUsedGB * 1024)) * 100))}%`, height: '100%', background: 'var(--color-primary)' }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
