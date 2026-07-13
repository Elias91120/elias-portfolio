type Counter = { count: number; resetAt: number };

type Bucket = {
  minute: Counter;
  window: Counter;
};

const store = new Map<string, Bucket>();

/** Burst: enough for a short back-and-forth, not for scripted spam. */
const MINUTE_LIMIT = 6;
const MINUTE_MS = 60_000;

/** Sliding window: generous for real visitors, blocks sustained abuse. */
const WINDOW_LIMIT = 40;
const WINDOW_MS = 15 * 60_000;

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

function freshCounter(ttlMs: number, now: number): Counter {
  return { count: 0, resetAt: now + ttlMs };
}

function pruneStale(now: number) {
  if (store.size <= 500) return;
  for (const [key, bucket] of store) {
    if (bucket.minute.resetAt < now && bucket.window.resetAt < now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  pruneStale(now);

  let bucket = store.get(key);
  if (!bucket) {
    bucket = {
      minute: freshCounter(MINUTE_MS, now),
      window: freshCounter(WINDOW_MS, now),
    };
    store.set(key, bucket);
  }

  if (now >= bucket.minute.resetAt) {
    bucket.minute = freshCounter(MINUTE_MS, now);
  }
  if (now >= bucket.window.resetAt) {
    bucket.window = freshCounter(WINDOW_MS, now);
  }

  const minuteBlocked = bucket.minute.count >= MINUTE_LIMIT;
  const windowBlocked = bucket.window.count >= WINDOW_LIMIT;

  if (minuteBlocked || windowBlocked) {
    const resetAt = minuteBlocked
      ? bucket.minute.resetAt
      : bucket.window.resetAt;
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil(resetAt / 1000),
    };
  }

  bucket.minute.count += 1;
  bucket.window.count += 1;

  return {
    success: true,
    remaining: WINDOW_LIMIT - bucket.window.count,
    reset: Math.ceil(bucket.window.resetAt / 1000),
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}
