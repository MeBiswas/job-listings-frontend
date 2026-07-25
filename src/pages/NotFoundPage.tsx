import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-8 py-24 text-center">
      <p className="font-mono text-[11px] tracking-widest uppercase text-amber mb-3">404</p>
      <h1 className="text-2xl font-bold mb-3">Page not found</h1>
      <p className="text-ink-soft dark:text-ink-dark-soft mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block font-mono text-xs uppercase tracking-wider px-5 py-2.5 border border-ink dark:border-ink-dark rounded bg-ink dark:bg-ink-dark text-paper dark:text-paper-dark hover:opacity-90"
      >
        Back to search
      </Link>
    </main>
  );
}
