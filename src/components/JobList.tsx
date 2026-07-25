import { useMemo } from 'react';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import type { Job } from '@/types/job';
import { JobCard } from './JobCard';
import { JobRow, ROW_HEIGHT } from './JobRow';

interface JobListProps {
  jobs: Job[];
}

// Below this count, plain cards look better (full card layout, no scroll
// container within the page) - virtualization's payoff only shows up once
// there are enough rows that rendering them all would actually cost
// something. Above it, react-window keeps the DOM node count constant
// regardless of how many results are on the page (e.g. a page_size=100
// query), which is the actual performance win worth demonstrating.
const VIRTUALIZATION_THRESHOLD = 15;

function Row({ index, style, data }: ListChildComponentProps<Job[]>) {
  const job = data[index];
  return <JobRow job={job} style={style} />;
}

export function JobList({ jobs }: JobListProps) {
  const listHeight = useMemo(() => Math.min(jobs.length * ROW_HEIGHT, 640), [jobs.length]);

  if (jobs.length > VIRTUALIZATION_THRESHOLD) {
    return (
      <div role="list" aria-label="Job results (virtualized)">
        <FixedSizeList
          height={listHeight}
          itemCount={jobs.length}
          itemSize={ROW_HEIGHT}
          width="100%"
          itemData={jobs}
        >
          {Row}
        </FixedSizeList>
      </div>
    );
  }

  return (
    <div role="list" aria-label="Job results">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
