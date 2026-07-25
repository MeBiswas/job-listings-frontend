import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import filtersReducer, { type FiltersState } from '@/store/filtersSlice';
import { DEFAULT_FILTERS } from '@/types/job';

export function createTestStore(preloadedFilters?: Partial<FiltersState>) {
  return configureStore({
    reducer: { filters: filtersReducer },
    preloadedState: {
      filters: { ...DEFAULT_FILTERS, ...preloadedFilters },
    },
  });
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedFilters?: Partial<FiltersState>;
  route?: string;
  store?: ReturnType<typeof createTestStore>;
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedFilters,
    route = '/',
    store = createTestStore(preloadedFilters),
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
