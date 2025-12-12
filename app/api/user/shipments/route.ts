import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatDecimal,
  formatPackingCost,
  formatLocalDeliveryCost,
  formatShipmentItem,
} from "@/lib/utils/api-formatting";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shipments = await prisma.shipment.findMany({
      where: { 
        userId: session.user.id,
        // Hide shipments with CREATED status (Очікується на складі) from clients
        status: { not: "CREATED" }
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          orderBy: { placeNumber: "asc" },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Format shipments with calculated values
    const formattedShipments = shipments.map((shipment) => {
      // Calculate totals from items
      const pieces = shipment.items.length;
      const totalWeight = shipment.items.reduce((sum, item) => {
        const weight = item.weightKg ? Number(item.weightKg) : 0;
        return sum + (isNaN(weight) ? 0 : weight);
      }, 0);
      const totalVolume = shipment.items.reduce((sum, item) => {
        const volume = item.volumeM3 ? Number(item.volumeM3) : 0;
        return sum + (isNaN(volume) ? 0 : volume);
      }, 0);
      
      // Format packingCost - return if exists (ignore boolean field)
      const packingCost = formatPackingCost(shipment.packing, shipment.packingCost);

      // Format localDeliveryCost - return if exists (ignore boolean field)
      const localDeliveryCost = formatLocalDeliveryCost(shipment.localDeliveryToDepot, shipment.localDeliveryCost);

      // Exclude batchId from response for user
      const { batchId, ...shipmentWithoutBatchId } = shipment;
      
      return {
        ...shipmentWithoutBatchId,
        pieces,
        weightKg: formatDecimal(totalWeight > 0 ? totalWeight : null),
        volumeM3: formatDecimal(totalVolume > 0 ? totalVolume : null),
        packing: shipment.packing,
        packingCost: packingCost,
        localDeliveryToDepot: shipment.localDeliveryToDepot,
        localDeliveryCost: localDeliveryCost,
        totalCost: formatDecimal(shipment.totalCost),
        items: shipment.items.map((item) => ({
          ...formatShipmentItem(item),
            shipmentId: item.shipmentId,
        })),
      };
    });

    return NextResponse.json({ shipments: formattedShipments });
  } catch (error) {
    console.error("Error loading user shipments", error);
    return NextResponse.json(
      { error: "Failed to load shipments" },
      { status: 500 },
    );
  }
}


