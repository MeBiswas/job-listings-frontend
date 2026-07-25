import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time errors in its subtree so one broken component (e.g. a
 * malformed job record) doesn't take down the entire page. Class component
 * because React error boundaries currently have no hook equivalent.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In a production setup this is where you'd forward to an error-tracking
    // service (Sentry, etc). Logged to console here to keep the project
    // dependency-free.
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (error) {
      if (this.props.fallback) return this.props.fallback(error, this.reset);
      return (
        <div role="alert" className="flex flex-col items-center gap-3 py-20 text-center px-6">
          <div className="font-semibold text-ink dark:text-ink-dark">
            This part of the page hit an error
          </div>
          <p className="text-sm text-ink-soft dark:text-ink-dark-soft max-w-md">
            {error.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-2 font-mono text-xs uppercase tracking-wider px-4 py-2 border border-ink dark:border-ink-dark rounded bg-ink dark:bg-ink-dark text-paper dark:text-paper-dark hover:opacity-90"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
