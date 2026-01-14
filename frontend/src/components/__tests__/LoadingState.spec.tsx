import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingState from '../LoadingState';

describe('LoadingState', () => {
  it('renders with default message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingState message="Loading content types..." />);
    expect(screen.getByText('Loading content types...')).toBeInTheDocument();
  });

  it('displays loading spinner', () => {
    const { container } = render(<LoadingState />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
