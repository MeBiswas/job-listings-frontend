import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  applyPreset,
  resetFilters,
  setLocation,
  setMinExperience,
  setRemote,
  setSkill,
  setSource,
} from '@/store/filtersSlice';
import { useStats } from '@/hooks/useStats';
import { SearchBar } from './SearchBar';

const PRESETS: { key: 'python' | 'remote' | 'senior' | 'mohali' | 'bangalore'; label: string }[] = [
  { key: 'python', label: 'Python jobs' },
  { key: 'remote', label: 'Remote jobs' },
  { key: 'senior', label: '4+ years' },
  { key: 'mohali', label: 'Mohali' },
  { key: 'bangalore', label: 'Bangalore' },
];

export function FilterPanel() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const { data: stats } = useStats();

  const sourceOptions = useMemo(() => Object.keys(stats?.by_source ?? {}), [stats]);

  // Which preset (if any) matches the current filter state exactly - lets
  // the matching chip render as "active" even after a page reload.
  const activePreset = useMemo(() => {
    if (filters.skill === 'Python' && !filters.remote && !filters.location && !filters.min_experience)
      return 'python';
    if (filters.remote && !filters.skill && !filters.location && !filters.min_experience)
      return 'remote';
    if (filters.min_experience === 4 && !filters.skill && !filters.location && !filters.remote)
      return 'senior';
    if (filters.location === 'Mohali' && !filters.skill && !filters.remote && !filters.min_experience)
      return 'mohali';
    if (filters.location === 'Bangalore' && !filters.skill && !filters.remote && !filters.min_experience)
      return 'bangalore';
    return null;
  }, [filters]);

  return (
    <section className="panel p-4 sm:p-5 mb-5" aria-label="Job filters">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        <SearchBar />

        <div className="field">
          <label htmlFor="skill-input" className="filter-label">
            Skill
          </label>
          <input
            id="skill-input"
            type="text"
            value={filters.skill ?? ''}
            onChange={(e) => dispatch(setSkill(e.target.value))}
            placeholder="e.g. Python"
            className="filter-input"
          />
        </div>

        <div className="field">
          <label htmlFor="location-input" className="filter-label">
            Location
          </label>
          <input
            id="location-input"
            type="text"
            value={filters.location ?? ''}
            onChange={(e) => dispatch(setLocation(e.target.value))}
            placeholder="e.g. Mohali"
            className="filter-input"
          />
        </div>

        <div className="field">
          <label htmlFor="experience-input" className="filter-label">
            Min. experience (yrs)
          </label>
          <input
            id="experience-input"
            type="number"
            min={0}
            value={filters.min_experience ?? ''}
            onChange={(e) =>
              dispatch(
                setMinExperience(e.target.value === '' ? undefined : Number(e.target.value))
              )
            }
            placeholder="e.g. 4"
            className="filter-input"
          />
        </div>

        <div className="field">
          <label htmlFor="source-select" className="filter-label">
            Source
          </label>
          <select
            id="source-select"
            value={filters.source ?? ''}
            onChange={(e) => dispatch(setSource(e.target.value))}
            className="filter-input"
          >
            <option value="">All sources</option>
            {sourceOptions.map((source) => (
              <option key={source} value={source}>
                {source} ({stats?.by_source[source]})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2 pb-0.5">
          <input
            id="remote-checkbox"
            type="checkbox"
            checked={filters.remote ?? false}
            onChange={(e) => dispatch(setRemote(e.target.checked))}
            className="h-4 w-4 accent-navy dark:accent-amber"
          />
          <label htmlFor="remote-checkbox" className="text-sm">
            Remote only
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Quick filter presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => dispatch(applyPreset(preset.key))}
              aria-pressed={activePreset === preset.key}
              className={`font-mono text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                activePreset === preset.key
                  ? 'bg-navy dark:bg-amber border-navy dark:border-amber text-white dark:text-ink'
                  : 'border-line dark:border-line-dark text-ink-soft dark:text-ink-dark-soft hover:border-navy dark:hover:border-amber hover:text-navy dark:hover:text-amber'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 border border-line dark:border-line-dark rounded text-ink-soft dark:text-ink-dark-soft hover:border-ink dark:hover:border-ink-dark hover:text-ink dark:hover:text-ink-dark"
        >
          Reset filters
        </button>
      </div>
    </section>
  );
}
