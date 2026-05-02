import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UsersList from '../../pages/admin/UsersList';
import { api } from '../../api/client';

vi.mock('../../api/client', () => ({
  api: vi.fn(),
}));

const mockApi = vi.mocked(api);

// Mock the AdminLayout component
vi.mock('../../components/Layouts/AdminLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock the state components
vi.mock('../../components/states', () => ({
  LoadingState: ({ message }: { message: string }) => <div data-testid="loading">{message}</div>,
  EmptyState: ({ title, message }: { title: string; message: string }) => (
    <div data-testid="empty">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  ),
  ErrorState: ({
    title,
    message,
    onRetry,
  }: {
    title: string;
    message: string;
    onRetry: () => void;
  }) => (
    <div data-testid="error">
      <h3>{title}</h3>
      <p>{message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

const mockUsers = [
  {
    id: '1',
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: { name: 'admin' },
    permissions: [],
  },
  {
    id: '2',
    username: 'jane_smith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    role: { name: 'user' },
    permissions: [],
  },
];

/** UsersList loads `/user` and `/roles` on mount; tests must satisfy both. */
function mockUserAndRolesRoutes(impl: (path: string) => Promise<unknown>): void {
  mockApi.mockImplementation((path: string) => impl(path));
}

describe('UsersList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.mockReset();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should show loading state initially', () => {
    mockApi.mockImplementation(
      () =>
        new Promise(() => {
          /* never resolves */
        })
    );

    renderWithRouter(<UsersList />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  it('should display users when fetch is successful', async () => {
    mockUserAndRolesRoutes(async (path) => {
      if (path === '/roles') return { data: [] };
      if (path === '/user') return { data: mockUsers };
      throw new Error(`unexpected path: ${path}`);
    });

    renderWithRouter(<UsersList />);

    await waitFor(() => {
      expect(screen.getByText('john_doe')).toBeInTheDocument();
      expect(screen.getByText('jane_smith')).toBeInTheDocument();
    });

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('should show error state when fetch fails', async () => {
    mockUserAndRolesRoutes(async (path) => {
      if (path === '/roles') return { data: [] };
      if (path === '/user') throw new Error('Network error');
      throw new Error(`unexpected path: ${path}`);
    });

    renderWithRouter(<UsersList />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to Load Users')).toBeInTheDocument();
  });

  it('should show empty state when no users exist', async () => {
    mockUserAndRolesRoutes(async (path) => {
      if (path === '/roles') return { data: [] };
      if (path === '/user') return { data: [] };
      throw new Error(`unexpected path: ${path}`);
    });

    renderWithRouter(<UsersList />);

    await waitFor(() => {
      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });

    expect(screen.getByText('No Users Found')).toBeInTheDocument();
  });

  it('should retry fetch when retry button is clicked', async () => {
    const user = userEvent.setup();
    let userCalls = 0;

    mockApi.mockImplementation(async (path: string) => {
      if (path === '/roles') return { data: [] };
      if (path === '/user') {
        userCalls += 1;
        if (userCalls === 1) throw new Error('Network error');
        return { data: mockUsers };
      }
      throw new Error(`unexpected path: ${path}`);
    });

    renderWithRouter(<UsersList />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('john_doe')).toBeInTheDocument();
    });
  });

  it('should handle HTTP error responses', async () => {
    mockUserAndRolesRoutes(async (path) => {
      if (path === '/roles') return { data: [] };
      if (path === '/user') throw { message: 'Internal Server Error', statusCode: 500 };
      throw new Error(`unexpected path: ${path}`);
    });

    renderWithRouter(<UsersList />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });

  it('should render user links correctly', async () => {
    mockUserAndRolesRoutes(async (path) => {
      if (path === '/roles') return { data: [] };
      if (path === '/user') return { data: mockUsers };
      throw new Error(`unexpected path: ${path}`);
    });

    renderWithRouter(<UsersList />);

    await waitFor(() => {
      const link = screen.getByRole('link', { name: 'john_doe' });
      expect(link).toHaveAttribute('href', '/admin/users/1');
    });
  });

  it('should handle missing user data fields gracefully', async () => {
    const incompleteUser = {
      id: '3',
      username: 'incomplete',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: null,
      permissions: [],
    };

    mockUserAndRolesRoutes(async (path) => {
      if (path === '/roles') return { data: [] };
      if (path === '/user') return { data: [incompleteUser] };
      throw new Error(`unexpected path: ${path}`);
    });

    renderWithRouter(<UsersList />);

    await waitFor(() => {
      expect(screen.getByText('incomplete')).toBeInTheDocument();
    });

    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });
});
