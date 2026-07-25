import { useCallback, useEffect, useState } from 'react';

/**
 * Generic localStorage-backed piece of state, with the same API shape as
 * `useState`. Used for dark-mode preference, but written generically so it
 * can back any small piece of persisted UI state.
 *
 * Syncs across browser tabs via the `storage` event, and fails safely
 * (falls back to in-memory state) if localStorage is unavailable - e.g.
 * private browsing modes that throw on access.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // localStorage unavailable (e.g. private browsing quota) -
          // state still updates in memory for this tab.
        }
        return next;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch {
          // ignore malformed external writes
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
