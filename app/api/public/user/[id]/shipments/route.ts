import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiToken } from "@/lib/api-auth";

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

    // Get all shipments for this user
    const shipments = await prisma.shipment.findMany({
      where: { userId: id },
      include: {
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

      return {
        id: shipment.id,
        internalTrack: shipment.internalTrack,
        cargoLabel: shipment.cargoLabel,
        status: shipment.status,
        description: shipment.description,
        location: shipment.location,
        pieces: shipment.pieces,
        weightKg: shipment.weightKg?.toString() || null,
        volumeM3: shipment.volumeM3?.toString() || null,
        density: shipment.density?.toString() || null,
        routeFrom: shipment.routeFrom,
        routeTo: shipment.routeTo,
        deliveryType: shipment.deliveryType,
        deliveryFormat: shipment.deliveryFormat,
        deliveryReference: shipment.deliveryReference,
        packing: shipment.packing,
        localDeliveryToDepot: shipment.localDeliveryToDepot,
        localTrackingOrigin: shipment.localTrackingOrigin,
        localTrackingDestination: shipment.localTrackingDestination,
        deliveryCost: shipment.deliveryCost?.toString() || null,
        deliveryCostPerPlace: shipment.deliveryCostPerPlace?.toString() || null,
        totalCost: shipment.totalCost?.toString() || null,
        insuranceTotal: shipment.insuranceTotal?.toString() || null,
        insurancePercentTotal: shipment.insurancePercentTotal,
        insurancePerPlacePercent: shipment.insurancePerPlacePercent,
        tariffType: shipment.tariffType,
        tariffValue: shipment.tariffValue?.toString() || null,
        receivedAtWarehouse: shipment.receivedAtWarehouse,
        sentAt: shipment.sentAt,
        deliveredAt: shipment.deliveredAt,
        eta: shipment.eta,
        mainPhotoUrl: shipment.mainPhotoUrl,
        additionalFilesUrls,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
        items: (shipment.items || []).map((item: any) => ({
          id: item.id,
          itemCode: item.itemCode,
          description: item.description,
          quantity: item.quantity,
          weightKg: item.weightKg?.toString() || null,
          volumeM3: item.volumeM3?.toString() || null,
          density: item.density?.toString() || null,
          localTracking: item.localTracking,
          photoUrl: item.photoUrl,
          clientTariff: item.clientTariff?.toString() || null,
          insuranceValue: item.insuranceValue?.toString() || null,
          deliveryCost: item.deliveryCost?.toString() || null,
          totalCost: item.totalCost?.toString() || null,
        })),
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
