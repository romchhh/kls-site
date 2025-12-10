import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocationForStatus } from "@/lib/utils/shipmentAutomation";

// PUT - Update status for all shipments in a batch
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, location: providedLocation, description } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Статус обов'язковий" },
        { status: 400 }
      );
    }

    // Find batch
    const batch = await (prisma as any).batch.findUnique({
      where: { id },
      include: {
        shipments: true,
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Партія не знайдена" },
        { status: 404 }
      );
    }

    // Автоматично встановлюємо місцезнаходження на основі статусу
    const finalLocation = providedLocation || getLocationForStatus(status as any, batch.routeFrom, batch.routeTo);

    // Update all shipments in batch
    const updatedShipments = await prisma.shipment.updateMany({
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
      description: description || `Масове оновлення статусу для партії ${batch.batchId}`,
    }));

    await prisma.shipmentStatusHistory.createMany({
      data: statusHistoryEntries,
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "BATCH_UPDATE_STATUS",
        targetType: "BATCH",
        targetId: batch.id,
        description: `Оновлено статус для ${updatedShipments.count} вантажів в партії ${batch.batchId}`,
      },
    });

    return NextResponse.json(
      {
        message: `Статус оновлено для ${updatedShipments.count} вантажів`,
        updatedCount: updatedShipments.count,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating batch status:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

