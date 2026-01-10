import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ActivityLogs from '../../../pages/admin/ActivityLogs';

vi.mock('../../../components/Layouts/AdminLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-layout">{children}</div>
  ),
}));

describe('ActivityLogs Page', () => {
  it('renders inside AdminLayout', () => {
    render(<ActivityLogs />);

    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
  });

  it('renders page heading', () => {
    render(<ActivityLogs />);

    expect(screen.getByRole('heading', { name: /activity logs/i })).toBeInTheDocument();
  });

  it('renders placeholder description', () => {
    render(<ActivityLogs />);

    expect(
      screen.getByText('This is a placeholder for the Activity Logs page.')
    ).toBeInTheDocument();
  });
});
