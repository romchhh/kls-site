import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;

    const shipments = await prisma.shipment.findMany({
      where: { userId },
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

    return NextResponse.json({ shipments }, { status: 200 });
  } catch (error) {
    console.error("Error creating shipment for user", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;
    const body = await req.json();

    const {
      cargoLabel,
      status,
      location,
      routeFrom,
      routeTo,
      deliveryType,
      localTrackingOrigin,
      localTrackingDestination,
      description,
      receivedAtWarehouse,
      sentAt,
      deliveredAt,
      eta,
      deliveryFormat,
      deliveryReference,
      packing,
      packingCost,
      localDeliveryToDepot,
      localDeliveryCost,
      batchId,
      cargoType,
      cargoTypeCustom,
      additionalFiles,
      items, // Array of shipment items
    } = body;

    // Validate required fields
    if (!status) {
      return NextResponse.json(
        { error: "Missing required fields: status is required" },
        { status: 400 },
      );
    }

    if (!batchId) {
      return NextResponse.json(
        { error: "Missing required field: batchId is required" },
        { status: 400 },
      );
    }

    if (!routeFrom || !routeTo) {
      return NextResponse.json(
        { error: "Missing required fields: routeFrom and routeTo are required" },
        { status: 400 },
      );
    }

    if (!deliveryType) {
      return NextResponse.json(
        { error: "Missing required field: deliveryType is required" },
        { status: 400 },
      );
    }

    // Validate status enum
    const validStatuses = [
      "CREATED",
      "RECEIVED_CN",
      "CONSOLIDATION",
      "IN_TRANSIT",
      "ARRIVED_UA",
      "ON_UA_WAREHOUSE",
      "DELIVERED",
      "ARCHIVED",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Validate deliveryType enum
    const validDeliveryTypes = ["AIR", "SEA", "RAIL", "MULTIMODAL"];
    if (!validDeliveryTypes.includes(deliveryType)) {
      return NextResponse.json(
        {
          error: `Invalid deliveryType. Must be one of: ${validDeliveryTypes.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Validate deliveryFormat enum if provided
    if (deliveryFormat) {
      const validDeliveryFormats = ["NOVA_POSHTA", "SELF_PICKUP", "CARGO"];
      if (!validDeliveryFormats.includes(deliveryFormat)) {
        return NextResponse.json(
          {
            error: `Invalid deliveryFormat. Must be one of: ${validDeliveryFormats.join(", ")}`,
          },
          { status: 400 },
        );
      }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "USER") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();

    // Calculate dates based on receivedAtWarehouse and deliveryType
    let computedSentAt: Date | null = null;
    let computedDeliveredAt: Date | null = null;
    let computedEta: Date | null = null;

    if (receivedAtWarehouse && typeof receivedAtWarehouse === "string") {
      const receivedDate = new Date(receivedAtWarehouse);
      
      // sentAt = receivedAtWarehouse + 3 days (automatic)
      computedSentAt = new Date(receivedDate);
      computedSentAt.setDate(computedSentAt.getDate() + 3);

      // deliveredAt and ETA depend on deliveryType
      const transitDays =
        deliveryType === "SEA"
          ? 40
          : deliveryType === "RAIL"
          ? 18
          : deliveryType === "MULTIMODAL"
          ? 25
          : 21; // AIR default

      // deliveredAt = sentAt + transitDays
      computedDeliveredAt = new Date(computedSentAt);
      computedDeliveredAt.setDate(computedDeliveredAt.getDate() + transitDays);

      // ETA = sentAt + transitDays (same as deliveredAt for now)
      computedEta = new Date(computedSentAt);
      computedEta.setDate(computedEta.getDate() + transitDays);
    }


    // Helper function to convert to Decimal
    const toDecimal = (value: any): Prisma.Decimal | null => {
      if (value === null || value === undefined || value === "") {
        return null;
      }
      const num = typeof value === "string" ? parseFloat(value) : Number(value);
      return isNaN(num) ? null : new Prisma.Decimal(num);
    };

    // Validate and process items
    const itemsArray = Array.isArray(items) ? items : [];
    const pieces = itemsArray.length || 1;

    // Calculate totals from items
    let totalInsuranceCost = new Prisma.Decimal(0);
    let totalDeliveryCost = new Prisma.Decimal(0);
    
    const processedItems = itemsArray.map((item: any, index: number) => {
      const insuranceValue = toDecimal(item.insuranceValue);
      const insurancePercent = item.insurancePercent ? Number(item.insurancePercent) : null;
      const insuranceCost = insuranceValue && insurancePercent 
        ? new Prisma.Decimal(insuranceValue.toNumber() * insurancePercent / 100)
        : null;
      
      if (insuranceCost) {
        totalInsuranceCost = totalInsuranceCost.add(insuranceCost);
      }
      
      const itemDeliveryCost = toDecimal(item.deliveryCost);
      if (itemDeliveryCost) {
        totalDeliveryCost = totalDeliveryCost.add(itemDeliveryCost);
      }

      return {
        trackNumber: item.trackNumber || null,
        placeNumber: index + 1,
        localTracking: item.localTracking || null,
        description: item.description || null,
        quantity: item.quantity ? Number(item.quantity) : null,
        insuranceValue: insuranceValue,
        insurancePercent: insurancePercent && insurancePercent >= 1 && insurancePercent <= 100 ? insurancePercent : null,
        insuranceCost: insuranceCost,
        lengthCm: toDecimal(item.lengthCm),
        widthCm: toDecimal(item.widthCm),
        heightCm: toDecimal(item.heightCm),
        weightKg: toDecimal(item.weightKg),
        volumeM3: toDecimal(item.volumeM3),
        density: toDecimal(item.density),
        tariffType: item.tariffType || null,
        tariffValue: toDecimal(item.tariffValue),
        deliveryCost: itemDeliveryCost,
        cargoType: item.cargoType || null,
        cargoTypeCustom: item.cargoTypeCustom || null,
        note: item.note || null,
        photoUrl: item.photoUrl || null,
      };
    });

    // Calculate total cost: insuranceCost + deliveryCost + packingCost + localDeliveryCost
    const packingCostDecimal = toDecimal(packingCost);
    const localDeliveryCostDecimal = toDecimal(localDeliveryCost);
    
    let calculatedTotalCost = new Prisma.Decimal(0);
    calculatedTotalCost = calculatedTotalCost.add(totalInsuranceCost);
    calculatedTotalCost = calculatedTotalCost.add(totalDeliveryCost);
    if (packingCostDecimal) {
      calculatedTotalCost = calculatedTotalCost.add(packingCostDecimal);
    }
    if (localDeliveryCostDecimal) {
      calculatedTotalCost = calculatedTotalCost.add(localDeliveryCostDecimal);
    }

    // Ensure batch exists, create if not
    let batch = await (prisma as any).batch.findUnique({
      where: { batchId },
    });

    if (!batch) {
      batch = await (prisma as any).batch.create({
        data: {
          batchId,
          description: `Партія ${batchId}`,
        },
      });
    }

    // Count existing shipments in this batch for this client to generate shipment number
    const existingShipmentsInBatch = await prisma.shipment.count({
      where: {
        batchId: batch.id,
        clientCode: user.clientCode,
      },
    });

    // Generate internal track: batchId-clientCode-cargoType-number
    // Format: 00010-2661A-0001
    const cargoTypeCode = cargoType ? cargoType.substring(0, 1).toUpperCase() : "X";
    const shipmentNumber = String(existingShipmentsInBatch + 1).padStart(4, "0");
    const internalTrack = `${batchId}-${user.clientCode}${cargoTypeCode}-${shipmentNumber}`;

    // Auto-generate trackNumber for items if not provided
    // Format: 00010-2661A0001-1, 00010-2661A0001-2, etc.
    // Convert internalTrack from "00010-2661A-0001" to "00010-2661A0001-1"
    const processedItemsWithTracks = processedItems.map((item: any, index: number) => {
      if (!item.trackNumber || item.trackNumber.trim() === "") {
        // Remove the last dash before number, then add place number
        // internalTrack: "00010-2661A-0001" -> "00010-2661A0001-1"
        const trackBase = internalTrack.replace(/-(\d+)$/, '$1'); // Remove last dash, keep number
        item.trackNumber = `${trackBase}-${index + 1}`;
      }
      return item;
    });

    // Determine initial status based on receivedAtWarehouse
    let initialStatus = status;
    if (receivedAtWarehouse && !status) {
      initialStatus = "RECEIVED_CN";
    } else if (!status) {
      initialStatus = "CREATED";
    }

    const shipment = await prisma.shipment.create({
      data: {
        userId,
        clientCode: user.clientCode,
        internalTrack,
        cargoLabel: cargoLabel || null,
        status: initialStatus,
        location: location || null,
        pieces,
        routeFrom: routeFrom,
        routeTo: routeTo,
        deliveryType: deliveryType,
        localTrackingOrigin: localTrackingOrigin || null,
        localTrackingDestination: localTrackingDestination || null,
        description: description || null,
        mainPhotoUrl: body.mainPhotoUrl || (additionalFiles && Array.isArray(additionalFiles) && additionalFiles.length > 0 ? additionalFiles[0] : null),
        additionalFilesUrls: additionalFiles && Array.isArray(additionalFiles) ? JSON.stringify(additionalFiles) : null,
        receivedAtWarehouse: receivedAtWarehouse
          ? new Date(receivedAtWarehouse)
          : null,
        sentAt: sentAt ? new Date(sentAt) : computedSentAt,
        deliveredAt: deliveredAt ? new Date(deliveredAt) : computedDeliveredAt,
        eta: eta ? new Date(eta) : computedEta,
        deliveryFormat: deliveryFormat || null,
        deliveryReference: deliveryReference || null,
        packing: typeof packing === "boolean" ? packing : null,
        packingCost: packingCostDecimal,
        localDeliveryToDepot:
          typeof localDeliveryToDepot === "boolean"
            ? localDeliveryToDepot
            : null,
        localDeliveryCost: localDeliveryCostDecimal,
        batchId: batch.id,
        cargoType: cargoType || null,
        cargoTypeCustom: cargoTypeCustom || null,
        totalCost: calculatedTotalCost.toNumber() > 0 ? calculatedTotalCost : null,
        items: {
          create: processedItemsWithTracks,
        },
      },
    });

    // Create initial status history entry
    try {
      await prisma.shipmentStatusHistory.create({
        data: {
          shipmentId: shipment.id,
          status: initialStatus as any,
          location: location || null,
          description: "Вантаж створено",
        },
      });
    } catch (historyError) {
      console.error("Failed to create status history (non-critical):", historyError);
    }

    // Log admin action (non-blocking, don't fail if this fails)
    try {
      await prisma.adminAction.create({
        data: {
          adminId: session.user.id,
          actionType: "CREATE_SHIPMENT",
          targetType: "SHIPMENT",
          targetId: shipment.id,
          description: `Created shipment ${shipment.internalTrack} for user ${user.clientCode}`,
        },
      });
    } catch (actionError) {
      console.error("Failed to log admin action (non-critical):", actionError);
      // Continue anyway - the shipment was created successfully
    }

    return NextResponse.json({ shipment }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating shipment for user", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Вантаж з таким трек-номером вже існує" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Unknown error",
        code: error.code || "UNKNOWN",
      },
      { status: 500 },
    );
  }
}



