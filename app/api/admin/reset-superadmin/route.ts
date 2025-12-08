import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST - Reset superadmin password (for emergency access)
export async function POST(req: NextRequest) {
  try {
    // In production, require token. In development, allow without token for convenience
    if (process.env.NODE_ENV === "production") {
      const authHeader = req.headers.get("authorization");
      const expectedToken = process.env.RESET_ADMIN_TOKEN || "emergency-reset-token-change-me";

      if (authHeader !== `Bearer ${expectedToken}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const body = await req.json();
    const { email = "superadmin@gmail.com", password = "superadmin" } = body;

    // Find or create superadmin
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!existing) {
      // Create new superadmin
      const superAdmin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: "Super Admin",
          phone: "+380000000000",
          role: "SUPERADMIN",
          clientCode: "SUP1",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Superadmin created successfully",
        email: superAdmin.email,
        password: password, // Return plain password for reference
      });
    } else {
      // Update existing user
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          password: hashedPassword,
          role: "SUPERADMIN", // Ensure role is SUPERADMIN
        },
      });

      return NextResponse.json({
        success: true,
        message: "Superadmin password reset successfully",
        email: existing.email,
        password: password, // Return plain password for reference
      });
    }
  } catch (error: any) {
    console.error("Error resetting superadmin:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

