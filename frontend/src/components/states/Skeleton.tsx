import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

/**
 * Base skeleton block with shimmer animation.
 * Use for loading placeholders.
 */
export default function Skeleton({
  className = '',
  style,
  width,
  height = '1rem',
  borderRadius = '6px',
}: Readonly<SkeletonProps>) {
  const finalStyle: React.CSSProperties = {
    width: width ?? '100%',
    height,
    borderRadius,
    background: 'var(--color-border)',
    animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
    ...style,
  };
  return (
    <>
      <div className={className} style={finalStyle} aria-hidden />
      <style>
        {`
          @keyframes skeleton-shimmer {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </>
  );
}
