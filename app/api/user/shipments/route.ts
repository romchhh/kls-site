import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shipments = await prisma.shipment.findMany({
      where: { userId: session.user.id },
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
      
      return {
        ...shipment,
        pieces,
        weightKg: totalWeight > 0 ? totalWeight : null,
        volumeM3: totalVolume > 0 ? totalVolume : null,
        packingCost: shipment.packingCost ? shipment.packingCost.toString() : null,
        localDeliveryCost: shipment.localDeliveryCost ? shipment.localDeliveryCost.toString() : null,
        totalCost: shipment.totalCost ? shipment.totalCost.toString() : null,
        items: shipment.items.map((item) => {
          return {
            id: item.id,
            shipmentId: item.shipmentId,
            placeNumber: item.placeNumber,
            trackNumber: item.trackNumber,
            localTracking: item.localTracking,
            description: item.description,
            quantity: item.quantity,
            insuranceValue: item.insuranceValue ? item.insuranceValue.toString() : null,
            insurancePercent: item.insurancePercent ? item.insurancePercent.toString() : null,
            lengthCm: item.lengthCm ? item.lengthCm.toString() : null,
            widthCm: item.widthCm ? item.widthCm.toString() : null,
            heightCm: item.heightCm ? item.heightCm.toString() : null,
            weightKg: item.weightKg ? item.weightKg.toString() : null,
            volumeM3: item.volumeM3 ? item.volumeM3.toString() : null,
            density: item.density ? item.density.toString() : null,
            tariffType: item.tariffType,
            tariffValue: item.tariffValue ? item.tariffValue.toString() : null,
            deliveryCost: item.deliveryCost ? item.deliveryCost.toString() : null,
            cargoType: item.cargoType,
            cargoTypeCustom: item.cargoTypeCustom,
            note: item.note,
            photoUrl: item.photoUrl,
          };
        }),
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


