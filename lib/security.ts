import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import crypto from "crypto";
import path from "path";
import bcrypt from "bcryptjs";

/**
 * Security headers middleware
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Enable XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");
  
  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // HSTS (HTTP Strict Transport Security) - тільки для HTTPS
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  
  // Content Security Policy (покращений)
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  );
  
  // Permissions Policy
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), usb=()"
  );

  return response;
}

/**
 * IP Whitelist check for admin routes
 * Set ALLOWED_ADMIN_IPS in .env (comma-separated)
 */
export async function checkAdminIPWhitelist(
  req: NextRequest
): Promise<boolean> {
  const allowedIPs = process.env.ALLOWED_ADMIN_IPS?.split(",").map((ip) =>
    ip.trim()
  );

  if (!allowedIPs || allowedIPs.length === 0) {
    // If no whitelist configured, allow all (for development)
    return true;
  }

  const clientIP =
    (req as any).ip ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  return allowedIPs.includes(clientIP);
}

/**
 * Validate and sanitize input
 */
export function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, "")
      .trim()
      .substring(0, 10000); // Max length
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === "object" && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }
  return input;
}

/**
 * Check for SQL injection patterns (додаткова перевірка)
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\bUNION\b.*\bSELECT\b)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Validate request body for admin endpoints
 */
export function validateAdminRequest(body: any): {
  valid: boolean;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  // Check for suspicious patterns in string fields
  for (const key in body) {
    if (typeof body[key] === "string" && detectSQLInjection(body[key])) {
      return {
        valid: false,
        error: "Potentially malicious input detected",
      };
    }
  }

  return { valid: true };
}

/**
 * Log security event to database
 */
export async function logSecurityEvent(
  type: string,
  details: any,
  req: NextRequest
) {
  const ip = (req as any).ip || req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  console.warn(`[SECURITY] ${type}`, {
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
    details,
  });

  // Log to database
  try {
    await prisma.adminAction.create({
      data: {
        adminId: "system",
        actionType: `SECURITY_${type}`,
        targetType: "SECURITY_EVENT",
        description: JSON.stringify({
          ip,
          userAgent,
          details,
          pathname: req.nextUrl.pathname,
        }),
        metadata: JSON.stringify({
          timestamp: new Date().toISOString(),
        }),
      },
    });
  } catch (error) {
    // Fallback to console if DB fails
    console.error("Failed to log security event to DB:", error);
  }
}

/**
 * CSRF Protection - Verify Origin header
 */
export function verifyCSRF(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");

  // Allow same-origin requests
  if (!origin && !referer) {
    return true; // Same-origin request
  }

  // Check origin
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

  // Check referer
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

/**
 * Path traversal protection
 */
export function sanitizePath(filePath: string): string | null {
  // Remove any path traversal attempts
  const normalized = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, "");
  
  // Check for remaining dangerous patterns
  if (normalized.includes("..") || normalized.includes("//") || normalized.includes("\\\\")) {
    return null;
  }
  
  return normalized;
}

/**
 * Password strength validation
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Prevent enumeration attacks - always return same response time for login
 */
export async function safeLoginCheck(
  email: string,
  password: string
): Promise<{ valid: boolean; user: any }> {
  const startTime = Date.now();
  
  // Always perform hash operation to prevent timing attacks
  const dummyHash = await bcrypt.hash("dummy", 10);
  
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email.trim() },
        { clientCode: email.trim() },
      ],
    },
  });

  let isValid = false;
  if (user) {
    isValid = await bcrypt.compare(password, user.password);
  } else {
    // Still perform comparison to prevent timing attacks
    await bcrypt.compare(password, dummyHash);
  }

  // Normalize response time
  const elapsed = Date.now() - startTime;
  const minTime = 200; // Minimum response time in ms
  if (elapsed < minTime) {
    await new Promise((resolve) => setTimeout(resolve, minTime - elapsed));
  }

  return {
    valid: isValid && user !== null,
    user: isValid ? user : null,
  };
}

