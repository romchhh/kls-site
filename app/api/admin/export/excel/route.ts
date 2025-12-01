import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { exportRateLimit } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    // Rate limiting for export endpoint
    const rateLimitResult = await exportRateLimit(req);
    if (rateLimitResult) {
      await logSecurityEvent('EXPORT_RATE_LIMIT_EXCEEDED', { pathname: req.nextUrl.pathname }, req);
      return rateLimitResult;
    }

    const session = await getServerSession(authOptions);

    // Only SUPERADMIN can export all data
    if (!session || session.user.role !== "SUPERADMIN") {
      await logSecurityEvent('UNAUTHORIZED_EXPORT_ATTEMPT', { 
        userId: session?.user?.id,
        role: session?.user?.role 
      }, req);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "KLS International";
    workbook.created = new Date();

    // Helper function to format dates
    const formatDate = (date: Date | null | undefined): string => {
      if (!date) return "";
      return new Date(date).toLocaleString("uk-UA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Helper function to format decimals
    const formatDecimal = (value: any): string => {
      if (!value) return "";
      return String(value);
    };

    // 1. Users Sheet
    const usersSheet = workbook.addWorksheet("Користувачі");
    usersSheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "Email", key: "email", width: 25 },
      { header: "Ім'я", key: "name", width: 20 },
      { header: "Телефон", key: "phone", width: 15 },
      { header: "Компанія", key: "companyName", width: 25 },
      { header: "Код клієнта", key: "clientCode", width: 15 },
      { header: "Роль", key: "role", width: 12 },
      { header: "Створено", key: "createdAt", width: 20 },
      { header: "Оновлено", key: "updatedAt", width: 20 },
      { header: "Останній вхід", key: "lastLogin", width: 20 },
    ];
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    users.forEach((user) => {
      usersSheet.addRow({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        companyName: user.companyName || "",
        clientCode: user.clientCode,
        role: user.role,
        createdAt: formatDate(user.createdAt),
        updatedAt: formatDate(user.updatedAt),
        lastLogin: formatDate(user.lastLogin),
      });
    });

    // 2. Shipments Sheet
    const shipmentsSheet = workbook.addWorksheet("Вантажі");
    shipmentsSheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "Код клієнта", key: "clientCode", width: 15 },
      { header: "Трек номер", key: "internalTrack", width: 15 },
      { header: "Статус", key: "status", width: 15 },
      { header: "Маршрут з", key: "routeFrom", width: 20 },
      { header: "Маршрут до", key: "routeTo", width: 20 },
      { header: "Тип доставки", key: "deliveryType", width: 15 },
      { header: "Місць", key: "pieces", width: 10 },
      { header: "Вага (кг)", key: "weightKg", width: 12 },
      { header: "Об'єм (м³)", key: "volumeM3", width: 12 },
      { header: "Вартість", key: "totalCost", width: 15 },
      { header: "Створено", key: "createdAt", width: 20 },
      { header: "Отримано на склад", key: "receivedAtWarehouse", width: 20 },
      { header: "Відправлено", key: "sentAt", width: 20 },
      { header: "Доставлено", key: "deliveredAt", width: 20 },
    ];
    const shipments = await prisma.shipment.findMany({
      include: {
        user: {
          select: {
            clientCode: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    shipments.forEach((shipment) => {
      shipmentsSheet.addRow({
        id: shipment.id,
        clientCode: shipment.clientCode,
        internalTrack: shipment.internalTrack,
        status: shipment.status,
        routeFrom: shipment.routeFrom,
        routeTo: shipment.routeTo,
        deliveryType: shipment.deliveryType,
        pieces: shipment.pieces,
        weightKg: formatDecimal(shipment.weightKg),
        volumeM3: formatDecimal(shipment.volumeM3),
        totalCost: formatDecimal(shipment.totalCost),
        createdAt: formatDate(shipment.createdAt),
        receivedAtWarehouse: formatDate(shipment.receivedAtWarehouse),
        sentAt: formatDate(shipment.sentAt),
        deliveredAt: formatDate(shipment.deliveredAt),
      });
    });

    // 3. Shipment Items Sheet
    const itemsSheet = workbook.addWorksheet("Позиції вантажів");
    itemsSheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "ID вантажу", key: "shipmentId", width: 30 },
      { header: "Код товару", key: "itemCode", width: 15 },
      { header: "Опис", key: "description", width: 30 },
      { header: "Кількість", key: "quantity", width: 12 },
      { header: "Вага (кг)", key: "weightKg", width: 12 },
      { header: "Об'єм (м³)", key: "volumeM3", width: 12 },
      { header: "Вартість", key: "totalCost", width: 15 },
    ];
    const items = await prisma.shipmentItem.findMany({
      orderBy: { id: "asc" },
    });
    items.forEach((item) => {
      itemsSheet.addRow({
        id: item.id,
        shipmentId: item.shipmentId,
        itemCode: item.itemCode || "",
        description: item.description || "",
        quantity: item.quantity || "",
        weightKg: formatDecimal(item.weightKg),
        volumeM3: formatDecimal(item.volumeM3),
        totalCost: formatDecimal(item.totalCost),
      });
    });

    // 4. Invoices Sheet
    const invoicesSheet = workbook.addWorksheet("Рахунки");
    invoicesSheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "Номер рахунка", key: "invoiceNumber", width: 20 },
      { header: "Код клієнта", key: "clientCode", width: 15 },
      { header: "Сума", key: "amount", width: 15 },
      { header: "Статус", key: "status", width: 12 },
      { header: "Термін оплати", key: "dueDate", width: 20 },
      { header: "ID вантажу", key: "shipmentId", width: 30 },
      { header: "Створено", key: "createdAt", width: 20 },
    ];
    const invoices = await prisma.invoice.findMany({
      include: {
        user: {
          select: {
            clientCode: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    invoices.forEach((invoice) => {
      invoicesSheet.addRow({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientCode: invoice.user.clientCode,
        amount: formatDecimal(invoice.amount),
        status: invoice.status,
        dueDate: formatDate(invoice.dueDate),
        shipmentId: (invoice as any).shipmentId || "",
        createdAt: formatDate(invoice.createdAt),
      });
    });

    // 5. Transactions Sheet
    const transactionsSheet = workbook.addWorksheet("Транзакції");
    transactionsSheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "Код клієнта", key: "clientCode", width: 15 },
      { header: "Тип", key: "type", width: 15 },
      { header: "Сума", key: "amount", width: 15 },
      { header: "Опис", key: "description", width: 30 },
      { header: "Створено", key: "createdAt", width: 20 },
    ];
    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: {
            clientCode: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    transactions.forEach((transaction) => {
      transactionsSheet.addRow({
        id: transaction.id,
        clientCode: transaction.user.clientCode,
        type: transaction.type,
        amount: formatDecimal(transaction.amount),
        description: transaction.description || "",
        createdAt: formatDate(transaction.createdAt),
      });
    });

    // 6. Admin Actions Sheet
    const actionsSheet = workbook.addWorksheet("Дії адмінів");
    actionsSheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "ID адміна", key: "adminId", width: 30 },
      { header: "Тип дії", key: "actionType", width: 20 },
      { header: "Тип об'єкта", key: "targetType", width: 15 },
      { header: "ID об'єкта", key: "targetId", width: 30 },
      { header: "Опис", key: "description", width: 40 },
      { header: "Створено", key: "createdAt", width: 20 },
    ];
    const actions = await prisma.adminAction.findMany({
      orderBy: { createdAt: "desc" },
    });
    actions.forEach((action) => {
      actionsSheet.addRow({
        id: action.id,
        adminId: action.adminId,
        actionType: action.actionType,
        targetType: action.targetType || "",
        targetId: action.targetId || "",
        description: action.description || "",
        createdAt: formatDate(action.createdAt),
      });
    });

    // 7. Warehouses Sheet
    const warehousesSheet = workbook.addWorksheet("Склади");
    warehousesSheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "Назва", key: "name", width: 25 },
      { header: "Адреса", key: "address", width: 30 },
      { header: "Місто", key: "city", width: 20 },
      { header: "Країна", key: "country", width: 15 },
      { header: "Телефон", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "Створено", key: "createdAt", width: 20 },
    ];
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { createdAt: "desc" },
    });
    warehouses.forEach((warehouse) => {
      warehousesSheet.addRow({
        id: warehouse.id,
        name: warehouse.name,
        address: warehouse.address,
        city: warehouse.city,
        country: warehouse.country,
        phone: warehouse.phone || "",
        email: warehouse.email || "",
        createdAt: formatDate(warehouse.createdAt),
      });
    });

    // Style header rows
    [usersSheet, shipmentsSheet, itemsSheet, invoicesSheet, transactionsSheet, actionsSheet, warehousesSheet].forEach(
      (sheet) => {
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE0E0E0" },
        };
      }
    );

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Log admin action
    try {
      await prisma.adminAction.create({
        data: {
          adminId: session.user.id,
          actionType: "EXPORT_DATABASE",
          targetType: "DATABASE",
          description: `Exported entire database to Excel`,
        },
      });
    } catch (logError) {
      console.error("Failed to log admin action:", logError);
    }

    // Return file
    const fileName = `kls_database_export_${new Date().toISOString().split("T")[0]}.xlsx`;
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error("Error exporting database:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export database" },
      { status: 500 }
    );
  }
}

