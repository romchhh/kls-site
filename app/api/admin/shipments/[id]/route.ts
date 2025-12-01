import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

    // Helper function to convert to Decimal
    const toDecimal = (value: any): Prisma.Decimal | null => {
      if (value === null || value === undefined || value === "") {
        return null;
      }
      const num = typeof value === "string" ? parseFloat(value) : Number(value);
      return isNaN(num) ? null : new Prisma.Decimal(num);
    };

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

    // Process items if provided
    let pieces = existing.pieces;
    let calculatedTotalCost = new Prisma.Decimal(0);
    let itemsUpdate: any = undefined;

    if (items !== undefined && Array.isArray(items)) {
      pieces = items.length || existing.pieces;
      
      // Delete existing items and create new ones
      await prisma.shipmentItem.deleteMany({
        where: { shipmentId: id },
      });

      const processedItems = items.map((item: any, index: number) => {
        const insuranceValue = toDecimal(item.insuranceValue);
        const insurancePercent = item.insurancePercent ? Number(item.insurancePercent) : null;
        const insuranceCost = insuranceValue && insurancePercent 
          ? new Prisma.Decimal(insuranceValue.toNumber() * insurancePercent / 100)
          : null;
        
        if (insuranceCost) {
          calculatedTotalCost = calculatedTotalCost.add(insuranceCost);
        }
        
        const itemDeliveryCost = toDecimal(item.deliveryCost);
        if (itemDeliveryCost) {
          calculatedTotalCost = calculatedTotalCost.add(itemDeliveryCost);
        }

        // Auto-generate trackNumber if not provided
        let trackNumber = item.trackNumber;
        if (!trackNumber || trackNumber.trim() === "") {
          // Format: 00010-2661A0001-1, 00010-2661A0001-2, etc.
          // Convert internalTrack from "00010-2661A-0001" to "00010-2661A0001-1"
          const trackBase = existing.internalTrack.replace(/-(\d+)$/, '$1'); // Remove last dash, keep number
          trackNumber = `${trackBase}-${index + 1}`;
        }

        return {
          trackNumber: trackNumber,
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

      itemsUpdate = {
        create: processedItems,
      };

      // Add packing and local delivery costs
      const packingCostDecimal = toDecimal(packingCost);
      const localDeliveryCostDecimal = toDecimal(localDeliveryCost);
      
      if (packingCostDecimal) {
        calculatedTotalCost = calculatedTotalCost.add(packingCostDecimal);
      }
      if (localDeliveryCostDecimal) {
        calculatedTotalCost = calculatedTotalCost.add(localDeliveryCostDecimal);
      }
    } else {
      // If items not provided, calculate from existing items
      const existingItems = await prisma.shipmentItem.findMany({
        where: { shipmentId: id },
      });
      
      existingItems.forEach((item) => {
        if (item.insuranceCost) {
          calculatedTotalCost = calculatedTotalCost.add(item.insuranceCost);
        }
        if (item.deliveryCost) {
          calculatedTotalCost = calculatedTotalCost.add(item.deliveryCost);
        }
      });

      const packingCostDecimal = toDecimal(packingCost);
      const localDeliveryCostDecimal = toDecimal(localDeliveryCost);
      
      if (packingCostDecimal !== undefined) {
        if (packingCostDecimal) {
          calculatedTotalCost = calculatedTotalCost.add(packingCostDecimal);
        }
      } else if (existing.packingCost) {
        calculatedTotalCost = calculatedTotalCost.add(existing.packingCost);
      }

      if (localDeliveryCostDecimal !== undefined) {
        if (localDeliveryCostDecimal) {
          calculatedTotalCost = calculatedTotalCost.add(localDeliveryCostDecimal);
        }
      } else if (existing.localDeliveryCost) {
        calculatedTotalCost = calculatedTotalCost.add(existing.localDeliveryCost);
      }
    }

    const shipment = await prisma.shipment.update({
      where: { id },
      data: {
        internalTrack: internalTrack ?? existing.internalTrack,
        cargoLabel: cargoLabel ?? existing.cargoLabel,
        status: nextStatus,
        location: location ?? existing.location,
        pieces,
        routeFrom: routeFrom ?? existing.routeFrom,
        routeTo: routeTo ?? existing.routeTo,
        deliveryType: nextDeliveryType,
        localTrackingOrigin: localTrackingOrigin ?? existing.localTrackingOrigin,
        localTrackingDestination:
          localTrackingDestination ?? existing.localTrackingDestination,
        description: description ?? existing.description,
        mainPhotoUrl: body.mainPhotoUrl !== undefined 
          ? (body.mainPhotoUrl || (additionalFiles && Array.isArray(additionalFiles) && additionalFiles.length > 0 ? additionalFiles[0] : null))
          : (additionalFiles && Array.isArray(additionalFiles) && additionalFiles.length > 0 && !existing.mainPhotoUrl ? additionalFiles[0] : existing.mainPhotoUrl),
        additionalFilesUrls: additionalFiles !== undefined ? (additionalFiles && Array.isArray(additionalFiles) ? JSON.stringify(additionalFiles) : null) : existing.additionalFilesUrls,
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
        packingCost: packingCost !== undefined ? toDecimal(packingCost) : existing.packingCost,
        localDeliveryToDepot:
          typeof localDeliveryToDepot === "boolean"
            ? localDeliveryToDepot
            : existing.localDeliveryToDepot,
        localDeliveryCost: localDeliveryCost !== undefined ? toDecimal(localDeliveryCost) : existing.localDeliveryCost,
        batchId: batchId !== undefined ? (batchId || null) : existing.batchId,
        cargoType: cargoType !== undefined ? (cargoType || null) : existing.cargoType,
        cargoTypeCustom: cargoTypeCustom !== undefined ? (cargoTypeCustom || null) : existing.cargoTypeCustom,
        totalCost: calculatedTotalCost.toNumber() > 0 ? calculatedTotalCost : null,
        ...(itemsUpdate ? { items: itemsUpdate } : {}),
      },
    });

    // Create status history entry if status changed
    if (status && status !== existing.status) {
      try {
        await prisma.shipmentStatusHistory.create({
          data: {
            shipmentId: shipment.id,
            status: status as any,
            location: location ?? existing.location ?? null,
            description: `Статус змінено на ${status}`,
          },
        });
      } catch (historyError) {
        console.error("Failed to create status history (non-critical):", historyError);
      }
    }

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
  } catch (error: any) {
    console.error("Error updating shipment", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
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
  } catch (error: any) {
    console.error("Error deleting shipment", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}



