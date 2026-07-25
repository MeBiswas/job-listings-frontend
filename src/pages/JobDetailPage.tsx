import { Link, useNavigate, useParams } from 'react-router-dom';
import { useJobDetail } from '@/hooks/useJobDetail';
import { LoadingState, ErrorState } from '@/components/StateViews';
import { getErrorMessage } from '@/api/client';
import { parseSkills } from '@/types/job';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const jobId = params.id ? Number(params.id) : undefined;

  const { data: job, isLoading, isError, error, refetch } = useJobDetail(jobId);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-8 pb-16 pt-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="font-mono text-xs uppercase tracking-wider text-ink-soft dark:text-ink-dark-soft hover:text-navy dark:hover:text-amber mb-5 inline-block"
      >
        ← Back to results
      </button>

      <div className="panel p-6 sm:p-8">
        {isLoading && <LoadingState label="Loading job…" />}
        {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}

        {job && (
          <>
            <p className="font-mono text-[11px] tracking-widest uppercase text-amber mb-2">
              {job.source}
              {job.is_remote ? ' · Remote' : ''}
            </p>
            <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
            <p className="text-ink-soft dark:text-ink-dark-soft mb-6">
              {job.company}
              {job.location ? ` · ${job.location}` : ''}
            </p>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-sm mb-6">
              <div>
                <dt className="filter-label">Experience</dt>
                <dd>{job.experience ?? '—'}</dd>
              </div>
              <div>
                <dt className="filter-label">Salary</dt>
                <dd>{job.salary ?? '—'}</dd>
              </div>
              <div>
                <dt className="filter-label">Posted</dt>
                <dd>{job.posted_date ?? '—'}</dd>
              </div>
              <div>
                <dt className="filter-label">Scraped</dt>
                <dd>{new Date(job.scraped_at).toLocaleString()}</dd>
              </div>
            </dl>

            {parseSkills(job.skills).length > 0 && (
              <div className="mb-8">
                <div className="filter-label mb-2">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {parseSkills(job.skills).map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-xs uppercase tracking-wider px-5 py-2.5 border border-ink dark:border-ink-dark rounded bg-ink dark:bg-ink-dark text-paper dark:text-paper-dark hover:opacity-90"
            >
              Apply for this role →
            </a>
          </>
        )}

        {!isLoading && !isError && !job && (
          <p className="text-ink-soft dark:text-ink-dark-soft">
            Job not found. <Link to="/" className="underline">Back to search</Link>
          </p>
        )}
      </div>
    </main>
  );
}
