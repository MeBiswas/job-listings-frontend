import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchJobs } from '@/api/jobsApi';
import { useAppSelector } from '@/store/hooks';
import type { JobFilters } from '@/types/job';

export const jobsQueryKey = (filters: JobFilters) => ['jobs', filters] as const;

/**
 * Reads the current filters out of Redux and fetches the matching page of
 * jobs via TanStack Query. `keepPreviousData` keeps the old results on
 * screen (instead of flashing a loading state) while a new filter/page
 * request is in flight - much smoother for pagination and filter changes.
 */
export function useJobs() {
  const filters = useAppSelector((state) => state.filters);

  return useQuery({
    queryKey: jobsQueryKey(filters),
    queryFn: () => fetchJobs(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000, // avoid refetching identical filter combos within 30s
  });
}
