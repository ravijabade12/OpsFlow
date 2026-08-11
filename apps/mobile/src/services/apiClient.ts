import { apiUrl } from "./apiConfig";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export interface ApiResponseMeta {
  totalCount: number | null;
}

export interface ApiResult<T> {
  data: T;
  meta: ApiResponseMeta;
}

function buildInit(options: RequestOptions = {}): RequestInit {
  const { body, headers, ...rest } = options;

  return {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new ApiError(
      text || `Request failed with status ${response.status}`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(apiUrl(path), buildInit(options));
  return parseResponse<T>(response);
}

export async function apiRequestWithMeta<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const response = await fetch(apiUrl(path), buildInit(options));
  const data = await parseResponse<T>(response);
  const totalHeader = response.headers.get("X-Total-Count");
  const totalCount =
    totalHeader !== null && totalHeader !== ""
      ? Number.parseInt(totalHeader, 10)
      : null;

  return {
    data,
    meta: {
      totalCount: Number.isFinite(totalCount) ? totalCount : null,
    },
  };
}

export function toQueryString(
  params: Record<string, string | number | boolean | null | undefined>,
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    search.set(key, String(value));
  }

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
