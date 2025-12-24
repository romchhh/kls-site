import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getLocationForStatus } from "@/lib/utils/shipmentAutomation";
import { getDeliveryTypeCode } from "@/components/admin/utils/shipmentUtils";
import { createInvoiceForShipment } from "@/lib/utils/invoiceGeneration";

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

    const existing = await prisma.shipment.findUnique({ 
      where: { id },
      include: {
        user: {
          select: {
            clientCode: true,
          },
        },
      },
    });
    if (!existing) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    const {
      internalTrack,
      cargoLabel,
      status,
      location: providedLocation,
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
      createInvoice, // Флаг для створення інвойсу
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
    
    // Автоматично встановлюємо місцезнаходження на основі статусу, якщо не вказано явно
    let finalLocation = providedLocation;
    if (status && status !== existing.status) {
      // Якщо статус змінюється, автоматично встановлюємо location
      finalLocation = providedLocation || getLocationForStatus(status as any, routeFrom ?? existing.routeFrom, routeTo ?? existing.routeTo);
    } else if (!finalLocation && status) {
      // Якщо статус не змінюється, але location не вказано, встановлюємо на основі поточного статусу
      finalLocation = getLocationForStatus(status as any, routeFrom ?? existing.routeFrom, routeTo ?? existing.routeTo);
    }
    
    // Якщо змінюється тип доставки, оновлюємо трек номер вантажу та items
    // НЕ дозволяємо змінювати internalTrack напряму, якщо змінюється deliveryType
    let finalInternalTrack = existing.internalTrack;
    let shouldUpdateItemTracks = false;
    
    // Якщо змінюється тип доставки, автоматично генеруємо новий трек номер
    if (deliveryType && deliveryType !== existing.deliveryType) {
      // Перевіряємо, чи є необхідні дані для генерації трек номера
      const currentBatchId = batchId !== undefined ? (batchId || existing.batchId) : existing.batchId;
      const clientCode = existing.user?.clientCode;
      
      if (!currentBatchId || !clientCode) {
        console.error("Cannot update track number: missing batchId or clientCode", {
          batchId: currentBatchId,
          clientCode: clientCode,
          existingBatchId: existing.batchId,
        });
      } else if (!existing.internalTrack || existing.internalTrack.trim() === "") {
        console.error("Cannot update track number: existing internalTrack is empty");
      } else {
        // Парсимо існуючий трек номер
        // Формат може бути: 00100-2491S0001 або 00100-2491Е-0001
        const trackParts = existing.internalTrack.split("-");
        
        if (trackParts.length >= 2) {
          // Витягуємо batchId з першої частини (наприклад, "00100")
          const extractedBatchId = trackParts[0];
          
          // Друга частина містить clientCode + буква типу доставки + номер замовлення
          // Формат: "2491S0001" або "2491Е" (якщо номер замовлення в окремій частині)
          const secondPart = trackParts[1];
          
          // Шукаємо букву типу доставки (A, S, R, M) в другій частині
          const typeMatch = secondPart.match(/(\d+)([ASRM])(\d{4})$/);
          
          if (typeMatch) {
            // Формат: 2491S0001
            const extractedClientCode = typeMatch[1];
            const oldDeliveryTypeCode = typeMatch[2];
            const orderNumber = typeMatch[3];
            
            // Генеруємо новий трек номер з новим типом доставки
            const newDeliveryTypeCode = getDeliveryTypeCode(deliveryType);
            finalInternalTrack = `${extractedBatchId}-${extractedClientCode}${newDeliveryTypeCode}${orderNumber}`;
            shouldUpdateItemTracks = true;
            console.log("Updated track number due to deliveryType change:", {
              old: existing.internalTrack,
              new: finalInternalTrack,
              deliveryType: deliveryType,
              orderNumber: orderNumber,
              extractedBatchId: extractedBatchId,
            });
          } else if (trackParts.length >= 3) {
            // Формат: 00100-2491Е-0001 (з дефісом перед номером замовлення)
            const orderNumber = trackParts[2];
            
            // Шукаємо букву типу доставки в другій частині
            const typeMatch2 = secondPart.match(/(\d+)([ASRM])$/);
            if (typeMatch2) {
              const extractedClientCode = typeMatch2[1];
              const newDeliveryTypeCode = getDeliveryTypeCode(deliveryType);
              finalInternalTrack = `${extractedBatchId}-${extractedClientCode}${newDeliveryTypeCode}-${orderNumber}`;
              shouldUpdateItemTracks = true;
              console.log("Updated track number (with dash format):", {
                old: existing.internalTrack,
                new: finalInternalTrack,
                deliveryType: deliveryType,
                orderNumber: orderNumber,
              });
            } else {
              // Спробуємо витягти номер замовлення з останньої частини
              const lastPart = trackParts[trackParts.length - 1];
              if (lastPart && lastPart.match(/^\d{4}$/)) {
                const extractedClientCode = secondPart.replace(/[ASRM]$/, "");
                const newDeliveryTypeCode = getDeliveryTypeCode(deliveryType);
                finalInternalTrack = `${extractedBatchId}-${extractedClientCode}${newDeliveryTypeCode}-${lastPart}`;
                shouldUpdateItemTracks = true;
                console.log("Updated track number (extracted from last part):", {
                  old: existing.internalTrack,
                  new: finalInternalTrack,
                  deliveryType: deliveryType,
                  orderNumber: lastPart,
                });
              } else {
                console.error("Cannot parse track number format:", existing.internalTrack);
              }
            }
          } else {
            // Fallback: спробуємо витягти останні 4 цифри
            const fallbackMatch = existing.internalTrack.match(/(\d{4})$/);
            const fallbackOrderNumber = fallbackMatch ? fallbackMatch[1] : null;
            if (fallbackOrderNumber && extractedBatchId && clientCode) {
              const newDeliveryTypeCode = getDeliveryTypeCode(deliveryType);
              finalInternalTrack = `${extractedBatchId}-${clientCode}${newDeliveryTypeCode}${fallbackOrderNumber}`;
              shouldUpdateItemTracks = true;
              console.log("Updated track number (fallback):", {
                old: existing.internalTrack,
                new: finalInternalTrack,
                deliveryType: deliveryType,
                orderNumber: fallbackOrderNumber,
              });
            } else {
              console.error("Cannot extract order number from track:", existing.internalTrack);
            }
          }
        } else {
          console.error("Invalid track number format:", existing.internalTrack);
        }
      }
    } else if (internalTrack !== undefined && internalTrack !== null && internalTrack !== existing.internalTrack && !deliveryType) {
      // Якщо deliveryType не змінюється і не передається, але internalTrack передано явно, використовуємо його
      // Але тільки якщо це не виглядає як ID (перевірка на формат трек номера)
      if (internalTrack.includes("-") && internalTrack.match(/^\d+-/)) {
        finalInternalTrack = internalTrack;
      } else {
        console.warn("Ignoring invalid internalTrack format:", internalTrack);
      }
    }
    
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

    // Якщо змінюється deliveryType, але items не передаються, потрібно оновити існуючі items
    if (shouldUpdateItemTracks && (items === undefined || !Array.isArray(items))) {
      console.log("Updating existing items track numbers because deliveryType changed", {
        shouldUpdateItemTracks,
        itemsProvided: items !== undefined && Array.isArray(items),
        finalInternalTrack,
      });
      
      // Отримуємо існуючі items
      const existingItems = await prisma.shipmentItem.findMany({
        where: { shipmentId: id },
        orderBy: { placeNumber: "asc" },
      });

      console.log(`Found ${existingItems.length} existing items to update`);

      // Оновлюємо трек номери для всіх існуючих items
      // Використовуємо finalInternalTrack як основу (наприклад, 00100-2491A0003)
      // Трек номер місця буде: 00100-2491A0003-1, 00100-2491A0003-2, тощо
      
      for (const item of existingItems) {
        const oldTrackNumber = item.trackNumber;
        const newTrackNumber = `${finalInternalTrack}-${item.placeNumber}`;
        console.log(`Updating item ${item.placeNumber}: ${oldTrackNumber} -> ${newTrackNumber}`);
        await prisma.shipmentItem.update({
          where: { id: item.id },
          data: { trackNumber: newTrackNumber },
        });
      }
      
      console.log("Finished updating item track numbers");
    }

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

        // Auto-generate trackNumber if not provided or if deliveryType changed
        // Якщо змінився deliveryType (shouldUpdateItemTracks = true), ЗАВЖДИ оновлюємо трек номер
        // на основі нового finalInternalTrack, навіть якщо trackNumber вже заповнений
        let trackNumber = item.trackNumber;
        if (shouldUpdateItemTracks) {
          // Завжди оновлюємо трек номер, якщо змінився deliveryType
          trackNumber = `${finalInternalTrack}-${index + 1}`;
        } else if (!trackNumber || trackNumber.trim() === "") {
          // Якщо deliveryType не змінився, але trackNumber порожній, генеруємо на основі поточного finalInternalTrack
          trackNumber = `${finalInternalTrack}-${index + 1}`;
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
        internalTrack: finalInternalTrack,
        cargoLabel: cargoLabel ?? existing.cargoLabel,
        status: nextStatus,
        location: finalLocation ?? existing.location,
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
            location: finalLocation ?? existing.location ?? null,
            description: `Статус змінено на ${status}`,
          },
        });
      } catch (historyError) {
        console.error("Failed to create status history (non-critical):", historyError);
      }

      // Створюємо інвойс, якщо статус змінюється на ON_UA_WAREHOUSE і адмін підтвердив створення
      if (status === "ON_UA_WAREHOUSE" && createInvoice === true) {
        try {
          const invoiceId = await createInvoiceForShipment(shipment.id);
          if (invoiceId) {
            console.log(`Invoice created for shipment ${shipment.id}: ${invoiceId}`);
          } else {
            console.warn(`Failed to create invoice for shipment ${shipment.id}`);
          }
        } catch (invoiceError) {
          console.error("Error creating invoice:", invoiceError);
          // Не блокуємо оновлення вантажу, якщо створення інвойсу не вдалося
        }
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



