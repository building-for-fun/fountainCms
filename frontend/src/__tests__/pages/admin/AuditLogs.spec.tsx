import { screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import AuditLogs from '../../../pages/admin/AuditLogs';
import { fetchAuditLogs } from '../../../api/admin.api';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

vi.mock('../../../components/Layouts/AdminLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-layout">{children}</div>
  ),
}));

vi.mock('../../../api/admin.api', () => ({
  fetchAuditLogs: vi.fn(),
}));

describe('AuditLogs Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders inside AdminLayout', async () => {
    (fetchAuditLogs as any).mockResolvedValue({
      data: [],
      meta: { total: 0 },
    });

    renderWithProviders(<AuditLogs />);

    expect(await screen.findByTestId('admin-layout')).toBeInTheDocument();
  });

  it('renders page heading', async () => {
    (fetchAuditLogs as any).mockResolvedValue({
      data: [],
      meta: { total: 0 },
    });

    renderWithProviders(<AuditLogs />);

    expect(await screen.findByRole('heading', { name: /audit logs/i })).toBeInTheDocument();
  });

  it('shows empty state when no logs exist', async () => {
    (fetchAuditLogs as any).mockResolvedValue({
      data: [],
      meta: { total: 0 },
    });

    renderWithProviders(<AuditLogs />);

    expect(await screen.findByText(/no audit logs yet/i)).toBeInTheDocument();
  });

  it('renders audit logs table when data exists', async () => {
    (fetchAuditLogs as any).mockResolvedValue({
      data: [
        {
          id: '1',
          action: 'content.create',
          entity: 'content',
          collection: 'posts',
          entityId: 'abc123',
          createdAt: new Date().toISOString(),
          user: {
            id: 'u1',
            username: 'hunny',
            email: 'hunny@test.com',
          },
        },
      ],
      meta: { total: 1 },
    });

    renderWithProviders(<AuditLogs />);

    expect(await screen.findByText('content.create')).toBeInTheDocument();

    expect(screen.getByText('hunny')).toBeInTheDocument();

    expect(screen.getByText('posts')).toBeInTheDocument();
  });
});
