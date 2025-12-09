import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSentAtData } from "@/lib/utils/shipmentAutomation";

/**
 * POST - Позначити всі вантажі в партії як "відправлено"
 * Автоматично встановлює для всіх вантажів:
 * - Статус: IN_TRANSIT
 * - Місцезнаходження: "В дорозі"
 * - ETA: розраховується на основі типу доставки партії
 * - Таймлайн: додає запис в історію статусів для кожного вантажу
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { sentAt } = body;

    if (!sentAt) {
      return NextResponse.json(
        { error: "Дата відправлення обов'язкова" },
        { status: 400 }
      );
    }

    const batch = await (prisma as any).batch.findUnique({
      where: { id },
      include: {
        shipments: true,
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Партія не знайдена" },
        { status: 404 }
      );
    }

    const sentDate = new Date(sentAt);
    const updatedShipments = [];

    // Оновлюємо всі вантажі в партії
    for (const shipment of batch.shipments) {
      // Використовуємо deliveryType з вантажу, або з партії як fallback
      const deliveryType = (shipment.deliveryType || batch.deliveryType) as any;
      const automationData = getSentAtData(sentDate, deliveryType, shipment.routeTo);

      // Оновлюємо вантаж
      const updated = await prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          sentAt: sentDate,
          status: automationData.status as any,
          location: automationData.location,
          eta: automationData.eta,
        },
      });

      // Додаємо запис в історію статусів
      await prisma.shipmentStatusHistory.create({
        data: {
          shipmentId: shipment.id,
          status: automationData.status as any,
          location: automationData.location,
          description: automationData.description,
        },
      });

      updatedShipments.push(updated);
    }

    // Логуємо дію адміна
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "UPDATE_BATCH",
        targetType: "BATCH",
        targetId: id,
        description: `Всі вантажі партії ${batch.batchId} позначено як відправлено`,
      },
    });

    return NextResponse.json(
      {
        message: `Оновлено ${updatedShipments.length} вантажів`,
        shipments: updatedShipments,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error marking batch shipments as sent:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

