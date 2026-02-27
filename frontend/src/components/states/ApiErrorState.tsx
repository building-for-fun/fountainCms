import React from 'react';
import ErrorState from './ErrorState';

interface ApiErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Placeholder for when an API request fails (e.g. list failed to load).
 * Use instead of a generic error when the screen would otherwise be empty due to fetch failure.
 */
export default function ApiErrorState({
  message = "We couldn't load this content. Please check your connection and try again.",
  onRetry,
}: Readonly<ApiErrorStateProps>) {
  return (
    <ErrorState
      title="Something went wrong"
      message={message}
      onRetry={onRetry}
      retryLabel="Try again"
    />
  );
}
