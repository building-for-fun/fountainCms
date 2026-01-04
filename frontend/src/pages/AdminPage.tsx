import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/Layouts/AdminLayout';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

function StatCard({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        padding: 24,
        borderRadius: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid var(--color-border)',
        minWidth: 240,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
      }}
    >
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8, color: 'var(--color-text)' }}>
          {value}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}

function Sparkline({ data, color = 'var(--color-primary)' }: { data: number[]; color?: string }) {
  const w = 120;
  const h = 40;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1 || 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
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

  const sparkDataUsers = useMemo(
    () => [2, 3, 4, 5, usersCount ?? 5, (usersCount ?? 5) + 1, usersCount ?? 5],
    [usersCount]
  );
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
      <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: 20,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
              Admin Dashboard
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: 14 }}>
              Welcome back, here is what is happening today.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 13, fontStyle: 'italic' }}>
              {lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : ''}
            </div>
            <button
              onClick={handleRefreshStorage}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: 'var(--color-primary)',
                color: 'var(--color-surface)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--color-primary-dark, #1d4ed8)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary)')}
            >
              Refresh Stats
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-surface)')}
            >
              Reload
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2
            style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: 'var(--color-text)' }}
          >
            Overview
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            <StatCard
              title="Total Users"
              value={loadingUsers ? '...' : (usersCount?.toString() ?? '-')}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Sparkline data={sparkDataUsers} />
                <div
                  style={{ fontSize: 13, color: 'var(--color-success, #10b981)', fontWeight: 500 }}
                >
                  +12%
                </div>
              </div>
            </StatCard>

            <StatCard title="Images Size" value={`${imagesSizeMB} MB`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Sparkline data={sparkDataImages} color="var(--color-accent)" />
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>total size</div>
              </div>
            </StatCard>

            <StatCard title="Storage Used" value={`${storageUsedGB} GB`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Sparkline data={sparkDataStorage} color="var(--color-warning)" />
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>of 100 GB</div>
              </div>
            </StatCard>
          </div>
        </div>

        <section style={{ width: '100%' }}>
          <h2
            style={{
              marginBottom: 16,
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            Recent Activity
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 24,
            }}
          >
            {/* Recent Users Card */}
            <div
              style={{
                background: 'var(--color-surface)',
                padding: 24,
                borderRadius: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>
                New User Signups
              </h3>
              <ul style={{ margin: 0, padding: 0 }}>
                {['user-a@example.com', 'user-b@example.com', 'user-c@example.com'].map(
                  (email, i) => (
                    <li
                      key={i}
                      style={{
                        padding: '12px 0',
                        borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'var(--color-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                        }}
                      >
                        👤
                      </div>
                      <span style={{ color: 'var(--color-text)', fontSize: 14, fontWeight: 500 }}>
                        {email}
                      </span>
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: 12,
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {Math.floor(Math.random() * 24)}h ago
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Storage Breakdown Card */}
            <div
              style={{
                background: 'var(--color-surface)',
                padding: 24,
                borderRadius: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600 }}>
                Storage Distribution
              </h3>
              <p style={{ margin: '0 0 20px', color: 'var(--color-text-muted)', fontSize: 13 }}>
                Breakdown of resource usage
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>Images</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {Math.round((imagesSizeMB / (storageUsedGB * 1024)) * 100)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: 'var(--color-bg)',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((imagesSizeMB / (storageUsedGB * 1024)) * 100)
                        )}%`,
                        height: '100%',
                        background: 'var(--color-accent)',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>Database</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>15%</span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: 'var(--color-bg)',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '15%',
                        height: '100%',
                        background: 'var(--color-primary)',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>Logs</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>5%</span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: 'var(--color-bg)',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '5%',
                        height: '100%',
                        background: 'var(--color-warning)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
