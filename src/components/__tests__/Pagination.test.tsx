import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, createTestStore } from '@/test/testUtils';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('shows the current page and total pages', () => {
    const store = createTestStore({ page: 2, page_size: 20 });
    renderWithProviders(<Pagination total={100} />, { store });
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  it('disables "Prev" on the first page', () => {
    const store = createTestStore({ page: 1, page_size: 20 });
    renderWithProviders(<Pagination total={100} />, { store });
    expect(screen.getByRole('button', { name: /Prev/ })).toBeDisabled();
  });

  it('disables "Next" on the last page', () => {
    const store = createTestStore({ page: 5, page_size: 20 });
    renderWithProviders(<Pagination total={100} />, { store });
    expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled();
  });

  it('advances to the next page on click', async () => {
    const user = userEvent.setup();
    const store = createTestStore({ page: 1, page_size: 20 });
    renderWithProviders(<Pagination total={100} />, { store });

    await user.click(screen.getByRole('button', { name: /Next/ }));

    expect(store.getState().filters.page).toBe(2);
  });

  it('goes back to the previous page on click', async () => {
    const user = userEvent.setup();
    const store = createTestStore({ page: 3, page_size: 20 });
    renderWithProviders(<Pagination total={100} />, { store });

    await user.click(screen.getByRole('button', { name: /Prev/ }));

    expect(store.getState().filters.page).toBe(2);
  });

  it('always shows at least 1 page, even with zero results', () => {
    const store = createTestStore({ page: 1, page_size: 20 });
    renderWithProviders(<Pagination total={0} />, { store });
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });
});
