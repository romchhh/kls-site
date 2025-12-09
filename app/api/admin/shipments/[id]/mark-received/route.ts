import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getReceivedAtWarehouseData } from "@/lib/utils/shipmentAutomation";

/**
 * POST - Позначити вантаж як "прибув на склад"
 * Автоматично встановлює:
 * - Статус: RECEIVED_CN
 * - Місцезнаходження: на основі routeFrom
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
    const { receivedAtWarehouse } = body;

    if (!receivedAtWarehouse) {
      return NextResponse.json(
        { error: "Дата отримання на складі обов'язкова" },
        { status: 400 }
      );
    }

    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: { batch: true },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "Вантаж не знайдено" },
        { status: 404 }
      );
    }

    const receivedDate = new Date(receivedAtWarehouse);
    const automationData = getReceivedAtWarehouseData(shipment.routeFrom);

    // Оновлюємо вантаж
    const updated = await prisma.shipment.update({
      where: { id },
      data: {
        receivedAtWarehouse: receivedDate,
        status: automationData.status as any,
        location: automationData.location,
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
        description: `Вантаж ${shipment.internalTrack} позначено як прибув на склад`,
      },
    });

    return NextResponse.json({ shipment: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Error marking shipment as received:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

