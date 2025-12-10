import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiToken } from "@/lib/api-auth";
import {
  formatDecimal,
  formatPackingCost,
  formatLocalDeliveryCost,
  formatShipmentItem,
} from "@/lib/utils/api-formatting";

// GET - Get full shipment information by internalTrack
// Path parameter `id` is actually the internalTrack (e.g., "00100-2491Е-0001")
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
    // Decode URL-encoded internalTrack (handles special characters like Е, дефіси, etc.)
    // Format: ID_партії-Код_клієнтаТип-Номер (e.g., "00100-2491Е-0001")
    const internalTrack = decodeURIComponent(id);

    if (!internalTrack || internalTrack.trim() === "") {
      return NextResponse.json(
        { error: "Трек номер замовлення обов'язковий" },
        { status: 400 }
      );
    }

    // Find shipment by internalTrack with all related data
    const shipment = await prisma.shipment.findUnique({
      where: { internalTrack },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            clientCode: true,
            companyName: true,
          },
        },
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
    });

    if (!shipment) {
      return NextResponse.json(
        { error: `Замовлення з трек номером "${internalTrack}" не знайдено` },
        { status: 404 }
      );
    }

    // Parse additional files if exists
    let additionalFiles: string[] = [];
    if (shipment.additionalFilesUrls) {
      try {
        additionalFiles = JSON.parse(shipment.additionalFilesUrls);
      } catch {
        // ignore
      }
    }

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

    // Format response with all data
    const response = {
      id: shipment.id,
      internalTrack: shipment.internalTrack,
      cargoLabel: shipment.cargoLabel,
      status: shipment.status,
      description: shipment.description,
      location: shipment.location,
      pieces,
      weightKg: formatDecimal(totalWeight > 0 ? totalWeight : null),
      volumeM3: formatDecimal(totalVolume > 0 ? totalVolume : null),
      routeFrom: shipment.routeFrom,
      routeTo: shipment.routeTo,
      deliveryType: shipment.deliveryType,
      deliveryFormat: shipment.deliveryFormat,
      deliveryReference: shipment.deliveryReference,
      packing: shipment.packing,
      packingCost: packingCost,
      localDeliveryToDepot: shipment.localDeliveryToDepot,
      localDeliveryCost: localDeliveryCost,
      batchId: shipment.batchId,
      cargoType: shipment.cargoType,
      cargoTypeCustom: shipment.cargoTypeCustom,
      totalCost: formatDecimal(shipment.totalCost),
      receivedAtWarehouse: shipment.receivedAtWarehouse,
      sentAt: shipment.sentAt,
      deliveredAt: shipment.deliveredAt,
      eta: shipment.eta,
      mainPhotoUrl: shipment.mainPhotoUrl,
      additionalFilesUrls: additionalFiles,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
      client: {
        id: shipment.user.id,
        name: shipment.user.name,
        email: shipment.user.email,
        phone: shipment.user.phone,
        clientCode: shipment.user.clientCode,
        companyName: shipment.user.companyName,
      },
      items: shipment.items.map((item) => formatShipmentItem(item)),
      statusHistory: shipment.statusHistory.map((history) => ({
        id: history.id,
        status: history.status,
        location: history.location,
        description: history.description,
        createdAt: history.createdAt,
      })),
      invoices: shipment.invoices.map((invoice) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount.toString(),
        status: invoice.status,
        dueDate: invoice.dueDate,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching shipment:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера", details: error.message },
      { status: 500 }
    );
  }
}

