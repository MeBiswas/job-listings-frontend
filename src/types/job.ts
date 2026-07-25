/**
 * These types are a deliberate 1:1 mirror of the FastAPI backend's Pydantic
 * schemas (see `app/schemas.py` in the job-listings-aggregator API repo).
 *
 * Keeping them hand-aligned like this means a schema change on either side
 * shows up immediately as a TypeScript build error here, instead of a silent
 * runtime mismatch discovered by a confused user. If the backend adds or
 * renames a field, update the corresponding interface below in the same PR.
 */

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string | null;
  salary: string | null;
  experience: string | null;
  min_experience_years: number | null;
  skills: string | null;
  apply_url: string;
  source: string;
  is_remote: boolean;
  posted_date: string | null;
  scraped_at: string; // ISO 8601 datetime string
}

export interface PaginatedJobs {
  total: number;
  page: number;
  page_size: number;
  results: Job[];
}

export interface Stats {
  total_jobs: number;
  remote_jobs: number;
  by_source: Record<string, number>;
  by_location: Record<string, number>;
  top_skills: Record<string, number>;
}

export interface ScrapeTriggerResponse {
  status: string;
  detail: string;
}

/** Query params accepted by GET /jobs — mirrors the FastAPI route signature. */
export interface JobFilters {
  search?: string;
  skill?: string;
  remote?: boolean;
  min_experience?: number;
  location?: string;
  company?: string;
  source?: string;
  page: number;
  page_size: number;
}

export const DEFAULT_FILTERS: JobFilters = {
  page: 1,
  page_size: 20,
};

/** Derives the list of skill chips from a comma-separated skills string. */
export function parseSkills(skills: string | null): string[] {
  if (!skills) return [];
  return skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
