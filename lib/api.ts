export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  json?: unknown;
};

/**
 * Minimal wrapper around fetch for custom (non-better-auth) API endpoints.
 * Always sends cookies so better-auth session is attached.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { json, headers, ...rest } = options;
  const init: RequestInit = {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...rest,
  };
  if (json !== undefined) {
    init.body = JSON.stringify(json);
  }

  const response = await fetch(path, init);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let code: string | undefined;
    try {
      const data = (await response.json()) as {
        message?: string | string[];
        error?: string;
      };
      if (Array.isArray(data?.message)) message = data.message.join(", ");
      else if (typeof data?.message === "string") message = data.message;
      if (typeof data?.error === "string") code = data.error;
    } catch {
      // ignore JSON parse errors, keep default message
    }
    throw new ApiError(message, response.status, code);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
