import { Platform } from "react-native";
import { DEFAULT_API_BASE_URL } from "@opsflow/shared";

/**
 * Android emulator cannot reach the host via `localhost`.
 * Use 10.0.2.2 to hit the machine running JSON Server.
 */
function resolveApiBaseUrl(): string {
  if (Platform.OS === "android") {
    return DEFAULT_API_BASE_URL.replace("localhost", "10.0.2.2");
  }
  return DEFAULT_API_BASE_URL;
}

export const apiConfig = {
  baseUrl: resolveApiBaseUrl(),
} as const;

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${apiConfig.baseUrl}${normalized}`;
}
