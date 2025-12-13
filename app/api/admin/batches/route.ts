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
            userId: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map deliveryType enum values for frontend
    const batchesWithDeliveryType = batches.map((batch: any) => ({
      ...batch,
      deliveryType: batch.deliveryType || "AIR", // Default to AIR if not set
    }));

    return NextResponse.json({ batches: batchesWithDeliveryType }, { status: 200 });
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
    const { description, deliveryType } = body;

    if (!deliveryType) {
      return NextResponse.json(
        { error: "Тип доставки обов'язковий" },
        { status: 400 }
      );
    }

    // Validate deliveryType enum value
    const validDeliveryTypes = ["AIR", "SEA", "RAIL", "MULTIMODAL"];
    if (!validDeliveryTypes.includes(deliveryType)) {
      return NextResponse.json(
        { error: `Невірний тип доставки. Дозволені значення: ${validDeliveryTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Generate batchId automatically (format: XXXXXX, starting from 000001)
    // Get all batches and find the highest numeric batchId
    const allBatches = await (prisma as any).batch.findMany({
      select: { batchId: true },
      orderBy: { createdAt: "desc" },
    });

    let nextNumber = 1;
    if (allBatches.length > 0) {
      // Find the maximum numeric batchId
      const numericBatchIds = allBatches
        .map((b: any) => {
          const num = parseInt(b.batchId, 10);
          return isNaN(num) ? 0 : num;
        })
        .filter((n: number) => n > 0);
      
      if (numericBatchIds.length > 0) {
        nextNumber = Math.max(...numericBatchIds) + 1;
      }
    }

    // Format as XXXXXX (6 digits with leading zeros)
    const batchId = String(nextNumber).padStart(6, "0");

    // Check if batchId already exists (shouldn't happen, but just in case)
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
        deliveryType,
        status: "CREATED", // Default status for new batches
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
    const { id, description, deliveryType, status } = body;

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

    // Validate status if provided
    if (status !== undefined) {
      const validStatuses = ["CREATED", "RECEIVED_CN", "CONSOLIDATION", "IN_TRANSIT", "ARRIVED_UA", "ON_UA_WAREHOUSE", "DELIVERED", "ARCHIVED"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Невірний статус. Дозволені значення: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // batchId cannot be changed - it's auto-generated
    const batch = await (prisma as any).batch.update({
      where: { id },
      data: {
        description: description !== undefined ? description : existing.description,
        deliveryType: deliveryType !== undefined ? deliveryType : existing.deliveryType,
        status: status !== undefined ? status : existing.status,
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
            routeFrom: true,
            routeTo: true,
          },
        },
      },
    });

    // Якщо статус партії змінився, синхронізуємо статуси всіх вантажів в партії
    if (status !== undefined && status !== existing.status) {
      const firstShipment = batch.shipments && batch.shipments.length > 0 ? batch.shipments[0] : null;
      const routeFrom = firstShipment?.routeFrom || null;
      const routeTo = firstShipment?.routeTo || null;
      
      // Автоматично встановлюємо місцезнаходження на основі статусу
      const { getLocationForStatus } = await import("@/lib/utils/shipmentAutomation");
      const finalLocation = getLocationForStatus(status as any, routeFrom, routeTo);

      // Update all shipments in batch to match batch status
      await prisma.shipment.updateMany({
        where: {
          batchId: batch.id,
        },
        data: {
          status: status as any,
          location: finalLocation || undefined,
        },
      });

      // Create status history entries for all updated shipments
      const shipments = await prisma.shipment.findMany({
        where: { batchId: batch.id },
        select: { id: true },
      });

      const statusHistoryEntries = shipments.map((shipment) => ({
        shipmentId: shipment.id,
        status: status as any,
        location: finalLocation || null,
        description: `Синхронізація статусу з партією ${batch.batchId}`,
      }));

      await prisma.shipmentStatusHistory.createMany({
        data: statusHistoryEntries,
      });
    }

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

