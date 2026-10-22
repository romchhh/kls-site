import { NextRequest } from "next/server";
import type { User } from "@prisma/client";
import { prisma } from "./prisma";
import path from "path";
import bcrypt from "bcryptjs";

// Re-export edge-safe helpers for Node API routes
export {
  addSecurityHeaders,
  checkAdminIPWhitelist,
  verifyCSRF,
} from "./security-edge";

/**
 * Log security event to database (Node runtime only).
 */
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
  });

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
    console.error("Failed to log security event to DB:", error);
  }
}

export function sanitizeInput(input: unknown): unknown {
  if (typeof input === "string") {
    return input.replace(/[<>]/g, "").trim().substring(0, 10000);
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === "object" && input !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const key in input as Record<string, unknown>) {
      sanitized[key] = sanitizeInput((input as Record<string, unknown>)[key]);
    }
    return sanitized;
  }
  return input;
}

export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\bUNION\b.*\bSELECT\b)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

export function validateAdminRequest(body: unknown): {
  valid: boolean;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  for (const key in body as Record<string, unknown>) {
    const value = (body as Record<string, unknown>)[key];
    if (typeof value === "string" && detectSQLInjection(value)) {
      return {
        valid: false,
        error: "Potentially malicious input detected",
      };
    }
  }

  return { valid: true };
}

export function sanitizePath(filePath: string): string | null {
  const normalized = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, "");

  if (
    normalized.includes("..") ||
    normalized.includes("//") ||
    normalized.includes("\\\\")
  ) {
    return null;
  }

  return normalized;
}

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

export async function safeLoginCheck(
  email: string,
  password: string
): Promise<{ valid: boolean; user: User | null }> {
  const startTime = Date.now();

  const dummyHash = await bcrypt.hash("dummy", 10);

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: email.trim() }, { clientCode: email.trim() }],
    },
  });

  if (process.env.NODE_ENV === "development") {
    console.log("[AUTH DEBUG] Login attempt:", {
      email: email.trim(),
      userFound: !!user,
      userEmail: user?.email,
      userRole: user?.role,
    });
  }

  let isValid = false;
  if (user) {
    isValid = await bcrypt.compare(password, user.password);

    if (process.env.NODE_ENV === "development") {
      console.log("[AUTH DEBUG] Password check:", {
        isValid,
        passwordLength: password.length,
      });
    }
  } else {
    await bcrypt.compare(password, dummyHash);

    if (process.env.NODE_ENV === "development") {
      console.log("[AUTH DEBUG] User not found for:", email.trim());
    }
  }

  const elapsed = Date.now() - startTime;
  const minTime = 200;
  if (elapsed < minTime) {
    await new Promise((resolve) => setTimeout(resolve, minTime - elapsed));
  }

  return {
    valid: isValid && user !== null,
    user: isValid ? user : null,
  };
}
