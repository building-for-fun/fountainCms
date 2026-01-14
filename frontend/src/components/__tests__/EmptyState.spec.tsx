import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders with default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('renders with custom message and description', () => {
    render(
      <EmptyState
        message="No Content Types Yet"
        description="Start by creating your first content type."
      />
    );
    expect(screen.getByText('No Content Types Yet')).toBeInTheDocument();
    expect(screen.getByText('Start by creating your first content type.')).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    render(<EmptyState icon="📦" />);
    expect(screen.getByText('📦')).toBeInTheDocument();
  });

  it('displays action button when action is provided', () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        action={{
          label: 'Create Content Type',
          onClick,
        }}
      />
    );
    const actionButton = screen.getByText('Create Content Type');
    expect(actionButton).toBeInTheDocument();
  });

  it('does not display action button when action is not provided', () => {
    render(<EmptyState />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls action onClick when button is clicked', () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        action={{
          label: 'Create Content Type',
          onClick,
        }}
      />
    );
    const actionButton = screen.getByText('Create Content Type');
    fireEvent.click(actionButton);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState message="No data" />);
    const descriptions = container.querySelectorAll('p');
    expect(descriptions.length).toBe(0);
  });
});
