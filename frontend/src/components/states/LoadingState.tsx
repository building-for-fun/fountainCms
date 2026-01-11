import React from 'react';

interface LoadingStateProps {
  message?: string;
}

/**
 * LoadingState component displays a loading spinner and optional message
 * Used to indicate data fetching or processing operations
 */
export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        minHeight: '300px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid var(--color-border)',
          borderTop: '4px solid var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p
        style={{
          marginTop: '1.5rem',
          fontSize: '1rem',
          color: 'var(--color-text-muted)',
          fontWeight: 500,
        }}
      >
        {message}
      </p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
