import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyApiToken } from "@/lib/api-auth";

// POST - Authenticate client by client_code and password
export async function POST(req: NextRequest) {
  try {
    // Verify Bearer token
    const tokenVerification = await verifyApiToken(req);
    if (!tokenVerification.valid) {
      return NextResponse.json(
        {
          is_client: false,
          message: tokenVerification.error || "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { client_code, password } = body;

    if (!client_code || !password) {
      return NextResponse.json(
        {
          is_client: false,
          message: "client_code та password обов'язкові",
        },
        { status: 400 }
      );
    }

    // Find user by client code
    const user = await prisma.user.findUnique({
      where: {
        clientCode: client_code.trim(),
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        password: true,
      },
    });

    if (!user) {
      // Use same timing as successful login to prevent enumeration
      await bcrypt.compare(password, "$2a$10$dummyHashToPreventTimingAttacks");
      return NextResponse.json(
        {
          is_client: false,
          message: "Невірний код клієнта або пароль",
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          is_client: false,
          message: "Невірний код клієнта або пароль",
        },
        { status: 401 }
      );
    }

    // Return client data (without password)
    return NextResponse.json(
      {
        is_client: true,
        client_data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in client auth:", error);
    return NextResponse.json(
      {
        is_client: false,
        message: "Внутрішня помилка сервера",
      },
      { status: 500 }
    );
  }
}

