import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT - Update API token (activate/deactivate)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { isActive } = body;

    const token = await prisma.apiToken.findUnique({
      where: { id },
    });

    if (!token) {
      return NextResponse.json(
        { error: "Токен не знайдено" },
        { status: 404 }
      );
    }

    const updated = await prisma.apiToken.update({
      where: { id },
      data: {
        isActive: isActive !== undefined ? isActive : token.isActive,
      },
    });

    // Log action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "UPDATE_API_TOKEN",
        targetType: "API_TOKEN",
        targetId: id,
        description: `Updated API token: ${updated.name} (${isActive ? "активовано" : "деактивовано"})`,
      },
    });

    return NextResponse.json(
      { message: "Токен успішно оновлено", token: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating API token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete API token
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const token = await prisma.apiToken.findUnique({
      where: { id },
    });

    if (!token) {
      return NextResponse.json(
        { error: "Токен не знайдено" },
        { status: 404 }
      );
    }

    await prisma.apiToken.delete({
      where: { id },
    });

    // Log action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "DELETE_API_TOKEN",
        targetType: "API_TOKEN",
        targetId: id,
        description: `Deleted API token: ${token.name}`,
      },
    });

    return NextResponse.json(
      { message: "Токен успішно видалено" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting API token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

