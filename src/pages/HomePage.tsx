import { useMemo } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { FilterPanel } from '@/components/FilterPanel';
import { JobList } from '@/components/JobList';
import { Pagination } from '@/components/Pagination';
import { LoadingState, ErrorState, EmptyState } from '@/components/StateViews';
import { getErrorMessage } from '@/api/client';

export default function HomePage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useJobs();

  const resultLabel = useMemo(() => {
    if (!data) return '';
    return `${data.total} job${data.total === 1 ? '' : 's'} found`;
  }, [data]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 pt-6">
      <FilterPanel />

      <div className="flex justify-between items-center mb-2.5 text-xs text-ink-soft dark:text-ink-dark-soft">
        <span aria-live="polite">
          {isLoading ? 'Loading…' : resultLabel}
          {isFetching && !isLoading && ' · updating…'}
        </span>
      </div>

      <div className="panel">
        {isLoading && <LoadingState />}
        {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
        {!isLoading && !isError && data && data.results.length === 0 && <EmptyState />}
        {!isLoading && !isError && data && data.results.length > 0 && (
          <JobList jobs={data.results} />
        )}
      </div>

      {!isLoading && !isError && data && data.total > 0 && <Pagination total={data.total} />}
    </main>
  );
}
