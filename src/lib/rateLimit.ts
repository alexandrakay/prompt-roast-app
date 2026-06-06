interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const defaultStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  ip: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
  store: Map<string, RateLimitEntry> = defaultStore
): { allowed: boolean; remaining: number } {
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
