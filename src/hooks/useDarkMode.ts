import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Persists dark-mode preference to localStorage (via useLocalStorage) and
 * keeps the `dark` class on <html> in sync so Tailwind's `dark:` variants
 * apply. Defaults to the OS-level preference on first visit.
 */
export function useDarkMode(): [boolean, () => void] {
  const prefersDark =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;

  const [isDark, setIsDark] = useLocalStorage<boolean>('job-aggregator:dark-mode', prefersDark);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return [isDark, toggle];
}
