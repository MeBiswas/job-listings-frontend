import { memo } from 'react';
import { useStats } from '@/hooks/useStats';
import { DarkModeToggle } from './DarkModeToggle';

function HeaderBase() {
  const { data: stats } = useStats();

  return (
    <header className="border-b-2 border-ink dark:border-ink-dark px-6 sm:px-8 py-5 flex flex-wrap justify-between items-end gap-4">
      <div>
        <p className="font-mono text-[11px] tracking-widest uppercase text-amber m-0 mb-1.5">
          Multi-source · Refreshed hourly
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight m-0">
          Job Listings Aggregator
        </h1>
      </div>

      <div className="flex items-end gap-6">
        <dl className="flex gap-6 font-mono" aria-label="Live job statistics">
          <div className="text-right">
            <dd className="text-xl font-semibold text-navy dark:text-amber leading-none m-0">
              {stats?.total_jobs ?? '–'}
            </dd>
            <dt className="text-[10px] tracking-wider uppercase text-ink-soft dark:text-ink-dark-soft mt-1">
              Total jobs
            </dt>
          </div>
          <div className="text-right">
            <dd className="text-xl font-semibold text-navy dark:text-amber leading-none m-0">
              {stats?.remote_jobs ?? '–'}
            </dd>
            <dt className="text-[10px] tracking-wider uppercase text-ink-soft dark:text-ink-dark-soft mt-1">
              Remote
            </dt>
          </div>
          <div className="text-right">
            <dd className="text-xl font-semibold text-navy dark:text-amber leading-none m-0">
              {stats ? Object.keys(stats.by_source).length : '–'}
            </dd>
            <dt className="text-[10px] tracking-wider uppercase text-ink-soft dark:text-ink-dark-soft mt-1">
              Sources
            </dt>
          </div>
        </dl>

        <DarkModeToggle />
      </div>
    </header>
  );
}

// The stats ticker polls every 60s; memoizing the header means a stats
// refresh only re-renders this component, not the entire app (filters,
// job list, etc. below it stay untouched).
export const Header = memo(HeaderBase);
