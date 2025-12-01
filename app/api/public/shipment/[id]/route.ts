import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiToken } from "@/lib/api-auth";

// GET - Get full shipment information by internalTrack
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
    const internalTrack = id; // id parameter is actually internalTrack

    if (!internalTrack) {
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
        items: true,
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

    // Format response with all data
    const response = {
      id: shipment.id,
      internalTrack: shipment.internalTrack,
      cargoLabel: shipment.cargoLabel,
      status: shipment.status,
      description: shipment.description,
      location: shipment.location,
      pieces: shipment.pieces,
      weightKg: shipment.weightKg ? shipment.weightKg.toString() : null,
      volumeM3: shipment.volumeM3 ? shipment.volumeM3.toString() : null,
      density: shipment.density ? shipment.density.toString() : null,
      routeFrom: shipment.routeFrom,
      routeTo: shipment.routeTo,
      deliveryType: shipment.deliveryType,
      deliveryFormat: shipment.deliveryFormat,
      deliveryReference: shipment.deliveryReference,
      packing: shipment.packing,
      localDeliveryToDepot: shipment.localDeliveryToDepot,
      localTrackingOrigin: shipment.localTrackingOrigin,
      localTrackingDestination: shipment.localTrackingDestination,
      deliveryCost: shipment.deliveryCost ? shipment.deliveryCost.toString() : null,
      deliveryCostPerPlace: shipment.deliveryCostPerPlace
        ? shipment.deliveryCostPerPlace.toString()
        : null,
      totalCost: shipment.totalCost ? shipment.totalCost.toString() : null,
      insuranceTotal: shipment.insuranceTotal
        ? shipment.insuranceTotal.toString()
        : null,
      insurancePercentTotal: shipment.insurancePercentTotal,
      insurancePerPlacePercent: shipment.insurancePerPlacePercent,
      tariffType: shipment.tariffType,
      tariffValue: shipment.tariffValue ? shipment.tariffValue.toString() : null,
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
      items: shipment.items.map((item) => ({
        id: item.id,
        itemCode: item.itemCode,
        description: item.description,
        quantity: item.quantity,
        weightKg: item.weightKg ? item.weightKg.toString() : null,
        volumeM3: item.volumeM3 ? item.volumeM3.toString() : null,
        density: item.density ? item.density.toString() : null,
        localTracking: item.localTracking,
        photoUrl: item.photoUrl,
        clientTariff: item.clientTariff ? item.clientTariff.toString() : null,
        insuranceValue: item.insuranceValue ? item.insuranceValue.toString() : null,
        deliveryCost: item.deliveryCost ? item.deliveryCost.toString() : null,
        totalCost: item.totalCost ? item.totalCost.toString() : null,
      })),
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

