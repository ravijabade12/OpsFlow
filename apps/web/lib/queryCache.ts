/**
 * Tiny in-memory TTL cache for identical GET-style API count/list helpers.
 * Avoids repeat round-trips when navigating Dashboard ↔ Analytics or
 * reopening the same agent/customer drawer within a short window.
 */
type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const store = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) {
    return undefined;
  }
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function setCached<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export async function withCache<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
): Promise<T> {
  const hit = getCached<T>(key);
  if (hit !== undefined) {
    return hit;
  }
  const value = await loader();
  setCached(key, value, ttlMs);
  return value;
}

export function clearQueryCache(): void {
  store.clear();
}
