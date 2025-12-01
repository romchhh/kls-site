import { NextRequest, NextResponse } from "next/server";

// In-memory store for rate limiting (для production використовуйте Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Cleanup every minute

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  identifier?: (req: NextRequest) => string; // Custom identifier function
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, identifier } = options;

  return async (req: NextRequest): Promise<NextResponse | null> => {
    // Get identifier (IP address by default)
    const id = identifier
      ? identifier(req)
      : req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";

    const now = Date.now();
    const key = `${id}:${Math.floor(now / windowMs)}`;

    // Get current count
    const record = rateLimitStore.get(key);
    const currentCount = record && record.resetTime > now ? record.count : 0;

    // Check if limit exceeded
    if (currentCount >= maxRequests) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Increment count
    rateLimitStore.set(key, {
      count: currentCount + 1,
      resetTime: now + windowMs,
    });

    return null; // Continue to next middleware/handler
  };
}

// Pre-configured rate limiters
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
});

export const adminRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute for admin
});

export const exportRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 exports per hour
});

