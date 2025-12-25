import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Автоматично створює інвойс для вантажу, коли статус змінюється на ON_UA_WAREHOUSE
 * Перевіряє, чи інвойс вже існує, щоб не створювати дублікати
 */
export async function createInvoiceForShipment(shipmentId: string): Promise<string | null> {
  try {
    // Перевіряємо, чи інвойс вже існує для цього вантажу
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        shipmentId: shipmentId,
      },
    });

    if (existingInvoice) {
      // Інвойс вже існує, повертаємо його ID
      return existingInvoice.id;
    }

    // Отримуємо вантаж з усіма даними
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        user: {
          select: {
            id: true,
            clientCode: true,
          },
        },
        items: true,
      },
    });

    if (!shipment) {
      console.error(`Shipment ${shipmentId} not found`);
      return null;
    }

    // Розраховуємо загальну суму
    const deliveryCost = shipment.items.reduce((sum, item) => {
      return sum + (item.deliveryCost ? Number(item.deliveryCost) : 0);
    }, 0);

    const packingCost = shipment.packingCost ? Number(shipment.packingCost) : 0;
    const localDeliveryCost = shipment.localDeliveryCost ? Number(shipment.localDeliveryCost) : 0;
    
    const insuranceCost = shipment.items.reduce((sum, item) => {
      return sum + (item.insuranceCost ? Number(item.insuranceCost) : 0);
    }, 0);

    const totalAmount = deliveryCost + packingCost + localDeliveryCost + insuranceCost;

    // Генеруємо номер інвойсу на основі трек номера (без ID партії)
    // Формат: 00001-2053В0001 → INV-2053В0001
    let invoiceNumber = "";
    if (shipment.internalTrack && shipment.internalTrack.includes("-")) {
      const parts = shipment.internalTrack.split("-");
      if (parts.length >= 2) {
        // Беремо частину після першого дефісу (без ID партії)
        const afterDash = parts.slice(1).join("-");
        invoiceNumber = `INV-${afterDash}`;
      } else {
        invoiceNumber = `INV-${shipment.internalTrack}`;
      }
    } else {
      invoiceNumber = `INV-${shipment.internalTrack || "UNKNOWN"}`;
    }

    // Перевіряємо унікальність номера
    let finalInvoiceNumber = invoiceNumber;
    let counter = 1;
    while (true) {
      const existing = await prisma.invoice.findUnique({
        where: { invoiceNumber: finalInvoiceNumber },
      });

      if (!existing) {
        break;
      }

      finalInvoiceNumber = `${invoiceNumber}-${counter}`;
      counter++;

      if (counter > 1000) {
        console.error(`Unable to generate unique invoice number for shipment ${shipmentId}`);
        return null;
      }
    }

    // Створюємо інвойс
    const invoice = await prisma.invoice.create({
      data: {
        userId: shipment.userId,
        shipmentId: shipmentId,
        invoiceNumber: finalInvoiceNumber,
        amount: new Prisma.Decimal(totalAmount),
        status: "UNPAID",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 днів з дати створення
      },
    });

    console.log(`Invoice ${finalInvoiceNumber} created for shipment ${shipmentId}`);
    return invoice.id;
  } catch (error: any) {
    console.error(`Error creating invoice for shipment ${shipmentId}:`, error);
    return null;
  }
}

