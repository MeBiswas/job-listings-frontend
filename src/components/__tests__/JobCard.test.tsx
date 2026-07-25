import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/testUtils';
import { JobCard } from '../JobCard';
import type { Job } from '@/types/job';

const MOCK_JOB: Job = {
  id: 42,
  title: 'Senior Python Developer',
  company: 'Acme Corp',
  location: 'Mohali',
  salary: '15-20 LPA',
  experience: '4-6 years',
  min_experience_years: 4,
  skills: 'Python, Django, PostgreSQL',
  apply_url: 'https://example.com/apply/42',
  source: 'sample_demo',
  is_remote: true,
  posted_date: '2026-07-01',
  scraped_at: '2026-07-01T10:00:00Z',
};

describe('JobCard', () => {
  it('renders the job title, company, and location', () => {
    renderWithProviders(<JobCard job={MOCK_JOB} />);
    expect(screen.getByText('Senior Python Developer')).toBeInTheDocument();
    expect(screen.getByText(/Acme Corp/)).toBeInTheDocument();
    expect(screen.getByText(/Mohali/)).toBeInTheDocument();
  });

  it('shows a REMOTE badge for remote jobs', () => {
    renderWithProviders(<JobCard job={MOCK_JOB} />);
    expect(screen.getByText('REMOTE')).toBeInTheDocument();
  });

  it('does not show a REMOTE badge for non-remote jobs', () => {
    renderWithProviders(<JobCard job={{ ...MOCK_JOB, is_remote: false }} />);
    expect(screen.queryByText('REMOTE')).not.toBeInTheDocument();
  });

  it('renders skill tags parsed from the comma-separated skills string', () => {
    renderWithProviders(<JobCard job={MOCK_JOB} />);
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Django')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('links the title to the job detail route', () => {
    renderWithProviders(<JobCard job={MOCK_JOB} />);
    expect(screen.getByRole('link', { name: 'Senior Python Developer' })).toHaveAttribute(
      'href',
      '/jobs/42'
    );
  });

  it('renders an accessible apply link that opens in a new tab', () => {
    renderWithProviders(<JobCard job={MOCK_JOB} />);
    const applyLink = screen.getByRole('link', { name: /Apply for Senior Python Developer/i });
    expect(applyLink).toHaveAttribute('href', MOCK_JOB.apply_url);
    expect(applyLink).toHaveAttribute('target', '_blank');
    expect(applyLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('gracefully handles a job with no skills, salary, or experience', () => {
    const sparseJob: Job = {
      ...MOCK_JOB,
      skills: null,
      salary: null,
      experience: null,
    };
    renderWithProviders(<JobCard job={sparseJob} />);
    expect(screen.getByText('Senior Python Developer')).toBeInTheDocument();
  });
});
