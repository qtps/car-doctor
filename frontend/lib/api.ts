const configuredUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
export const apiBaseUrl = `${configuredUrl.replace(/\/+$/, '').replace(/\/api$/, '')}/api`;
export const isDemoMode = process.env.NODE_ENV !== 'production';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError('The backend is not reachable. Start the backend to save this change.', 0);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message ?? 'The request could not be completed.';
    throw new ApiError(message, response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function isBackendUnavailable(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 0;
}
