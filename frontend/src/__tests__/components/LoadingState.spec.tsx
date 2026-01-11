import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoadingState from '../../components/states/LoadingState';

describe('LoadingState', () => {
  it('should render with default message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<LoadingState message="Loading users..." />);
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  it('should display loading spinner', () => {
    const { container } = render(<LoadingState />);
    const spinner = container.querySelector('div[style*="animation"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should have proper styling for accessibility', () => {
    const { container } = render(<LoadingState message="Please wait" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    });
  });
});
