import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import ContentTypes from '../ContentTypes';
import * as schemaApi from '../../../api/schema';

// Mock the API
vi.mock('../../../api/schema');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
};

describe('ContentTypes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(schemaApi.fetchSchema).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<ContentTypes />, { wrapper: createWrapper() });

    expect(screen.getByText('Loading content types...')).toBeInTheDocument();
  });

  it('displays error state when fetch fails', async () => {
    const errorMessage = 'Failed to fetch schema';
    vi.mocked(schemaApi.fetchSchema).mockRejectedValue(new Error(errorMessage));

    render(<ContentTypes />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('displays empty state when no content types exist', async () => {
    vi.mocked(schemaApi.fetchSchema).mockResolvedValue({
      collections: {},
    });

    render(<ContentTypes />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('No Content Types Yet')).toBeInTheDocument();
      expect(
        screen.getByText(/Content types define the structure of your data/)
      ).toBeInTheDocument();
    });
  });

  it('displays content types table when data is available', async () => {
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
          fields: {
            name: { type: 'string', required: true },
          },
        },
      },
    });

    render(<ContentTypes />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Blog Posts')).toBeInTheDocument();
      expect(screen.getByText('Authors')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Number of fields for posts
      expect(screen.getByText('1')).toBeInTheDocument(); // Number of fields for authors
    });
  });

  it('uses key as label when label is not provided', async () => {
    vi.mocked(schemaApi.fetchSchema).mockResolvedValue({
      collections: {
        products: {
          fields: {
            name: { type: 'string' },
          },
        },
      },
    });

    render(<ContentTypes />, { wrapper: createWrapper() });

    await waitFor(() => {
      const productsElements = screen.getAllByText('products');
      expect(productsElements.length).toBeGreaterThan(0);
    });
  });
});
