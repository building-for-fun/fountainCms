import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Inline error message (e.g. under a form field or above a list).
 * Not a full-page state.
 */
export default function ErrorMessage({
  message,
  className = '',
  style,
}: Readonly<ErrorMessageProps>) {
  return (
    <p
      className={className}
      role="alert"
      style={{
        margin: 0,
        fontSize: '0.875rem',
        color: 'var(--color-error, #ef4444)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        ...style,
      }}
    >
      <span aria-hidden>⚠️</span>
      {message}
    </p>
  );
}
