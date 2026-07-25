import { useDarkMode } from '@/hooks/useDarkMode';

export function DarkModeToggle() {
  const [isDark, toggle] = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="h-9 w-9 flex items-center justify-center rounded border border-line dark:border-line-dark bg-panel dark:bg-panel-dark hover:border-navy dark:hover:border-amber transition-colors"
    >
      <span aria-hidden="true" className="text-base leading-none">
        {isDark ? '☀' : '☾'}
      </span>
    </button>
  );
}
