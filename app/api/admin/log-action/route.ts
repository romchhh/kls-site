import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const { actionType, targetType, targetId, description, metadata } = body;

    // Create action log
    const action = await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType,
        targetType,
        targetId,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    // Increment actions count
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        actionsCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, action }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

