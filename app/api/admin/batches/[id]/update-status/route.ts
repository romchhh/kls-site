import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocationForStatus } from "@/lib/utils/shipmentAutomation";
import { createInvoiceForShipment } from "@/lib/utils/invoiceGeneration";

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
    const { status, location: providedLocation, description, createInvoice } = body;

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

    // Отримуємо routeFrom та routeTo з першого вантажу в партії (якщо є)
    const firstShipment = batch.shipments && batch.shipments.length > 0 ? batch.shipments[0] : null;
    const routeFrom = firstShipment?.routeFrom || null;
    const routeTo = firstShipment?.routeTo || null;
    
    // Автоматично встановлюємо місцезнаходження на основі статусу
    const finalLocation = providedLocation || getLocationForStatus(status as any, routeFrom, routeTo);

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

    // Оновлюємо статус партії, щоб він відповідав статусу вантажів
    await (prisma as any).batch.update({
      where: { id: batch.id },
      data: {
        status: status as any,
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

    // Створюємо інвойси, якщо статус змінюється на ON_UA_WAREHOUSE і адмін підтвердив створення
    let invoicesCreated = 0;
    if (status === "ON_UA_WAREHOUSE" && createInvoice === true) {
      // Створюємо інвойси тільки для вантажів, які ще не мають інвойсів
      for (const shipment of shipments) {
        const hasInvoice = await prisma.invoice.findFirst({
          where: { shipmentId: shipment.id },
        });

        if (!hasInvoice) {
          try {
            const invoiceId = await createInvoiceForShipment(shipment.id);
            if (invoiceId) {
              invoicesCreated++;
            }
          } catch (invoiceError) {
            console.error(`Error creating invoice for shipment ${shipment.id}:`, invoiceError);
            // Продовжуємо для інших вантажів, навіть якщо один не вдався
          }
        }
      }
    }

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "BATCH_UPDATE_STATUS",
        targetType: "BATCH",
        targetId: batch.id,
        description: `Оновлено статус партії ${batch.batchId} та ${updatedShipments.count} вантажів`,
      },
    });

    return NextResponse.json(
      {
        message: `Статус оновлено для ${updatedShipments.count} вантажів`,
        updatedCount: updatedShipments.count,
        invoicesCreated: invoicesCreated,
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

