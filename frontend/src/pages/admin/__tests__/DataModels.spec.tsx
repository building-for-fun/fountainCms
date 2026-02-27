import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../../../components/Toast';
import DataModels from '../DataModels';
import * as schemaApi from '../../../api/schema';
import * as contentApi from '../../../api/content';

vi.mock('../../../api/schema');
vi.mock('../../../api/content');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </BrowserRouter>
    </ToastProvider>
  );
};

describe('DataModels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(contentApi.listItems).mockResolvedValue({ data: [], meta: { total: 0 } });
  });

  it('displays loading state initially', () => {
    vi.mocked(schemaApi.fetchSchema).mockImplementation(() => new Promise(() => {}));
    render(<DataModels />, { wrapper: createWrapper() });
    expect(screen.getByText('Loading data models...')).toBeInTheDocument();
  });

  it('displays error state when fetch fails', async () => {
    const errorMessage = 'Failed to fetch schema';
    vi.mocked(schemaApi.fetchSchema).mockRejectedValue(new Error(errorMessage));
    render(<DataModels />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('displays empty state when no data models exist', async () => {
    vi.mocked(schemaApi.fetchSchema).mockResolvedValue({ collections: {} });
    render(<DataModels />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText('No data models yet')).toBeInTheDocument();
    });
  });

  it('displays data models when schema is available', async () => {
    vi.mocked(schemaApi.fetchSchema).mockResolvedValue({
      collections: {
        posts: {
          label: 'Blog Posts',
          fields: {
            title: { type: 'string', required: true },
            content: { type: 'text' },
          },
        },
        authors: {
          label: 'Authors',
          fields: { name: { type: 'string', required: true } },
        },
      },
    });
    render(<DataModels />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText('Blog Posts')).toBeInTheDocument();
      expect(screen.getByText('Authors')).toBeInTheDocument();
      expect(screen.getByText(/2 fields/)).toBeInTheDocument();
      expect(screen.getByText(/1 field/)).toBeInTheDocument();
    });
  });

  it('uses key as label when label is not provided', async () => {
    vi.mocked(schemaApi.fetchSchema).mockResolvedValue({
      collections: {
        products: { fields: { name: { type: 'string' } } },
      },
    });
    render(<DataModels />, { wrapper: createWrapper() });
    await waitFor(() => {
      const productsElements = screen.getAllByText('products');
      expect(productsElements.length).toBeGreaterThan(0);
    });
  });
});
