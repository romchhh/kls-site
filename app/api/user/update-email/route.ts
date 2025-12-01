import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "USER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { newEmail } = body;

    if (!newEmail) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existing && existing.id !== session.user.id) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { email: newEmail.trim() },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        clientCode: true,
      },
    });

    return NextResponse.json(
      { message: "Email updated successfully", user: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating email:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

