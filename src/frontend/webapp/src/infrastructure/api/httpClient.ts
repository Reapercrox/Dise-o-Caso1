import { sessionManager } from '../cognito/sessionManager';
import { appInsights } from '../observability/appInsights';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  attempt = 1
): Promise<T> {
  const token = await sessionManager.getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const start = Date.now();

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const elapsed = Date.now() - start;
    appInsights.trackDependency(path, elapsed, response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      throw new HttpError(response.status, errorText);
    }

    return response.json() as Promise<T>;
  } catch (err) {
    const isRetryable =
      err instanceof HttpError
        ? err.status >= 500 || err.status === 429
        : true; // network errors

    if (isRetryable && attempt < MAX_RETRIES) {
      await sleep(RETRY_DELAY_MS * attempt);
      return request<T>(method, path, body, attempt + 1);
    }

    throw err;
  }
}

/** Single entrypoint for all HTTP calls (Facade) */
export const httpClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
