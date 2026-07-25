import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Job } from '@/types/job';
import { parseSkills } from '@/types/job';

export const ROW_HEIGHT = 96;

interface JobRowProps {
  job: Job;
  style: React.CSSProperties;
}

/**
 * A single fixed-height row for the virtualized list (react-window requires
 * a constant item size for its fast path). Text is single-line and
 * truncated rather than wrapped so every row renders at exactly ROW_HEIGHT
 * regardless of content length - the flip side of virtualization is you
 * give up variable-height cards for consistent, cheap-to-measure rows.
 */
function JobRowBase({ job, style }: JobRowProps) {
  const skills = parseSkills(job.skills);

  return (
    <div
      style={style}
      className="border-b border-line dark:border-line-dark px-4 sm:px-5 flex items-center gap-4 hover:bg-[#FBFAF6] dark:hover:bg-[#1F2430] transition-colors"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <Link
            to={`/jobs/${job.id}`}
            className="font-semibold text-[15px] truncate hover:underline decoration-navy dark:decoration-amber underline-offset-2"
          >
            {job.title}
          </Link>
          {job.is_remote && (
            <span className="shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-amber-soft dark:bg-amber-soft-dark text-[#7A4E10] dark:text-amber">
              REMOTE
            </span>
          )}
        </div>
        <div className="text-[13px] text-ink-soft dark:text-ink-dark-soft truncate mt-0.5">
          {job.company}
          {job.location ? ` · ${job.location}` : ''}
          {job.experience ? ` · ${job.experience}` : ''}
        </div>
        {skills.length > 0 && (
          <div className="flex gap-1.5 mt-1.5 overflow-hidden">
            {skills.slice(0, 5).map((skill) => (
              <span key={skill} className="skill-tag shrink-0">
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
  );
}

export const JobRow = memo(JobRowBase);
