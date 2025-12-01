import { NextRequest } from "next/server";
import { prisma } from "./prisma";

/**
 * Verify Bearer token from Authorization header
 * Returns the token record if valid, null otherwise
 */
export async function verifyApiToken(request: NextRequest): Promise<{
  valid: boolean;
  token?: {
    id: string;
    name: string;
    createdBy: string;
  };
  error?: string;
}> {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        valid: false,
        error: "Bearer token is required",
      };
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Find token in database
    const apiToken = await prisma.apiToken.findUnique({
      where: { token },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!apiToken) {
      return {
        valid: false,
        error: "Invalid token",
      };
    }

    // Check if token is active
    if (!apiToken.isActive) {
      return {
        valid: false,
        error: "Token is deactivated",
      };
    }

    // Check if token is expired
    if (apiToken.expiresAt && new Date() > apiToken.expiresAt) {
      return {
        valid: false,
        error: "Token has expired",
      };
    }

    // Update last used timestamp
    await prisma.apiToken.update({
      where: { id: apiToken.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      valid: true,
      token: {
        id: apiToken.id,
        name: apiToken.name,
        createdBy: apiToken.createdBy,
      },
    };
  } catch (error: any) {
    console.error("Error verifying API token:", error);
    return {
      valid: false,
      error: "Token verification failed",
    };
  }
}

