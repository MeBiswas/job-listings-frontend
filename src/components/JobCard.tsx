import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Job } from '@/types/job';
import { parseSkills } from '@/types/job';

interface JobCardProps {
  job: Job;
}

function JobCardBase({ job }: JobCardProps) {
  const skills = parseSkills(job.skills);

  return (
    <article className="border-b border-line dark:border-line-dark px-4 sm:px-5 py-4 hover:bg-[#FBFAF6] dark:hover:bg-[#1F2430] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            to={`/jobs/${job.id}`}
            className="font-semibold text-[15px] hover:underline decoration-navy dark:decoration-amber underline-offset-2"
          >
            {job.title}
          </Link>
          {job.is_remote && (
            <span className="ml-2 inline-block font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-amber-soft dark:bg-amber-soft-dark text-[#7A4E10] dark:text-amber align-middle">
              REMOTE
            </span>
          )}
          <div className="text-[13px] text-ink-soft dark:text-ink-dark-soft mt-0.5">
            {job.company}
            {job.location ? ` · ${job.location}` : ''}
          </div>

          <dl className="flex flex-wrap gap-x-4 gap-y-1 mt-2 font-mono text-xs text-ink-soft dark:text-ink-dark-soft">
            {job.experience && (
              <div>
                <dt className="inline">Exp: </dt>
                <dd className="inline">{job.experience}</dd>
              </div>
            )}
            {job.salary && (
              <div>
                <dt className="inline">Pay: </dt>
                <dd className="inline">{job.salary}</dd>
              </div>
            )}
            <div>
              <dt className="inline">Source: </dt>
              <dd className="inline">{job.source}</dd>
            </div>
          </dl>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {skills.slice(0, 6).map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-mono text-xs text-navy dark:text-amber border-b border-navy dark:border-amber hover:text-ink dark:hover:text-ink-dark hover:border-ink dark:hover:border-ink-dark whitespace-nowrap"
          aria-label={`Apply for ${job.title} at ${job.company} (opens in a new tab)`}
        >
          Apply →
        </a>
      </div>
    </article>
  );
}

// Job rows are the highest-frequency re-render target in this app (every
// filter change, page change, and stats poll touches the list's parent).
// Memoizing means React skips re-rendering the ~20 unchanged cards on
// screen and only updates the ones whose underlying job data actually
// changed - most visible when combined with the virtualized list below.
export const JobCard = memo(JobCardBase);
