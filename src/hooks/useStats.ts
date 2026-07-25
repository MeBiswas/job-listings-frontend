import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '@/api/jobsApi';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    staleTime: 60_000,
    refetchInterval: 60_000, // keep the header ticker reasonably fresh
  });
}
