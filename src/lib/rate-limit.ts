/**
 * Simple in-memory rate limiter for serverless environments.
 * Provides basic protection against rapid-fire abuse on the same instance.
 * For production, swap to @upstash/ratelimit with Redis for cross-instance limiting.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function rateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  cleanup();
  
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      reset: now + windowMs,
    };
  }

  if (entry.count >= options.limit) {
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  entry.count++;
  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - entry.count,
    reset: entry.resetAt,
  };
}

/**
 * Extract client IP from request headers (Vercel/Cloudflare compatible)
 */
export function getClientIp(request: Request): string {
  return (
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
