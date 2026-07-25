import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, createTestStore } from '@/test/testUtils';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('renders with the current search value from the store', () => {
    const store = createTestStore({ search: 'python' });
    renderWithProviders(<SearchBar />, { store });
    expect(screen.getByLabelText('Search')).toHaveValue('python');
  });

  it('updates the input immediately but debounces the Redux dispatch', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const store = createTestStore();
    renderWithProviders(<SearchBar />, { store });

    const input = screen.getByLabelText('Search');
    await user.type(input, 'react');

    // Input reflects every keystroke right away...
    expect(input).toHaveValue('react');
    // ...but the store hasn't been updated yet, since the debounce window
    // (400ms) hasn't elapsed.
    expect(store.getState().filters.search).toBeUndefined();

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(store.getState().filters.search).toBe('react');

    jest.useRealTimers();
  });

  it('resets pagination to page 1 when a new search commits', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const store = createTestStore({ page: 5 });
    renderWithProviders(<SearchBar />, { store });

    await user.type(screen.getByLabelText('Search'), 'go');
    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(store.getState().filters.page).toBe(1);

    jest.useRealTimers();
  });
});
