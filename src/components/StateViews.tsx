interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Loading jobs…' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-20 text-ink-soft dark:text-ink-dark-soft"
    >
      <span
        className="h-6 w-6 animate-spin rounded-full border-2 border-line dark:border-line-dark border-t-navy dark:border-t-amber"
        aria-hidden="true"
      />
      <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 py-20 text-center px-6"
    >
      <div className="font-semibold text-ink dark:text-ink-dark">Something went wrong</div>
      <p className="text-sm text-ink-soft dark:text-ink-dark-soft max-w-md">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 font-mono text-xs uppercase tracking-wider px-4 py-2 border border-ink dark:border-ink-dark rounded bg-ink dark:bg-ink-dark text-paper dark:text-paper-dark hover:opacity-90"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center px-6">
      <div className="font-semibold text-ink dark:text-ink-dark">No jobs match these filters</div>
      <p className="text-sm text-ink-soft dark:text-ink-dark-soft max-w-md">
        Try widening your search, clearing a filter, or check back after the next hourly scrape.
      </p>
    </div>
  );
}
