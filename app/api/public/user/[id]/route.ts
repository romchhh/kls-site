import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiToken } from "@/lib/api-auth";
import { Prisma } from "@prisma/client";

// GET - Get complete user information with balance, invoices, and shipment statistics
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify Bearer token
    const tokenVerification = await verifyApiToken(req);
    if (!tokenVerification.valid) {
      return NextResponse.json(
        {
          error: tokenVerification.error || "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        clientCode: true,
        companyName: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Get balance (income and expense totals)
    const [incomeAgg, expenseAgg] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId: id, type: "income" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId: id, type: "expense" },
        _sum: { amount: true },
      }),
    ]);

    const zero = new Prisma.Decimal(0);
    const income = incomeAgg._sum.amount ?? zero;
    const expense = expenseAgg._sum.amount ?? zero;
    const balance = income.minus(expense);

    // Get invoices
    const invoices = await prisma.invoice.findMany({
      where: { userId: id },
      include: {
        shipment: {
          select: {
            id: true,
            internalTrack: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalInvoices = invoices.length;
    const totalInvoiceAmount = invoices.reduce((sum, inv) => {
      return sum + Number(inv.amount);
    }, 0);
    const unpaidInvoices = invoices.filter((inv) => inv.status === "UNPAID");
    const unpaidAmount = unpaidInvoices.reduce((sum, inv) => {
      return sum + Number(inv.amount);
    }, 0);
    const unpaidShipmentsCount = new Set(
      unpaidInvoices.filter((inv) => inv.shipmentId).map((inv) => inv.shipmentId)
    ).size;

    // Get shipments (excluding CREATED status)
    const shipments = await prisma.shipment.findMany({
      where: {
        userId: id,
        NOT: {
          status: "CREATED", // Exclude shipments with 'CREATED' status
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    // Calculate shipment statistics
    const shipmentStats = {
      total: shipments.length,
      received: 0,
      inTransit: 0,
      readyForPickup: 0,
    };

    for (const shipment of shipments) {
      switch (shipment.status) {
        case "RECEIVED_CN":
        case "CONSOLIDATION":
          shipmentStats.received += 1;
          break;
        case "IN_TRANSIT":
        case "ARRIVED_UA":
          shipmentStats.inTransit += 1;
          break;
        case "ON_UA_WAREHOUSE":
        case "DELIVERED":
          shipmentStats.readyForPickup += 1;
          break;
        default:
          break;
      }
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          clientCode: user.clientCode,
          companyName: user.companyName,
        },
        balance: {
          available: balance.toNumber(),
          incomeTotal: income.toNumber(),
          expenseTotal: expense.toNumber(),
          currency: "USD",
        },
        invoices: {
          total: totalInvoices,
          totalAmount: totalInvoiceAmount.toFixed(2),
          unpaid: unpaidInvoices.length,
          unpaidAmount: unpaidAmount.toFixed(2),
          unpaidShipmentsCount: unpaidShipmentsCount,
        },
        shipments: shipmentStats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching user information:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

