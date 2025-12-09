import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSentAtData } from "@/lib/utils/shipmentAutomation";

/**
 * POST - Позначити вантаж як "відправлено"
 * Автоматично встановлює:
 * - Статус: IN_TRANSIT
 * - Місцезнаходження: "В дорозі"
 * - ETA: розраховується на основі типу доставки
 * - Таймлайн: додає запис в історію статусів
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

    const shipment = await prisma.shipment.findUnique({
      where: { id },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "Вантаж не знайдено" },
        { status: 404 }
      );
    }

    const sentDate = new Date(sentAt);
    const automationData = getSentAtData(
      sentDate,
      shipment.deliveryType as any,
      shipment.routeTo
    );

    // Оновлюємо вантаж
    const updated = await prisma.shipment.update({
      where: { id },
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
        shipmentId: id,
        status: automationData.status as any,
        location: automationData.location,
        description: automationData.description,
      },
    });

    // Логуємо дію адміна
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "UPDATE_SHIPMENT",
        targetType: "SHIPMENT",
        targetId: id,
        description: `Вантаж ${shipment.internalTrack} позначено як відправлено`,
      },
    });

    return NextResponse.json({ shipment: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Error marking shipment as sent:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

