import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPage } from '@/store/filtersSlice';

interface PaginationProps {
  total: number;
}

export function Pagination({ total }: PaginationProps) {
  const dispatch = useAppDispatch();
  const { page, page_size: pageSize } = useAppSelector((state) => state.filters);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const goTo = useCallback(
    (target: number) => {
      const clamped = Math.min(Math.max(1, target), totalPages);
      dispatch(setPage(clamped));
    },
    [dispatch, totalPages]
  );

  return (
    <nav
      className="flex justify-center items-center gap-4 py-5 font-mono text-xs"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 border border-line dark:border-line-dark rounded disabled:opacity-35 disabled:cursor-not-allowed hover:enabled:border-navy dark:hover:enabled:border-amber hover:enabled:text-navy dark:hover:enabled:text-amber"
      >
        ← Prev
      </button>
      <span aria-current="page">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 border border-line dark:border-line-dark rounded disabled:opacity-35 disabled:cursor-not-allowed hover:enabled:border-navy dark:hover:enabled:border-amber hover:enabled:text-navy dark:hover:enabled:text-amber"
      >
        Next →
      </button>
    </nav>
  );
}
