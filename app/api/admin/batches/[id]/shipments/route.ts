import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get shipments not in any batch (available for adding to batch)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get shipments that are not in any batch (batchId is null)
    const availableShipments = await (prisma as any).shipment.findMany({
      where: {
        batchId: null,
      },
      select: {
        id: true,
        internalTrack: true,
        status: true,
        clientCode: true,
        cargoLabel: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
            clientCode: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ shipments: availableShipments }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching available shipments:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Add shipment to batch
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: batchId } = await params;
    const body = await req.json();
    const { shipmentId } = body;

    if (!shipmentId) {
      return NextResponse.json(
        { error: "ID вантажу обов'язковий" },
        { status: 400 }
      );
    }

    // Check if batch exists
    const batch = await (prisma as any).batch.findUnique({
      where: { id: batchId },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Партія не знайдена" },
        { status: 404 }
      );
    }

    // Check if shipment exists
    const shipment = await (prisma as any).shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "Вантаж не знайдено" },
        { status: 404 }
      );
    }

    // Check if shipment is already in another batch
    if (shipment.batchId && shipment.batchId !== batchId) {
      return NextResponse.json(
        { error: "Вантаж вже знаходиться в іншій партії" },
        { status: 400 }
      );
    }

    // Add shipment to batch
    await (prisma as any).shipment.update({
      where: { id: shipmentId },
      data: { batchId },
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "ADD_SHIPMENT_TO_BATCH",
        targetType: "SHIPMENT",
        targetId: shipmentId,
        description: `Додано вантаж ${shipment.internalTrack} до партії ${batch.batchId}`,
      },
    });

    return NextResponse.json(
      { message: "Вантаж успішно додано до партії" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding shipment to batch:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove shipment from batch
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: batchId } = await params;
    const { searchParams } = new URL(req.url);
    const shipmentId = searchParams.get("shipmentId");

    if (!shipmentId) {
      return NextResponse.json(
        { error: "ID вантажу обов'язковий" },
        { status: 400 }
      );
    }

    // Check if shipment exists and is in this batch
    const shipment = await (prisma as any).shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "Вантаж не знайдено" },
        { status: 404 }
      );
    }

    if (shipment.batchId !== batchId) {
      return NextResponse.json(
        { error: "Вантаж не належить до цієї партії" },
        { status: 400 }
      );
    }

    // Remove shipment from batch
    await (prisma as any).shipment.update({
      where: { id: shipmentId },
      data: { batchId: null },
    });

    // Log admin action
    const batch = await (prisma as any).batch.findUnique({
      where: { id: batchId },
      select: { batchId: true },
    });

    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "REMOVE_SHIPMENT_FROM_BATCH",
        targetType: "SHIPMENT",
        targetId: shipmentId,
        description: `Видалено вантаж ${shipment.internalTrack} з партії ${batch?.batchId || batchId}`,
      },
    });

    return NextResponse.json(
      { message: "Вантаж успішно видалено з партії" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error removing shipment from batch:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

