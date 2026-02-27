import React from 'react';
import CardSkeleton from './CardSkeleton';
import TableSkeleton from './TableSkeleton';
import LoadingState from './LoadingState';

type Variant = 'cards' | 'table' | 'spinner';

interface LoadingSkeletonProps {
  variant?: Variant;
  message?: string;
  /** For variant="cards" */
  cardCount?: number;
  /** For variant="table" */
  tableRows?: number;
  tableColumns?: number;
}

/**
 * Full-page loading state: either skeleton (cards/table) or spinner.
 * Use for consistent loading UX across admin pages.
 */
export default function LoadingSkeleton({
  variant = 'cards',
  message,
  cardCount = 6,
  tableRows = 6,
  tableColumns = 4,
}: Readonly<LoadingSkeletonProps>) {
  if (variant === 'spinner') {
    return <LoadingState message={message ?? 'Loading...'} />;
  }

  if (variant === 'table') {
    return (
      <div style={{ padding: '1.5rem 0' }}>
        {message && (
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
            }}
          >
            {message}
          </p>
        )}
        <TableSkeleton rows={tableRows} columns={tableColumns} />
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0' }}>
      {message && (
        <p
          style={{
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
          }}
        >
          {message}
        </p>
      )}
      <CardSkeleton count={cardCount} />
    </div>
  );
}
