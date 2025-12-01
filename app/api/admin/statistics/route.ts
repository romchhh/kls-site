import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const isSuperAdmin = session.user.role === "SUPERADMIN";

    // Get all statistics
    const [
      totalUsers,
      totalAdmins,
      totalShipments,
      totalInvoices,
      totalTransactions,
      shipmentsByStatus,
      invoicesByStatus,
      totalInvoiceAmount,
      unpaidInvoiceAmount,
      totalBalance,
      totalIncome,
      totalExpense,
      activeUsers,
      recentShipments,
      recentInvoices,
    ] = await Promise.all([
      // Total users
      prisma.user.count({
        where: { role: "USER" },
      }),
      // Total admins (only for SuperAdmin)
      isSuperAdmin
        ? prisma.user.count({
            where: { role: { in: ["ADMIN", "SUPERADMIN"] } },
          })
        : Promise.resolve(0),
      // Total shipments
      prisma.shipment.count(),
      // Total invoices
      prisma.invoice.count(),
      // Total transactions
      prisma.transaction.count(),
      // Shipments by status
      prisma.shipment.groupBy({
        by: ["status"],
        _count: true,
      }),
      // Invoices by status
      prisma.invoice.groupBy({
        by: ["status"],
        _count: true,
        _sum: {
          amount: true,
        },
      }),
      // Total invoice amount
      prisma.invoice.aggregate({
        _sum: {
          amount: true,
        },
      }),
      // Unpaid invoice amount
      prisma.invoice.aggregate({
        where: { status: "UNPAID" },
        _sum: {
          amount: true,
        },
      }),
      // Total balance will be calculated from all transactions
      Promise.resolve(0),
      // Total income
      prisma.transaction.aggregate({
        where: { type: "income" },
        _sum: {
          amount: true,
        },
      }),
      // Total expense
      prisma.transaction.aggregate({
        where: { type: "expense" },
        _sum: {
          amount: true,
        },
      }),
      // Active users (logged in last 30 days)
      prisma.user.count({
        where: {
          role: "USER",
          lastLogin: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      // Recent shipments (last 10)
      prisma.shipment.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          internalTrack: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              clientCode: true,
            },
          },
        },
      }),
      // Recent invoices (last 10)
      prisma.invoice.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          invoiceNumber: true,
          amount: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              clientCode: true,
            },
          },
        },
      }),
    ]);

    // Calculate total balance from transactions
    const calculatedTotalBalance =
      Number(totalIncome._sum.amount || 0) - Number(totalExpense._sum.amount || 0);

    return NextResponse.json(
      {
        statistics: {
          users: {
            total: totalUsers,
            active: activeUsers,
          },
          admins: isSuperAdmin ? { total: totalAdmins } : null,
          shipments: {
            total: totalShipments,
            byStatus: shipmentsByStatus.reduce(
              (acc, item) => {
                acc[item.status] = item._count;
                return acc;
              },
              {} as Record<string, number>
            ),
          },
          invoices: {
            total: totalInvoices,
            byStatus: invoicesByStatus.reduce(
              (acc, item) => {
                acc[item.status] = {
                  count: item._count,
                  amount: Number(item._sum.amount || 0),
                };
                return acc;
              },
              {} as Record<string, { count: number; amount: number }>
            ),
            totalAmount: Number(totalInvoiceAmount._sum.amount || 0),
            unpaidAmount: Number(unpaidInvoiceAmount._sum.amount || 0),
          },
          transactions: {
            total: totalTransactions,
            totalIncome: Number(totalIncome._sum.amount || 0),
            totalExpense: Number(totalExpense._sum.amount || 0),
          },
          balance: {
            total: calculatedTotalBalance,
          },
          recent: {
            shipments: recentShipments,
            invoices: recentInvoices,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

