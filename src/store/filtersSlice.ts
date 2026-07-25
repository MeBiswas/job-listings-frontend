import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_FILTERS, type JobFilters } from '@/types/job';

export type FiltersState = JobFilters;

const initialState: FiltersState = { ...DEFAULT_FILTERS };

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload || undefined;
      state.page = 1; // any filter change resets pagination
    },
    setSkill(state, action: PayloadAction<string>) {
      state.skill = action.payload || undefined;
      state.page = 1;
    },
    setLocation(state, action: PayloadAction<string>) {
      state.location = action.payload || undefined;
      state.page = 1;
    },
    setCompany(state, action: PayloadAction<string>) {
      state.company = action.payload || undefined;
      state.page = 1;
    },
    setSource(state, action: PayloadAction<string>) {
      state.source = action.payload || undefined;
      state.page = 1;
    },
    setRemote(state, action: PayloadAction<boolean>) {
      state.remote = action.payload || undefined;
      state.page = 1;
    },
    setMinExperience(state, action: PayloadAction<number | undefined>) {
      state.min_experience = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    /** Applies one of the dashboard's quick-filter presets in one shot. */
    applyPreset(
      state,
      action: PayloadAction<'python' | 'remote' | 'senior' | 'mohali' | 'bangalore'>
    ) {
      state.search = undefined;
      state.skill = undefined;
      state.location = undefined;
      state.min_experience = undefined;
      state.remote = undefined;
      state.page = 1;

      switch (action.payload) {
        case 'python':
          state.skill = 'Python';
          break;
        case 'remote':
          state.remote = true;
          break;
        case 'senior':
          state.min_experience = 4;
          break;
        case 'mohali':
          state.location = 'Mohali';
          break;
        case 'bangalore':
          state.location = 'Bangalore';
          break;
      }
    },
    resetFilters() {
      return { ...DEFAULT_FILTERS };
    },
  },
});

export const {
  setSearch,
  setSkill,
  setLocation,
  setCompany,
  setSource,
  setRemote,
  setMinExperience,
  setPage,
  applyPreset,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
