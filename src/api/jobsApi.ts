import { apiClient } from './client';
import type { Job, JobFilters, PaginatedJobs, ScrapeTriggerResponse, Stats } from '@/types/job';

/** Strips undefined/empty values so the querystring stays clean. */
function toQueryParams(filters: JobFilters): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {
    page: filters.page,
    page_size: filters.page_size,
  };
  if (filters.search) params.search = filters.search;
  if (filters.skill) params.skill = filters.skill;
  if (filters.remote !== undefined) params.remote = filters.remote;
  if (filters.min_experience !== undefined) params.min_experience = filters.min_experience;
  if (filters.location) params.location = filters.location;
  if (filters.company) params.company = filters.company;
  if (filters.source) params.source = filters.source;
  return params;
}

export async function fetchJobs(filters: JobFilters): Promise<PaginatedJobs> {
  const { data } = await apiClient.get<PaginatedJobs>('/jobs', {
    params: toQueryParams(filters),
  });
  return data;
}

export async function fetchJobById(id: number): Promise<Job> {
  const { data } = await apiClient.get<Job>(`/jobs/${id}`);
  return data;
}

export async function fetchStats(): Promise<Stats> {
  const { data } = await apiClient.get<Stats>('/stats');
  return data;
}

export async function triggerScrape(): Promise<ScrapeTriggerResponse> {
  const { data } = await apiClient.post<ScrapeTriggerResponse>('/scrape/trigger');
  return data;
}
