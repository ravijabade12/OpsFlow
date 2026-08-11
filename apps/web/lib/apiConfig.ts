import { DEFAULT_API_BASE_URL } from "@opsflow/shared";

/**
 * REST API base URL. JSON Server will be wired in Phase 2.
 * Override with NEXT_PUBLIC_API_BASE_URL for deployed environments.
 */
export const apiConfig = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    DEFAULT_API_BASE_URL,
} as const;

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${apiConfig.baseUrl}${normalized}`;
}
