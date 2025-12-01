import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const { status, amount, dueDate } = body;

    const existing = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status: status !== undefined ? status : existing.status,
        amount: amount !== undefined ? new Prisma.Decimal(amount) : existing.amount,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existing.dueDate,
      },
      include: {
        shipment: {
          select: {
            id: true,
            internalTrack: true,
            totalCost: true,
            createdAt: true,
          },
        },
      },
    });

    // Log admin action
    try {
      await prisma.adminAction.create({
        data: {
          adminId: session.user.id,
          actionType: "UPDATE_INVOICE",
          targetType: "INVOICE",
          targetId: id,
          description: `Updated invoice ${existing.invoiceNumber}`,
        },
      });
    } catch (logError) {
      console.error("Failed to log admin action:", logError);
    }

    return NextResponse.json({ invoice: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    await prisma.invoice.delete({
      where: { id },
    });

    // Log admin action
    try {
      await prisma.adminAction.create({
        data: {
          adminId: session.user.id,
          actionType: "DELETE_INVOICE",
          targetType: "INVOICE",
          targetId: id,
          description: `Deleted invoice ${existing.invoiceNumber}`,
        },
      });
    } catch (logError) {
      console.error("Failed to log admin action:", logError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 },
    );
  }
}

