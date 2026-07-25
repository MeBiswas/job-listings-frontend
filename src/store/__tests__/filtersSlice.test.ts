import filtersReducer, {
  applyPreset,
  resetFilters,
  setLocation,
  setMinExperience,
  setPage,
  setRemote,
  setSearch,
  setSkill,
} from '../filtersSlice';
import { DEFAULT_FILTERS } from '@/types/job';

describe('filtersSlice', () => {
  it('returns the default state', () => {
    expect(filtersReducer(undefined, { type: '@@INIT' })).toEqual(DEFAULT_FILTERS);
  });

  it('sets search and resets pagination to page 1', () => {
    const state = filtersReducer({ ...DEFAULT_FILTERS, page: 3 }, setSearch('python dev'));
    expect(state.search).toBe('python dev');
    expect(state.page).toBe(1);
  });

  it('clears a filter when set to an empty string', () => {
    const withSkill = filtersReducer(DEFAULT_FILTERS, setSkill('Python'));
    const cleared = filtersReducer(withSkill, setSkill(''));
    expect(cleared.skill).toBeUndefined();
  });

  it('sets location filter', () => {
    const state = filtersReducer(DEFAULT_FILTERS, setLocation('Mohali'));
    expect(state.location).toBe('Mohali');
  });

  it('sets remote filter', () => {
    const state = filtersReducer(DEFAULT_FILTERS, setRemote(true));
    expect(state.remote).toBe(true);
  });

  it('sets min_experience, allowing undefined to clear it', () => {
    const withExp = filtersReducer(DEFAULT_FILTERS, setMinExperience(4));
    expect(withExp.min_experience).toBe(4);
    const cleared = filtersReducer(withExp, setMinExperience(undefined));
    expect(cleared.min_experience).toBeUndefined();
  });

  it('updates the page without resetting other filters', () => {
    const withSkill = filtersReducer(DEFAULT_FILTERS, setSkill('Python'));
    const nextPage = filtersReducer(withSkill, setPage(2));
    expect(nextPage.page).toBe(2);
    expect(nextPage.skill).toBe('Python');
  });

  it('applies the "python" preset', () => {
    const state = filtersReducer(DEFAULT_FILTERS, applyPreset('python'));
    expect(state.skill).toBe('Python');
    expect(state.remote).toBeUndefined();
    expect(state.location).toBeUndefined();
  });

  it('applies the "remote" preset', () => {
    const state = filtersReducer(DEFAULT_FILTERS, applyPreset('remote'));
    expect(state.remote).toBe(true);
  });

  it('applies the "senior" preset (4+ years)', () => {
    const state = filtersReducer(DEFAULT_FILTERS, applyPreset('senior'));
    expect(state.min_experience).toBe(4);
  });

  it('applies the "mohali" and "bangalore" location presets', () => {
    expect(filtersReducer(DEFAULT_FILTERS, applyPreset('mohali')).location).toBe('Mohali');
    expect(filtersReducer(DEFAULT_FILTERS, applyPreset('bangalore')).location).toBe('Bangalore');
  });

  it('applying a preset clears filters set by a previous preset', () => {
    const withPython = filtersReducer(DEFAULT_FILTERS, applyPreset('python'));
    const withRemote = filtersReducer(withPython, applyPreset('remote'));
    expect(withRemote.skill).toBeUndefined();
    expect(withRemote.remote).toBe(true);
  });

  it('resets to default filters', () => {
    const dirty = filtersReducer(DEFAULT_FILTERS, setSkill('Python'));
    const reset = filtersReducer(dirty, resetFilters());
    expect(reset).toEqual(DEFAULT_FILTERS);
  });
});
