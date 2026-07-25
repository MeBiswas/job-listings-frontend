import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearch } from '@/store/filtersSlice';
import { useDebounce } from '@/hooks/useDebounce';

export function SearchBar() {
  const dispatch = useAppDispatch();
  const currentSearch = useAppSelector((state) => state.filters.search) ?? '';

  const [inputValue, setInputValue] = useState(currentSearch);
  const debouncedValue = useDebounce(inputValue, 400);

  // Dispatch to Redux only once typing settles, not on every keystroke -
  // this is what keeps the API from firing a request per character typed.
  useEffect(() => {
    dispatch(setSearch(debouncedValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="field">
      <label htmlFor="search-input" className="filter-label">
        Search
      </label>
      <input
        id="search-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="title, company, skill…"
        className="filter-input"
        aria-describedby="search-hint"
      />
      <span id="search-hint" className="sr-only">
        Results update automatically shortly after you stop typing.
      </span>
    </div>
  );
}
