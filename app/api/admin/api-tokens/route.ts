import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// GET - Get all API tokens
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tokens = await prisma.apiToken.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Mask tokens for security (show only first 8 and last 4 characters)
    const maskedTokens = tokens.map((token) => ({
      id: token.id,
      name: token.name,
      token: `${token.token.substring(0, 8)}...${token.token.substring(token.token.length - 4)}`,
      fullToken: token.token, // Include full token for display when just created
      createdBy: token.creator.name,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      isActive: token.isActive,
      lastUsedAt: token.lastUsedAt,
    }));

    return NextResponse.json({ tokens: maskedTokens }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching API tokens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new API token
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, expiresInDays } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Назва токена обов'язкова (мінімум 2 символи)" },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = `kls_${crypto.randomBytes(32).toString("hex")}`;

    // Calculate expiration date if provided
    let expiresAt: Date | null = null;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create token
    const apiToken = await prisma.apiToken.create({
      data: {
        name: name.trim(),
        token,
        createdBy: session.user.id,
        expiresAt,
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Log action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "CREATE_API_TOKEN",
        targetType: "API_TOKEN",
        targetId: apiToken.id,
        description: `Created API token: ${name}`,
      },
    });

    return NextResponse.json(
      {
        message: "API токен успішно створено",
        token: {
          id: apiToken.id,
          name: apiToken.name,
          token: apiToken.token, // Return full token only on creation
          createdAt: apiToken.createdAt,
          expiresAt: apiToken.expiresAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating API token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

