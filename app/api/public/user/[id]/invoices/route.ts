import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiToken } from "@/lib/api-auth";

// GET - Get all invoices for a user by user ID
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
        clientCode: true,
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

    // Get all invoices for this user
    const invoices = await prisma.invoice.findMany({
      where: { userId: id },
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
      orderBy: { createdAt: "desc" },
    });

    // Calculate invoice statistics
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => {
      return sum + Number(inv.amount);
    }, 0);
    const unpaidInvoices = invoices.filter((inv) => inv.status === "UNPAID");
    const unpaidAmount = unpaidInvoices.reduce((sum, inv) => {
      return sum + Number(inv.amount);
    }, 0);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          clientCode: user.clientCode,
        },
        invoices: invoices.map((invoice) => ({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.amount.toString(),
          status: invoice.status,
          dueDate: invoice.dueDate,
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
          shipment: invoice.shipment
            ? {
                id: invoice.shipment.id,
                internalTrack: invoice.shipment.internalTrack,
                totalCost: invoice.shipment.totalCost?.toString() || null,
                createdAt: invoice.shipment.createdAt,
              }
            : null,
        })),
        statistics: {
          total: totalInvoices,
          totalAmount: totalAmount.toFixed(2),
          unpaid: unpaidInvoices.length,
          unpaidAmount: unpaidAmount.toFixed(2),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching user invoices:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

