import { NextRequest, NextResponse } from "next/server";

/**
 * Edge-safe security helpers (no Node built-ins / Prisma / bcrypt).
 * Used by middleware — keep this file free of `path`, `crypto`, `fs`, etc.
 */

export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  );

  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), usb=()"
  );

  return response;
}

export async function checkAdminIPWhitelist(req: NextRequest): Promise<boolean> {
  const allowedIPs = process.env.ALLOWED_ADMIN_IPS?.split(",").map((ip) =>
    ip.trim()
  );

  if (!allowedIPs || allowedIPs.length === 0) {
    return true;
  }

  const clientIP =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  return allowedIPs.includes(clientIP);
}

export function verifyCSRF(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");

  if (!origin && !referer) {
    return true;
  }

  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return false;
      }
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host !== host) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

/** Console-only logger for Edge middleware (no DB). */
export async function logSecurityEvent(
  type: string,
  details: unknown,
  req: NextRequest
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  console.warn(`[SECURITY] ${type}`, {
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
    details,
    pathname: req.nextUrl.pathname,
  });
}
