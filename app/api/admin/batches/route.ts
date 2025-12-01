import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get all batches
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const batches = await (prisma as any).batch.findMany({
      include: {
        shipments: {
          select: {
            id: true,
            internalTrack: true,
            status: true,
            clientCode: true,
            cargoLabel: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ batches }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new batch
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { batchId, description } = body;

    if (!batchId || batchId.trim() === "") {
      return NextResponse.json(
        { error: "ID партії обов'язковий" },
        { status: 400 }
      );
    }

    // Check if batchId already exists
    const existing = await (prisma as any).batch.findUnique({
      where: { batchId },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Партія з ID "${batchId}" вже існує` },
        { status: 409 }
      );
    }

    const batch = await (prisma as any).batch.create({
      data: {
        batchId,
        description: description || null,
      },
      include: {
        shipments: {
          select: {
            id: true,
            internalTrack: true,
            status: true,
            clientCode: true,
            cargoLabel: true,
            createdAt: true,
          },
        },
      },
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "CREATE_BATCH",
        targetType: "BATCH",
        targetId: batch.id,
        description: `Створено партію ${batchId}`,
      },
    });

    return NextResponse.json({ batch }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating batch:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update batch
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, batchId, description } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID партії обов'язковий" },
        { status: 400 }
      );
    }

    const existing = await (prisma as any).batch.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Партія не знайдена" },
        { status: 404 }
      );
    }

    // If batchId is being changed, check if new batchId already exists
    if (batchId && batchId !== existing.batchId) {
      const duplicate = await (prisma as any).batch.findUnique({
        where: { batchId },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: `Партія з ID "${batchId}" вже існує` },
          { status: 409 }
        );
      }
    }

    const batch = await (prisma as any).batch.update({
      where: { id },
      data: {
        batchId: batchId || existing.batchId,
        description: description !== undefined ? description : existing.description,
      },
      include: {
        shipments: {
          select: {
            id: true,
            internalTrack: true,
            status: true,
            clientCode: true,
            cargoLabel: true,
            createdAt: true,
          },
        },
      },
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "UPDATE_BATCH",
        targetType: "BATCH",
        targetId: batch.id,
        description: `Оновлено партію ${batch.batchId}`,
      },
    });

    return NextResponse.json({ batch }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating batch:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete batch
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID партії обов'язковий" },
        { status: 400 }
      );
    }

    const existing = await (prisma as any).batch.findUnique({
      where: { id },
      include: {
        shipments: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Партія не знайдена" },
        { status: 404 }
      );
    }

    // Check if batch has shipments
    if (existing.shipments && existing.shipments.length > 0) {
      return NextResponse.json(
        { error: `Неможливо видалити партію, оскільки вона містить ${existing.shipments.length} вантаж(ів)` },
        { status: 400 }
      );
    }

    await (prisma as any).batch.delete({
      where: { id },
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "DELETE_BATCH",
        targetType: "BATCH",
        targetId: id,
        description: `Видалено партію ${existing.batchId}`,
      },
    });

    return NextResponse.json(
      { message: "Партія видалена успішно" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting batch:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

