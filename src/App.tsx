import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/StateViews';
import HomePage from '@/pages/HomePage';

// Only the home page (the default landing route) ships in the main bundle.
// The detail and 404 pages are separate chunks, fetched on demand the first
// time a user navigates to them - keeps the initial bundle smaller.
const JobDetailPage = lazy(() => import('@/pages/JobDetailPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<LoadingState label="Loading page…" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <footer className="text-center py-6 font-mono text-[11px] text-ink-soft dark:text-ink-dark-soft">
        Job Listings Aggregator · React + TypeScript + Redux Toolkit + TanStack Query
      </footer>
    </div>
  );
}
