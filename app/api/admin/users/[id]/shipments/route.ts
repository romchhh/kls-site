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
      internalTrack,
      cargoLabel,
      status,
      location,
      pieces,
      routeFrom,
      routeTo,
      deliveryType,
      localTrackingOrigin,
      localTrackingDestination,
      description,
      insuranceTotal,
      insurancePercentTotal,
      insurancePerPlacePercent,
      weightKg,
      volumeM3,
      density,
      tariffType,
      tariffValue,
      deliveryCost,
      deliveryCostPerPlace,
      totalCost,
      receivedAtWarehouse,
      sentAt,
      deliveredAt,
      eta,
      deliveryFormat,
      deliveryReference,
      packing,
      localDeliveryToDepot,
      additionalFiles,
    } = body;

    // Validate required fields
    if (!internalTrack || !status) {
      return NextResponse.json(
        { error: "Missing required fields: internalTrack and status are required" },
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

    let computedEta: Date | null = null;
    if (!eta && status === "IN_TRANSIT") {
      const base =
        sentAt && typeof sentAt === "string" ? new Date(sentAt) : now;
      const baseDays =
        deliveryType === "SEA"
          ? 40
          : deliveryType === "RAIL"
          ? 18
          : deliveryType === "MULTIMODAL"
          ? 25
          : 22;
      computedEta = new Date(base);
      computedEta.setDate(computedEta.getDate() + baseDays);
    }

    const percentTotal =
      insurancePercentTotal === "" ||
      insurancePercentTotal === null ||
      insurancePercentTotal === undefined
        ? null
        : Number(insurancePercentTotal);

    const percentPerPlace =
      insurancePerPlacePercent === "" ||
      insurancePerPlacePercent === null ||
      insurancePerPlacePercent === undefined
        ? null
        : Number(insurancePerPlacePercent);

    // Helper function to convert to Decimal
    const toDecimal = (value: any): Prisma.Decimal | null => {
      if (value === null || value === undefined || value === "") {
        return null;
      }
      const num = typeof value === "string" ? parseFloat(value) : Number(value);
      return isNaN(num) ? null : new Prisma.Decimal(num);
    };

    const shipment = await prisma.shipment.create({
      data: {
        userId,
        clientCode: user.clientCode,
        internalTrack,
        cargoLabel: cargoLabel || null,
        status,
        location: location || null,
        pieces: pieces ?? 1,
        routeFrom: routeFrom,
        routeTo: routeTo,
        deliveryType: deliveryType,
        localTrackingOrigin: localTrackingOrigin || null,
        localTrackingDestination: localTrackingDestination || null,
        description: description || null,
        mainPhotoUrl: body.mainPhotoUrl || (additionalFiles && Array.isArray(additionalFiles) && additionalFiles.length > 0 ? additionalFiles[0] : null),
        additionalFilesUrls: additionalFiles && Array.isArray(additionalFiles) ? JSON.stringify(additionalFiles) : null,
        insuranceTotal: toDecimal(insuranceTotal),
        insurancePercentTotal: percentTotal,
        insurancePerPlacePercent: percentPerPlace,
        weightKg: toDecimal(weightKg),
        volumeM3: toDecimal(volumeM3),
        density: toDecimal(density),
        tariffType: tariffType || null,
        tariffValue: toDecimal(tariffValue),
        deliveryCost: toDecimal(deliveryCost),
        deliveryCostPerPlace: toDecimal(deliveryCostPerPlace),
        totalCost: toDecimal(totalCost),
        receivedAtWarehouse: receivedAtWarehouse
          ? new Date(receivedAtWarehouse)
          : null,
        sentAt: sentAt ? new Date(sentAt) : null,
        deliveredAt: deliveredAt ? new Date(deliveredAt) : null,
        eta: eta ? new Date(eta) : computedEta,
        deliveryFormat: deliveryFormat || null,
        deliveryReference: deliveryReference || null,
        packing: typeof packing === "boolean" ? packing : null,
        localDeliveryToDepot:
          typeof localDeliveryToDepot === "boolean"
            ? localDeliveryToDepot
            : null,
      },
    });

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



