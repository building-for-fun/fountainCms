import React, { useMemo, useState } from 'react';
import AdminLayout from '../components/Layouts/AdminLayout';
import StatCard from '../components/StatCard';
import Sparkline from '../components/Sparkline';
import { useQuery } from '@tanstack/react-query';
import { fetchUsersCount } from '../api/admin.api';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export default function AdminPage() {
  const {
    data: usersCount,
    isLoading: loadingUsers,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'users', 'count'],
    queryFn: fetchUsersCount,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  // mock storage metrics — in a real app these would come from the backend
  const [imagesSizeMB, setImagesSizeMB] = useState(124.5);
  const [storageUsedGB, setStorageUsedGB] = useState(12.3);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const sparkDataUsers = useMemo(
    () => [2, 3, 4, 5, usersCount ?? 5, (usersCount ?? 5) + 1, usersCount ?? 5],
    [usersCount]
  );
  const sparkDataImages = [80, 90, 100, 110, 120, 130, imagesSizeMB];
  const sparkDataStorage = [8, 9, 10, 11, 11.5, 12, storageUsedGB];

  const handleRefreshStorage = () => {
    setImagesSizeMB((s) => Math.round((s + Math.random() * 10 - 3) * 10) / 10);
    setStorageUsedGB((s) => Math.round((s + Math.random() * 1 - 0.3) * 10) / 10);
    setLastUpdated(new Date());
  };

  return (
    <AdminLayout>
      <div style={{ padding: '16px', maxWidth: 1400, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: 24,
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: 16,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-text)' }}>
              Admin Dashboard
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
              Welcome back, here is what is happening today.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 12,
                fontStyle: 'italic',
                flex: '1 1 auto',
                minWidth: 'fit-content',
              }}
            >
              {lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : ''}
            </div>
            <button
              onClick={() => refetch()}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: 'var(--color-primary)',
                color: 'var(--color-surface)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              Refetch Users
            </button>

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
                fontSize: 13,
              }}
            >
              Refresh Stats
            </button>
          </div>
        </div>

        {isError && (
          <div style={{ color: 'var(--color-danger, red)', fontSize: 13 }}>
            Failed to fetch users: {error?.message}
          </div>
        )}

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Overview</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 16,
            }}
          >
            <StatCard
              title="Total Users"
              value={loadingUsers ? '...' : (usersCount?.toString() ?? '-')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Sparkline data={sparkDataUsers} />
                <div style={{ color: 'var(--color-success)', fontWeight: 500 }}>+12%</div>
              </div>
            </StatCard>

            <StatCard title="Images Size" value={`${imagesSizeMB} MB`}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Sparkline data={sparkDataImages} color="var(--color-accent)" />
                <div style={{ fontSize: 13 }}>total size</div>
              </div>
            </StatCard>

            <StatCard title="Storage Used" value={`${storageUsedGB} GB`}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Sparkline data={sparkDataStorage} color="var(--color-warning)" />
                <div style={{ fontSize: 13 }}>of 100 GB</div>
              </div>
            </StatCard>
          </div>
        </div>

        <section style={{ width: '100%' }}>
          <h2
            style={{
              marginBottom: 16,
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            Recent Activity
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 16,
            }}
          >
            {/* Recent Users Card */}
            <div
              style={{
                background: 'var(--color-surface)',
                padding: '16px',
                borderRadius: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>
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
                        flexWrap: 'wrap',
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
                          flexShrink: 0,
                        }}
                      >
                        👤
                      </div>
                      <span
                        style={{
                          color: 'var(--color-text)',
                          fontSize: 13,
                          fontWeight: 500,
                          flex: '1 1 auto',
                          minWidth: '120px',
                          wordBreak: 'break-word',
                        }}
                      >
                        {email}
                      </span>
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: 12,
                          color: 'var(--color-text-muted)',
                          flexShrink: 0,
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
                padding: '16px',
                borderRadius: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600 }}>
                Storage Distribution
              </h3>
              <p style={{ margin: '0 0 20px', color: 'var(--color-text-muted)', fontSize: 12 }}>
                Breakdown of resource usage
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 13,
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
                      fontSize: 13,
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
                      fontSize: 13,
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
