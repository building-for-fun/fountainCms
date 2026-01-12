import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from '../../components/states/EmptyState';

describe('EmptyState', () => {
  it('should render with default props', () => {
    render(<EmptyState />);
    expect(screen.getByText('No Data Available')).toBeInTheDocument();
    expect(screen.getByText('There are no items to display at this time.')).toBeInTheDocument();
  });

  it('should render with custom title and message', () => {
    render(<EmptyState title="No Users Found" message="Create your first user to get started" />);
    expect(screen.getByText('No Users Found')).toBeInTheDocument();
    expect(screen.getByText('Create your first user to get started')).toBeInTheDocument();
  });

  it('should render custom icon', () => {
    render(<EmptyState icon="👥" />);
    expect(screen.getByText('👥')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    const handleAction = vi.fn();
    render(<EmptyState actionLabel="Add User" onAction={handleAction} />);
    expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument();
  });

  it('should call onAction when button is clicked', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();
    render(<EmptyState actionLabel="Refresh" onAction={handleAction} />);

    const button = screen.getByRole('button', { name: 'Refresh' });
    await user.click(button);

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('should not render button when onAction is not provided', () => {
    render(<EmptyState actionLabel="Add User" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should not render button when actionLabel is not provided', () => {
    render(<EmptyState onAction={vi.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
