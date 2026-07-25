import axios from 'axios';

// Configure via a .env file (see .env.example) - Vite only exposes vars
// prefixed with VITE_ to client code. Falls back to localhost so `npm run
// dev` works against a locally-running backend with zero setup.
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Narrow, human-readable error message extraction for the UI layer. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'The request timed out. The API may be slow or unreachable.';
    }
    if (!error.response) {
      return 'Could not reach the API. Check that the backend is running and VITE_API_BASE_URL is correct.';
    }
    const detail = (error.response.data as { detail?: string } | undefined)?.detail;
    return detail || `Request failed with status ${error.response.status}.`;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}
