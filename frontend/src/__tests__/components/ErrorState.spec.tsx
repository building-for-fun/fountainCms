import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState from '../../components/states/ErrorState';

describe('ErrorState', () => {
  it('should render with required message prop', () => {
    render(<ErrorState message="Failed to fetch data" />);
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
  });

  it('should render with default title', () => {
    render(<ErrorState message="An error occurred" />);
    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
  });

  it('should render with custom title', () => {
    render(<ErrorState title="Network Error" message="Could not connect to server" />);
    expect(screen.getByText('Network Error')).toBeInTheDocument();
  });

  it('should display error icon', () => {
    render(<ErrorState message="Error" />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const handleRetry = vi.fn();
    render(<ErrorState message="Error" onRetry={handleRetry} />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should call onRetry when button is clicked', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    render(<ErrorState message="Error" onRetry={handleRetry} />);

    const button = screen.getByRole('button', { name: /try again/i });
    await user.click(button);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('should render custom retry label', () => {
    render(<ErrorState message="Error" onRetry={vi.fn()} retryLabel="Reload Data" />);
    expect(screen.getByRole('button', { name: /reload data/i })).toBeInTheDocument();
  });

  it('should not render button when onRetry is not provided', () => {
    render(<ErrorState message="Error" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should display friendly error messages', () => {
    render(
      <ErrorState
        title="Connection Error"
        message="Unable to reach the server. Please check your internet connection."
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(
      screen.getByText('Unable to reach the server. Please check your internet connection.')
    ).toBeInTheDocument();
  });
});
