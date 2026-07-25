import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/testUtils';
import HomePage from '@/pages/HomePage';
import * as jobsApi from '@/api/jobsApi';
import type { Job, PaginatedJobs, Stats } from '@/types/job';

jest.mock('@/api/jobsApi');
const mockedFetchJobs = jobsApi.fetchJobs as jest.MockedFunction<typeof jobsApi.fetchJobs>;
const mockedFetchStats = jobsApi.fetchStats as jest.MockedFunction<typeof jobsApi.fetchStats>;

function buildJob(overrides: Partial<Job>): Job {
  return {
    id: 1,
    title: 'Python Backend Developer',
    company: 'Acme Corp',
    location: 'Mohali',
    salary: '10-15 LPA',
    experience: '4-6 years',
    min_experience_years: 4,
    skills: 'Python, Django',
    apply_url: 'https://example.com/1',
    source: 'sample_demo',
    is_remote: false,
    posted_date: '2026-07-01',
    scraped_at: '2026-07-01T00:00:00Z',
    ...overrides,
  };
}

const ALL_JOBS: Job[] = [
  buildJob({ id: 1, title: 'Python Backend Developer', company: 'Acme Corp' }),
  buildJob({
    id: 2,
    title: 'Junior React Developer',
    company: 'Beta LLC',
    skills: 'React, JavaScript',
    is_remote: true,
    location: 'Remote',
  }),
];

const STATS: Stats = {
  total_jobs: 2,
  remote_jobs: 1,
  by_source: { sample_demo: 2 },
  by_location: { Mohali: 1, Remote: 1 },
  top_skills: { Python: 1, React: 1 },
};

describe('Search -> filter -> results integration flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchStats.mockResolvedValue(STATS);
  });

  it('loads and displays jobs on initial render', async () => {
    mockedFetchJobs.mockResolvedValue({
      total: 2,
      page: 1,
      page_size: 20,
      results: ALL_JOBS,
    } as PaginatedJobs);

    renderWithProviders(<HomePage />);

    expect(screen.getByRole('status')).toBeInTheDocument(); // loading

    await waitFor(() => {
      expect(screen.getByText('Python Backend Developer')).toBeInTheDocument();
    });
    expect(screen.getByText('Junior React Developer')).toBeInTheDocument();
    expect(screen.getByText('2 jobs found')).toBeInTheDocument();
  });

  it('re-queries the API with the skill filter applied when the user types a skill', async () => {
    mockedFetchJobs.mockResolvedValue({
      total: 2,
      page: 1,
      page_size: 20,
      results: ALL_JOBS,
    } as PaginatedJobs);

    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    await waitFor(() => expect(mockedFetchJobs).toHaveBeenCalled());

    mockedFetchJobs.mockResolvedValue({
      total: 1,
      page: 1,
      page_size: 20,
      results: [ALL_JOBS[0]],
    } as PaginatedJobs);

    await user.type(screen.getByLabelText('Skill'), 'Python');

    await waitFor(() => {
      const lastCall = mockedFetchJobs.mock.calls.at(-1)?.[0];
      expect(lastCall?.skill).toBe('Python');
    });

    await waitFor(() => {
      expect(screen.getByText('1 job found')).toBeInTheDocument();
    });
  });

  it('applying the "Remote jobs" quick chip filters to remote=true', async () => {
    mockedFetchJobs.mockResolvedValue({
      total: 2,
      page: 1,
      page_size: 20,
      results: ALL_JOBS,
    } as PaginatedJobs);

    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    await waitFor(() => expect(mockedFetchJobs).toHaveBeenCalled());

    mockedFetchJobs.mockResolvedValue({
      total: 1,
      page: 1,
      page_size: 20,
      results: [ALL_JOBS[1]],
    } as PaginatedJobs);

    await user.click(screen.getByRole('button', { name: 'Remote jobs' }));

    await waitFor(() => {
      const lastCall = mockedFetchJobs.mock.calls.at(-1)?.[0];
      expect(lastCall?.remote).toBe(true);
    });
  });

  it('shows the empty state when a filter combination returns no results', async () => {
    mockedFetchJobs.mockResolvedValue({
      total: 0,
      page: 1,
      page_size: 20,
      results: [],
    } as PaginatedJobs);

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/No jobs match these filters/i)).toBeInTheDocument();
    });
  });

  it('shows an error state with a working retry button when the API call fails', async () => {
    mockedFetchJobs.mockRejectedValueOnce(new Error('Network Error'));
    mockedFetchJobs.mockResolvedValueOnce({
      total: 1,
      page: 1,
      page_size: 20,
      results: [ALL_JOBS[0]],
    } as PaginatedJobs);

    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => {
      expect(screen.getByText('Python Backend Developer')).toBeInTheDocument();
    });
  });

  it('resets all filters when "Reset filters" is clicked', async () => {
    mockedFetchJobs.mockResolvedValue({
      total: 2,
      page: 1,
      page_size: 20,
      results: ALL_JOBS,
    } as PaginatedJobs);

    const user = userEvent.setup();
    const { store } = renderWithProviders(<HomePage />, {
      preloadedFilters: { skill: 'Python', location: 'Mohali' },
    });

    await waitFor(() => expect(mockedFetchJobs).toHaveBeenCalled());

    await user.click(screen.getByRole('button', { name: /reset filters/i }));

    expect(store.getState().filters.skill).toBeUndefined();
    expect(store.getState().filters.location).toBeUndefined();
  });
});
