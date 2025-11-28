import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
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

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.shipment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

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
    } = body;

    let computedEta: Date | null = null;
    const nextStatus = status ?? existing.status;
    const nextDeliveryType = deliveryType ?? existing.deliveryType;
    const nextSentAt =
      sentAt !== undefined
        ? sentAt
          ? new Date(sentAt)
          : null
        : existing.sentAt;

    if (!eta && nextStatus === "IN_TRANSIT" && nextSentAt) {
      const baseDays =
        nextDeliveryType === "SEA"
          ? 40
          : nextDeliveryType === "RAIL"
          ? 18
          : nextDeliveryType === "MULTIMODAL"
          ? 25
          : 22;
      computedEta = new Date(nextSentAt);
      computedEta.setDate(computedEta.getDate() + baseDays);
    }

    const shipment = await prisma.shipment.update({
      where: { id },
      data: {
        internalTrack: internalTrack ?? existing.internalTrack,
        cargoLabel: cargoLabel ?? existing.cargoLabel,
        status: nextStatus,
        location: location ?? existing.location,
        pieces: pieces ?? existing.pieces,
        routeFrom: routeFrom ?? existing.routeFrom,
        routeTo: routeTo ?? existing.routeTo,
        deliveryType: nextDeliveryType,
        localTrackingOrigin: localTrackingOrigin ?? existing.localTrackingOrigin,
        localTrackingDestination:
          localTrackingDestination ?? existing.localTrackingDestination,
        description: description ?? existing.description,
        insuranceTotal:
          insuranceTotal !== undefined
            ? insuranceTotal
              ? String(insuranceTotal)
              : null
            : existing.insuranceTotal,
        insurancePercentTotal:
          insurancePercentTotal !== undefined
            ? insurancePercentTotal
            : existing.insurancePercentTotal,
        insurancePerPlacePercent:
          insurancePerPlacePercent !== undefined
            ? insurancePerPlacePercent
            : existing.insurancePerPlacePercent,
        weightKg:
          weightKg !== undefined
            ? weightKg
              ? String(weightKg)
              : null
            : existing.weightKg,
        volumeM3:
          volumeM3 !== undefined
            ? volumeM3
              ? String(volumeM3)
              : null
            : existing.volumeM3,
        density:
          density !== undefined
            ? density
              ? String(density)
              : null
            : existing.density,
        tariffType: tariffType ?? existing.tariffType,
        tariffValue:
          tariffValue !== undefined
            ? tariffValue
              ? String(tariffValue)
              : null
            : existing.tariffValue,
        deliveryCost:
          deliveryCost !== undefined
            ? deliveryCost
              ? String(deliveryCost)
              : null
            : existing.deliveryCost,
        deliveryCostPerPlace:
          deliveryCostPerPlace !== undefined
            ? deliveryCostPerPlace
              ? String(deliveryCostPerPlace)
              : null
            : existing.deliveryCostPerPlace,
        totalCost:
          totalCost !== undefined
            ? totalCost
              ? String(totalCost)
              : null
            : existing.totalCost,
        receivedAtWarehouse:
          receivedAtWarehouse !== undefined
            ? receivedAtWarehouse
              ? new Date(receivedAtWarehouse)
              : null
            : existing.receivedAtWarehouse,
        sentAt: nextSentAt,
        deliveredAt:
          deliveredAt !== undefined
            ? deliveredAt
              ? new Date(deliveredAt)
              : null
            : existing.deliveredAt,
        eta:
          eta !== undefined
            ? eta
              ? new Date(eta)
              : null
            : computedEta ?? existing.eta,
        deliveryFormat: deliveryFormat ?? existing.deliveryFormat,
        deliveryReference: deliveryReference ?? existing.deliveryReference,
        packing:
          typeof packing === "boolean" ? packing : existing.packing,
        localDeliveryToDepot:
          typeof localDeliveryToDepot === "boolean"
            ? localDeliveryToDepot
            : existing.localDeliveryToDepot,
      },
    });

    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "UPDATE_SHIPMENT",
        targetType: "SHIPMENT",
        targetId: shipment.id,
        description: `Updated shipment ${shipment.internalTrack}`,
      },
    });

    return NextResponse.json({ shipment }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    const { id } = await params;

    const existing = await prisma.shipment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    await prisma.shipment.delete({ where: { id } });

    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "DELETE_SHIPMENT",
        targetType: "SHIPMENT",
        targetId: id,
        description: `Deleted shipment ${existing.internalTrack}`,
      },
    });

    return NextResponse.json(
      { message: "Shipment deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}



