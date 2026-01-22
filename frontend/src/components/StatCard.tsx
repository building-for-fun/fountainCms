export default function StatCard({
  title,
  value,
  children,
}: Readonly<{
  title: string;
  value: string;
  children?: React.ReactNode;
}>) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        padding: '16px',
        borderRadius: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid var(--color-border)',
        minWidth: 0,
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
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8, color: 'var(--color-text)' }}>
          {value}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}
