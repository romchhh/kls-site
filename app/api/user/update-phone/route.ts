import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { newPhone } = body as { newPhone?: string };

    if (!newPhone || newPhone.trim().length < 5) {
      return NextResponse.json(
        { error: "Phone is required" },
        { status: 400 },
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { phone: newPhone.trim() },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    });

    return NextResponse.json(
      { message: "Phone updated successfully", user: updated },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


