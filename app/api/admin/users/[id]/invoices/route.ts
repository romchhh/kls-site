import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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
      } as Prisma.InvoiceInclude,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invoices }, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const { invoiceNumber, amount, shipmentId, status, dueDate } = body;

    if (!invoiceNumber || amount === undefined || amount === null || amount === "") {
      return NextResponse.json(
        { error: "Invoice number and amount are required" },
        { status: 400 },
      );
    }

    // Validate amount
    const amountValue = parseFloat(String(amount));
    if (isNaN(amountValue) || amountValue <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number" },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate and normalize status
    const validStatuses = ["UNPAID", "PAID", "ARCHIVED"];
    const invoiceStatus = status && validStatuses.includes(String(status).toUpperCase()) 
      ? String(status).toUpperCase() 
      : "UNPAID";

    // If shipmentId provided, verify it belongs to the user
    let finalShipmentId: string | null = null;
    if (shipmentId && String(shipmentId).trim() !== "") {
      const shipment = await prisma.shipment.findFirst({
        where: {
          id: String(shipmentId),
          userId: id,
        },
      });

      if (!shipment) {
        return NextResponse.json(
          { error: "Shipment not found or doesn't belong to this user" },
          { status: 404 },
        );
      }
      finalShipmentId = String(shipmentId);
    }

    // Generate unique invoice number if it already exists
    let finalInvoiceNumber = String(invoiceNumber);
    let counter = 1;
    while (true) {
      const existingInvoice = await prisma.invoice.findUnique({
        where: { invoiceNumber: finalInvoiceNumber },
      });

      if (!existingInvoice) {
        break; // Number is unique, we can use it
      }

      // Generate new number with suffix
      const baseNumber = String(invoiceNumber);
      finalInvoiceNumber = `${baseNumber}-${counter}`;
      counter++;

      // Safety check to prevent infinite loop
      if (counter > 1000) {
        return NextResponse.json(
          { error: "Unable to generate unique invoice number" },
          { status: 500 },
        );
      }
    }

    const invoice = await prisma.invoice.create({
      data: {
        userId: id,
        invoiceNumber: finalInvoiceNumber,
        amount: new Prisma.Decimal(amountValue),
        shipmentId: finalShipmentId,
        status: invoiceStatus as "UNPAID" | "PAID" | "ARCHIVED",
        dueDate: dueDate ? new Date(dueDate) : null,
      } as Prisma.InvoiceUncheckedCreateInput,
    });

    // Fetch invoice with relations
    const invoiceWithRelations = await prisma.invoice.findUnique({
      where: { id: invoice.id },
      include: {
        shipment: {
          select: {
            id: true,
            internalTrack: true,
            totalCost: true,
            createdAt: true,
          },
        },
      } as Prisma.InvoiceInclude,
    });

    // Log admin action
    try {
      await prisma.adminAction.create({
        data: {
          adminId: session.user.id,
          actionType: "CREATE_INVOICE",
          targetType: "INVOICE",
          targetId: invoice.id,
          description: `Created invoice ${invoiceNumber} for user ${user.clientCode}`,
        },
      });
    } catch (logError) {
      console.error("Failed to log admin action:", logError);
    }

    // Return invoice with a message if the number was modified
    const response: any = { invoice: invoiceWithRelations };
    if (finalInvoiceNumber !== String(invoiceNumber)) {
      response.message = `Invoice number was changed to ${finalInvoiceNumber} because ${invoiceNumber} already exists`;
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Invoice number already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create invoice", details: error.meta },
      { status: 500 },
    );
  }
}

