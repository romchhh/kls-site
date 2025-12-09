import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAutoStatus, getLocationForStatus } from "@/lib/utils/shipmentAutomation";

// This endpoint should be called by a cron job (e.g., Vercel Cron, or external cron service)
// It automatically updates shipment statuses based on dates and delivery type

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret (for security)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Find shipments that need status updates
    const shipmentsToUpdate = await prisma.shipment.findMany({
      where: {
        status: {
          in: ["RECEIVED_CN", "IN_TRANSIT", "ARRIVED_UA"],
        },
        receivedAtWarehouse: {
          not: null,
        },
      },
      include: {
        user: {
          select: {
            clientCode: true,
          },
        },
      },
    });

    let updatedCount = 0;

    for (const shipment of shipmentsToUpdate) {
      const receivedDate = shipment.receivedAtWarehouse ? new Date(shipment.receivedAtWarehouse) : null;
      const sentDate = shipment.sentAt ? new Date(shipment.sentAt) : null;
      const deliveredDate = shipment.deliveredAt ? new Date(shipment.deliveredAt) : null;
      const etaDate = shipment.eta ? new Date(shipment.eta) : null;

      // Використовуємо утиліту для автоматичного визначення статусу
      const autoStatusData = getAutoStatus(
        receivedDate,
        sentDate,
        deliveredDate,
        etaDate,
        shipment.deliveryType as any,
        shipment.status as any
      );

      // Оновлюємо вантаж, якщо статус змінився
      if (autoStatusData.status && autoStatusData.status !== shipment.status) {
        const newLocation = autoStatusData.location || getLocationForStatus(
          autoStatusData.status,
          shipment.routeFrom,
          shipment.routeTo
        );

        await prisma.shipment.update({
          where: { id: shipment.id },
          data: {
            status: autoStatusData.status as any,
            location: newLocation,
          },
        });

        // Створюємо запис в історії статусів
        await prisma.shipmentStatusHistory.create({
          data: {
            shipmentId: shipment.id,
            status: autoStatusData.status as any,
            location: newLocation,
            description: autoStatusData.description || "Автоматичне оновлення статусу",
          },
        });

        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      total: shipmentsToUpdate.length,
    });
  } catch (error: any) {
    console.error("Error updating shipment statuses:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

