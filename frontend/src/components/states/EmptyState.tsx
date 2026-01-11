import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * EmptyState component displays when no data is available
 * Provides a clear, friendly message and optional call-to-action
 */
export default function EmptyState({
  title = 'No Data Available',
  message = 'There are no items to display at this time.',
  icon = '📭',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        minHeight: '300px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '4rem',
          marginBottom: '1.5rem',
          opacity: 0.5,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: '1rem',
          color: 'var(--color-text-muted)',
          maxWidth: '400px',
          marginBottom: '2rem',
        }}
      >
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            background: 'var(--color-primary)',
            color: 'var(--color-surface)',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
