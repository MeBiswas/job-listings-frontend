import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoadingState, ErrorState, EmptyState } from '../StateViews';
import { ErrorBoundary } from '../ErrorBoundary';

describe('LoadingState', () => {
  it('renders an accessible status region', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('supports a custom label', () => {
    render(<LoadingState label="Loading job…" />);
    expect(screen.getByText('Loading job…')).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('renders the error message in an alert region', () => {
    render(<ErrorState message="Could not reach the API." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Could not reach the API.');
  });

  it('calls onRetry when the retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    render(<ErrorState message="Failed" onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('omits the retry button when onRetry is not provided', () => {
    render(<ErrorState message="Failed" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('renders guidance for the user', () => {
    render(<EmptyState />);
    expect(screen.getByText(/No jobs match these filters/i)).toBeInTheDocument();
  });
});

function Bomb(): never {
  throw new Error('Simulated render crash');
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // React (and our boundary's own componentDidCatch) both log to
    // console.error for a caught render error - silence that expected
    // noise for this test only.
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>All good</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('catches a render error and shows a fallback UI instead of crashing', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Simulated render crash');
  });

  it('supports a custom fallback renderer', () => {
    render(
      <ErrorBoundary fallback={(error) => <div>Custom: {error.message}</div>}>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom: Simulated render crash')).toBeInTheDocument();
  });
});
