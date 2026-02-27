import React from 'react';
import Skeleton from './Skeleton';

interface CardSkeletonProps {
  /** Number of cards to show (e.g. 3 for a row) */
  count?: number;
  className?: string;
}

/**
 * Card-style skeleton for grid layouts (e.g. Data Models, Entries hub).
 */
export default function CardSkeleton({ count = 3, className = '' }: Readonly<CardSkeletonProps>) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Skeleton width={48} height={48} borderRadius="10px" />
          <Skeleton height="1.25rem" style={{ maxWidth: '60%' }} />
          <Skeleton height="0.875rem" style={{ maxWidth: '40%' }} />
          <Skeleton height="0.875rem" style={{ maxWidth: '30%', marginTop: '0.5rem' }} />
          <Skeleton height="2rem" style={{ marginTop: '1rem' }} />
        </div>
      ))}
    </div>
  );
}
