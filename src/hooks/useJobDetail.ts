import { useQuery } from '@tanstack/react-query';
import { fetchJobById } from '@/api/jobsApi';

export function useJobDetail(id: number | undefined) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id as number),
    enabled: id !== undefined && !Number.isNaN(id),
    staleTime: 60_000,
  });
}
