import React from 'react';
import Skeleton from './Skeleton';

interface TableSkeletonProps {
  /** Number of rows */
  rows?: number;
  /** Number of columns (excluding any action column) */
  columns?: number;
  className?: string;
}

/**
 * Table-style skeleton for list/table layouts (e.g. Content entries list).
 */
export default function TableSkeleton({
  rows = 5,
  columns = 4,
  className = '',
}: Readonly<TableSkeletonProps>) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns + 1}, minmax(0, 1fr))`,
          gap: '0 1rem',
          padding: '1rem 1.5rem',
          background: 'var(--color-background)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {Array.from({ length: columns + 1 }).map((_, i) => (
          <Skeleton key={i} height="0.875rem" style={{ maxWidth: '80px' }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns + 1}, minmax(0, 1fr))`,
            gap: '0 1rem',
            padding: '1rem 1.5rem',
            borderBottom: rowIdx < rows - 1 ? '1px solid var(--color-border)' : 'none',
          }}
        >
          {Array.from({ length: columns + 1 }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              height="0.875rem"
              style={{
                maxWidth: colIdx === 0 ? '120px' : '80%',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
