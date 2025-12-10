import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiToken } from "@/lib/api-auth";
import {
  formatDecimal,
  formatPackingCost,
  formatLocalDeliveryCost,
  formatShipmentItem,
} from "@/lib/utils/api-formatting";

// GET - Get all shipments for a user by user ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify Bearer token
    const tokenVerification = await verifyApiToken(req);
    if (!tokenVerification.valid) {
      return NextResponse.json(
        {
          error: tokenVerification.error || "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        clientCode: true,
        companyName: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Get all shipments for this user (excluding CREATED status)
    const shipments = await prisma.shipment.findMany({
      where: {
        userId: id,
        NOT: {
          status: "CREATED", // Exclude shipments with 'CREATED' status from user view
        },
      },
      include: {
        items: {
          orderBy: { placeNumber: "asc" },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            amount: true,
            status: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    } as any);

    // Parse additionalFilesUrls for each shipment
    const shipmentsWithParsedFiles = shipments.map((shipment: any) => {
      let additionalFilesUrls: string[] = [];
      if (shipment.additionalFilesUrls) {
        try {
          additionalFilesUrls = JSON.parse(shipment.additionalFilesUrls);
        } catch (e) {
          console.error("Error parsing additionalFilesUrls:", e);
        }
      }

      // Calculate totals from items
      const pieces = (shipment.items || []).length;
      const totalWeight = (shipment.items || []).reduce((sum: number, item: any) => {
        const weight = item.weightKg ? Number(item.weightKg) : 0;
        return sum + (isNaN(weight) ? 0 : weight);
      }, 0);
      const totalVolume = (shipment.items || []).reduce((sum: number, item: any) => {
        const volume = item.volumeM3 ? Number(item.volumeM3) : 0;
        return sum + (isNaN(volume) ? 0 : volume);
      }, 0);

      // Calculate density: total weight / total volume
      const density = totalWeight > 0 && totalVolume > 0 ? (totalWeight / totalVolume).toFixed(2) : null;

      // Ensure logical consistency: if packing is false, packingCost must be null
      const packing = shipment.packing === true;
      const packingCost = formatPackingCost(packing, shipment.packingCost);

      // Ensure logical consistency: if localDeliveryToDepot is false, localDeliveryCost must be null
      const localDeliveryToDepot = shipment.localDeliveryToDepot === true;
      const localDeliveryCost = formatLocalDeliveryCost(localDeliveryToDepot, shipment.localDeliveryCost);

      return {
        id: shipment.id,
        internalTrack: shipment.internalTrack,
        cargoLabel: shipment.cargoLabel,
        status: shipment.status,
        description: shipment.description,
        location: shipment.location,
        pieces,
        weightKg: formatDecimal(totalWeight > 0 ? totalWeight : null),
        volumeM3: formatDecimal(totalVolume > 0 ? totalVolume : null),
        density: density,
        routeFrom: shipment.routeFrom,
        routeTo: shipment.routeTo,
        deliveryType: shipment.deliveryType,
        deliveryFormat: shipment.deliveryFormat,
        deliveryReference: shipment.deliveryReference,
        packing: packing,
        packingCost: packingCost,
        localDeliveryToDepot: localDeliveryToDepot,
        localDeliveryCost: localDeliveryCost,
        // batchId is excluded from response for user (security)
        cargoType: shipment.cargoType,
        cargoTypeCustom: shipment.cargoTypeCustom,
        totalCost: formatDecimal(shipment.totalCost),
        receivedAtWarehouse: shipment.receivedAtWarehouse,
        sentAt: shipment.sentAt,
        deliveredAt: shipment.deliveredAt,
        eta: shipment.eta,
        mainPhotoUrl: shipment.mainPhotoUrl,
        additionalFilesUrls,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
        items: (shipment.items || []).map((item: any) => formatShipmentItem(item)),
        statusHistory: (shipment.statusHistory || []).map((status: any) => ({
          id: status.id,
          status: status.status,
          location: status.location,
          description: status.description,
          createdAt: status.createdAt,
        })),
        invoices: (shipment.invoices || []).map((invoice: any) => ({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.amount.toString(),
          status: invoice.status,
          dueDate: invoice.dueDate,
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
        })),
      };
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          clientCode: user.clientCode,
          companyName: user.companyName,
        },
        shipments: shipmentsWithParsedFiles,
        total: shipmentsWithParsedFiles.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching user shipments:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
