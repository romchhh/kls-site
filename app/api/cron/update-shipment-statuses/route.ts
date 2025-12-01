import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This endpoint should be called by a cron job (e.g., Vercel Cron, or external cron service)
// It automatically updates shipment statuses based on dates

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
      if (!shipment.receivedAtWarehouse) continue;

      const receivedDate = new Date(shipment.receivedAtWarehouse);
      const sentDate = shipment.sentAt ? new Date(shipment.sentAt) : null;
      
      // Calculate expected dates
      const expectedSentDate = new Date(receivedDate);
      expectedSentDate.setDate(expectedSentDate.getDate() + 3);

      const transitDays =
        shipment.deliveryType === "SEA"
          ? 40
          : shipment.deliveryType === "RAIL"
          ? 18
          : shipment.deliveryType === "MULTIMODAL"
          ? 25
          : 21; // AIR

      const expectedArrivedDate = sentDate
        ? new Date(sentDate)
        : new Date(expectedSentDate);
      expectedArrivedDate.setDate(expectedArrivedDate.getDate() + transitDays);

      let newStatus = shipment.status;
      let newLocation = shipment.location;
      let updateSentAt = false;
      let updateDeliveredAt = false;

      // Update status based on dates
      if (shipment.status === "RECEIVED_CN" && today >= expectedSentDate) {
        // 3 days after receivedAtWarehouse -> IN_TRANSIT
        newStatus = "IN_TRANSIT";
        newLocation = shipment.routeTo === "UA" ? "В дорозі до України" : "В дорозі";
        updateSentAt = true;
      } else if (
        shipment.status === "IN_TRANSIT" &&
        today >= expectedArrivedDate
      ) {
        // After transit days -> ARRIVED_UA
        newStatus = "ARRIVED_UA";
        newLocation = "Прибуло в Україну";
        updateDeliveredAt = true;
      }

      // Update shipment if status changed
      if (newStatus !== shipment.status) {
        await prisma.shipment.update({
          where: { id: shipment.id },
          data: {
            status: newStatus,
            location: newLocation,
            sentAt: updateSentAt && !shipment.sentAt ? expectedSentDate : shipment.sentAt,
            deliveredAt: updateDeliveredAt && !shipment.deliveredAt ? expectedArrivedDate : shipment.deliveredAt,
          },
        });

        // Create status history entry
        await prisma.shipmentStatusHistory.create({
          data: {
            shipmentId: shipment.id,
            status: newStatus as any,
            location: newLocation,
            description: `Автоматичне оновлення статусу`,
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

