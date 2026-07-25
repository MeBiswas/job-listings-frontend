# Job Listings Frontend

A React + TypeScript frontend for a job listings aggregator.

This app provides a searchable, filterable interface for browsing jobs from multiple scraping sources. It is built with Vite, Redux Toolkit, TanStack Query, React Router, and Tailwind CSS.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
  - [Core Layers](#core-layers)
  - [State Management](#state-management)
  - [Data Fetching](#data-fetching)
  - [Routing](#routing)
  - [Performance](#performance)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment](#environment)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Notes](#notes)

## Features

- Search jobs by title, company, or keyword.
- Filter by skill, location, experience, source, and remote status.
- Paginated results with client-side page controls.
- Job detail page with full job metadata and apply link.
- Live summary stats in the header.
- Dark mode toggle persisted in local storage.
- Robust error and loading states.

## Architecture

### Core Layers

- `src/main.tsx` bootstraps the app.
  - `React.StrictMode`
  - `ErrorBoundary`
  - `Redux Provider`
  - `QueryClientProvider` for TanStack Query
  - `BrowserRouter`

- `src/App.tsx` defines routes and lazy-loads secondary pages:
  - `/` → `HomePage`
  - `/jobs/:id` → `JobDetailPage`
  - `*` → `NotFoundPage`

### State Management

- Redux Toolkit stores UI filters in `src/store/filtersSlice.ts`.
- Filter state includes `search`, `skill`, `location`, `company`, `source`, `remote`, `min_experience`, `page`, and `page_size`.
- Store configuration lives in `src/store/store.ts`.
- Typed hooks are exported from `src/store/hooks.ts`.

### Data Fetching

- `src/api/client.ts` creates an Axios client with a `baseURL` from `VITE_API_BASE_URL`.
- `src/api/jobsApi.ts` defines backend operations:
  - `fetchJobs` → `GET /jobs`
  - `fetchJobById` → `GET /jobs/:id`
  - `fetchStats` → `GET /stats`
  - `triggerScrape` → `POST /scrape/trigger`

- React Query hooks:
  - `src/hooks/useJobs.ts` fetches paginated job listings and caches them.
  - `src/hooks/useJobDetail.ts` fetches one job by ID.
  - `src/hooks/useStats.ts` polls live statistics every 60 seconds.

### Routing

- `react-router-dom` handles navigation.
- `Routes` and `Route` define page paths.
- `JobDetailPage` uses route params and navigation helpers.

### Performance

- `React.lazy` and `Suspense` lazy-load the detail and 404 pages.
- `react-window` virtualizes the job list for large result sets.
- `React.memo` is used in `Header` and `JobCard` to reduce re-renders.
- `keepPreviousData` prevents list flashing while filters or pages change.

## Project Structure

- `src/`
  - `App.tsx` — shell and application routes.
  - `main.tsx` — application bootstrap and providers.
  - `api/` — backend client and API endpoints.
  - `components/` — reusable UI components.
  - `hooks/` — custom hooks for fetching, dark mode, debounce, and local storage.
  - `pages/` — page-level components.
  - `store/` — Redux slice and store setup.
  - `types/` — shared TypeScript models and helpers.

### Important files

- `src/pages/HomePage.tsx` — main search page with filters, results, and pagination.
- `src/pages/JobDetailPage.tsx` — job detail view with metadata and apply link.
- `src/components/FilterPanel.tsx` — the filter UI and preset actions.
- `src/components/JobList.tsx` — renders job cards or virtualized rows.
- `src/components/JobCard.tsx` — preview card for each job result.
- `src/components/Header.tsx` — live statistics, dark mode toggle, and branding.
- `src/components/StateViews.tsx` — loading, error, and empty states.
- `src/hooks/useDarkMode.ts` — persists theme state and updates the document class.
- `src/hooks/useLocalStorage.ts` — generic local storage-backed state hook.

## Getting Started

### Prerequisites

- Node.js 20+ recommended.
- npm.

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local URL shown by Vite.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Environment

Create a `.env` file in the repo root or use `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> Vite only exposes environment variables prefixed with `VITE_` to browser code.

## Scripts

- `npm run dev` — start development server.
- `npm run build` — build production assets.
- `npm run preview` — preview the production build locally.
- `npm run lint` — run ESLint.
- `npm run test` — run Jest tests.
- `npm run test:watch` — run Jest in watch mode.
- `npm run test:coverage` — run Jest with coverage.

## Configuration

- `vite.config.ts` configures Vite, React plugin, path alias `@`, and source maps.
- `tsconfig.app.json` contains app-specific TypeScript compiler options.
- `tsconfig.node.json` contains Node/Esm config for Vite and Jest environment files.
- `vercel.json` configures Vercel deployment for Vite with client-side routing.

## Deployment

The repo includes Vercel configuration:

- `framework`: `vite`
- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- `rewrites`: all routes forward to `index.html` for SPA routing.

## Notes

- This frontend is designed to work with a matching backend API schema. Update `src/types/job.ts` if the backend changes.
- Dark mode preference is stored in `localStorage` and synced across browser tabs.
- Filter changes reset pagination to page `1`.
- The app uses a clean query param builder to avoid empty or undefined query values.

## License

No license is specified. Add one if you want to share or publish this repository.
