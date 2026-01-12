import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type ProvidersProps = {
  children: React.ReactNode;
};

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

const AllProviders = ({ children }: ProvidersProps) => {
  const queryClient = createTestQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}
