import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyApiToken } from "@/lib/api-auth";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shipmentId: string }> }
) {
  try {
    const { shipmentId } = await params;
    
    // Try to authenticate via session first
    const session = await getServerSession(authOptions);
    
    // If no session, try API token
    let authenticated = false;
    
    if (session) {
      authenticated = true;
    } else {
      // Try API token authentication
      const tokenVerification = await verifyApiToken(req);
      if (tokenVerification.valid) {
        authenticated = true;
      }
    }

    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get shipment with all related data
    // Try to find by ID first, then by internalTrack if not found
    let shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        user: {
          select: {
            id: true,
            clientCode: true,
            name: true,
            email: true,
          },
        },
        items: {
          orderBy: [{ placeNumber: "asc" }],
        },
      },
    });

    // If not found by ID, try to find by internalTrack
    if (!shipment) {
      shipment = await prisma.shipment.findUnique({
        where: { internalTrack: shipmentId },
        include: {
          user: {
            select: {
              id: true,
              clientCode: true,
              name: true,
              email: true,
            },
          },
          items: {
            orderBy: [{ placeNumber: "asc" }],
          },
        },
      });
    }

    if (!shipment) {
      return NextResponse.json(
        { error: "Вантаж не знайдено за ID або трек номером" },
        { status: 404 }
      );
    }

    // Check permissions
    // For API tokens, allow access (they're already verified)
    // For sessions, check user role and ownership
    if (session) {
      if (
        session.user.role !== "ADMIN" &&
        session.user.role !== "SUPERADMIN" &&
        shipment.userId !== session.user.id
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    // API tokens are allowed (they're created by admins and are trusted)

    // Helper function to format track number - remove batch ID (part before first dash)
    const formatTrackNumber = (track: string | null | undefined): string => {
      if (!track) return "";
      const parts = track.split("-");
      // Return part after first dash, or original if no dash
      return parts.length > 1 ? parts.slice(1).join("-") : track;
    };

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Інвойс");

    // Set column widths (increased for better readability)
    worksheet.columns = [
      { width: 12 },  // A - № Місця
      { width: 22 },  // B - Трек номер
      { width: 40 },  // C - Опис
      { width: 15 },  // D - Кількість ШТ
      { width: 15 },  // E - Страхування Сума
      { width: 10 },  // F - Страхування %
      { width: 15 },  // G - Страхування Вартість
      { width: 14 },  // H - Вага KG
      { width: 15 },  // I - об'єм м3
      { width: 15 },  // J - Щільність
      { width: 18 },  // K - Тариф кг/м3
      { width: 16 },  // L - Вартість
      { width: 6 },   // M - spacing
      { width: 18 },  // N - dates/totals
    ];

    // БІРЮЗОВА ШАПКА - Рядки 1-5 (Teal/Turquoise header)
    const tealColor = "FF006D77"; // Brand color #006D77
    
    for (let row = 1; row <= 5; row++) {
      const rowObj = worksheet.getRow(row);
      rowObj.height = 25; // Increased row height
      for (let col = 1; col <= 14; col++) {
        const cell = worksheet.getCell(row, col);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: tealColor },
        };
      }
    }

    // Add logo in top right corner (rows 1-5, columns 1-3 for logo placement)
    const logoPath = path.join(process.cwd(), "public", "білий на бірюзовому@2x.png");
    if (fs.existsSync(logoPath)) {
      try {
        const logoImage = workbook.addImage({
          filename: logoPath,
          extension: "png",
        });
        worksheet.addImage(logoImage, {
          tl: { col: 0.2, row: 0.5 }, // Top-left position
          ext: { width: 280, height: 120 }, // Logo size (doubled: 140*2 x 60*2)
        });
      } catch (logoError) {
        console.error("Failed to add logo to invoice:", logoError);
      }
    }

    // Row 6: Код Клієнта + Маркування (СІРИЙ ФОН)
    let currentRow = 6;
    
    // Set row height for header rows
    worksheet.getRow(currentRow).height = 22;
    worksheet.getRow(currentRow + 1).height = 22;
    worksheet.getRow(currentRow + 2).height = 22;
    
    worksheet.getCell(`A${currentRow}`).value = "Код Клієнта:";
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    
    worksheet.getCell(`B${currentRow}`).value = shipment.user.clientCode;
    worksheet.getCell(`B${currentRow}`).font = { bold: true, size: 12 };
    
    worksheet.getCell(`G${currentRow}`).value = "Тип:";
    worksheet.getCell(`G${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`G${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    
    worksheet.getCell(`H${currentRow}`).value = 
      shipment.deliveryType === "AIR" ? "АВІА" : 
      shipment.deliveryType === "SEA" ? "МОРЕ" :
      shipment.deliveryType === "RAIL" ? "ЗАЛІЗНИЦЯ" : "МУЛЬТИМОДАЛЬНА";
    worksheet.getCell(`H${currentRow}`).font = { bold: true, size: 12 };
    
    worksheet.getCell(`I${currentRow}`).value = "Напрям:";
    worksheet.getCell(`I${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`I${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    
    worksheet.getCell(`J${currentRow}`).value = shipment.routeFrom || "CN";
    worksheet.getCell(`J${currentRow}`).font = { bold: true, size: 12 };
    
    worksheet.getCell(`K${currentRow}`).value = shipment.routeTo || "UA";
    worksheet.getCell(`K${currentRow}`).font = { bold: true, size: 12 };
    
    worksheet.getCell(`L${currentRow}`).value = "Отримано:";
    worksheet.getCell(`L${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`L${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    
    worksheet.mergeCells(`M${currentRow}:N${currentRow}`);
    worksheet.getCell(`M${currentRow}`).value = shipment.receivedAtWarehouse
      ? new Date(shipment.receivedAtWarehouse).toLocaleDateString("uk-UA", {
          day: "numeric",
          month: "numeric",
          year: "2-digit",
        })
      : "";
    worksheet.getCell(`M${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`M${currentRow}`).alignment = { horizontal: "right" };

    // Row 7: Маркування + Відправлено
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = "Маркування:";
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    
    worksheet.mergeCells(`B${currentRow}:F${currentRow}`);
    worksheet.getCell(`B${currentRow}`).value = shipment.cargoLabel || "";
    worksheet.getCell(`B${currentRow}`).font = { bold: true, size: 12 };
    
    worksheet.getCell(`L${currentRow}`).value = "Відправлено:";
    worksheet.getCell(`L${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`L${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    
    worksheet.mergeCells(`M${currentRow}:N${currentRow}`);
    worksheet.getCell(`M${currentRow}`).value = shipment.sentAt
      ? new Date(shipment.sentAt).toLocaleDateString("uk-UA", {
          day: "numeric",
          month: "numeric",
          year: "2-digit",
        })
      : "";
    worksheet.getCell(`M${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`M${currentRow}`).alignment = { horizontal: "right" };

    // Row 8: Порожній рядок + Доставлено
    currentRow++;
    worksheet.getCell(`L${currentRow}`).value = "Доставлено:";
    worksheet.getCell(`L${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`L${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    
    worksheet.mergeCells(`M${currentRow}:N${currentRow}`);
    worksheet.getCell(`M${currentRow}`).value = shipment.deliveredAt
      ? new Date(shipment.deliveredAt).toLocaleDateString("uk-UA", {
          day: "numeric",
          month: "numeric",
          year: "2-digit",
        })
      : "";
    worksheet.getCell(`M${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`M${currentRow}`).alignment = { horizontal: "right" };

    currentRow += 2; // Пропускаємо рядок

    // ЗАГОЛОВОК ТАБЛИЦІ - Row 10-11
    const headerStartRow = currentRow;
    
    // Set header row heights
    worksheet.getRow(headerStartRow).height = 30;
    worksheet.getRow(headerStartRow + 1).height = 25;
    
    // Merged headers
    worksheet.mergeCells(`A${currentRow}:A${currentRow + 1}`);
    worksheet.getCell(`A${currentRow}`).value = "№ Місця";
    worksheet.getCell(`A${currentRow}`).alignment = { 
      vertical: "middle", 
      horizontal: "center", 
      wrapText: true 
    };
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };

    worksheet.mergeCells(`B${currentRow}:B${currentRow + 1}`);
    worksheet.getCell(`B${currentRow}`).value = "Трек номер";
    worksheet.getCell(`B${currentRow}`).alignment = { 
      vertical: "middle", 
      horizontal: "center", 
      wrapText: true 
    };
    worksheet.getCell(`B${currentRow}`).font = { bold: true, size: 12 };

    worksheet.mergeCells(`C${currentRow}:C${currentRow + 1}`);
    worksheet.getCell(`C${currentRow}`).value = "Опис";
    worksheet.getCell(`C${currentRow}`).alignment = { 
      vertical: "middle", 
      horizontal: "center", 
      wrapText: true 
    };
    worksheet.getCell(`C${currentRow}`).font = { bold: true, size: 12 };

    worksheet.mergeCells(`D${currentRow}:D${currentRow + 1}`);
    worksheet.getCell(`D${currentRow}`).value = "Кількість\nШТ";
    worksheet.getCell(`D${currentRow}`).alignment = { 
      vertical: "middle", 
      horizontal: "center", 
      wrapText: true 
    };
    worksheet.getCell(`D${currentRow}`).font = { bold: true, size: 12 };

    // Страхування header (merged across E, F, G)
    worksheet.mergeCells(`E${currentRow}:G${currentRow}`);
    worksheet.getCell(`E${currentRow}`).value = "Страхування";
    worksheet.getCell(`E${currentRow}`).alignment = { 
      vertical: "middle", 
      horizontal: "center" 
    };
    worksheet.getCell(`E${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`E${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };

    // Sub-headers for Страхування
    worksheet.getCell(`E${currentRow + 1}`).value = "Сума";
    worksheet.getCell(`E${currentRow + 1}`).alignment = { horizontal: "center" };
    worksheet.getCell(`E${currentRow + 1}`).font = { bold: true, size: 12 };
    
    worksheet.getCell(`F${currentRow + 1}`).value = "%";
    worksheet.getCell(`F${currentRow + 1}`).alignment = { horizontal: "center" };
    worksheet.getCell(`F${currentRow + 1}`).font = { bold: true, size: 12 };
    
    worksheet.getCell(`G${currentRow + 1}`).value = "Вартість";
    worksheet.getCell(`G${currentRow + 1}`).alignment = { horizontal: "center" };
    worksheet.getCell(`G${currentRow + 1}`).font = { bold: true, size: 12 };

    worksheet.mergeCells(`H${currentRow}:H${currentRow + 1}`);
    worksheet.getCell(`H${currentRow}`).value = "Вага KG";
    worksheet.getCell(`H${currentRow}`).alignment = { 
      vertical: "middle", 
      horizontal: "center", 
      wrapText: true 
    };
    worksheet.getCell(`H${currentRow}`).font = { bold: true, size: 12 };

    worksheet.mergeCells(`I${currentRow}:I${currentRow + 1}`);
    worksheet.getCell(`I${currentRow}`).value = "об'єм м3";
    worksheet.getCell(`I${currentRow}`).alignment = { 
      vertical: "middle", 
      horizontal: "center", 
      wrapText: true 
    };
    worksheet.getCell(`I${currentRow}`).font = { bold: true, size: 12 };

    worksheet.mergeCells(`J${currentRow}:J${currentRow + 1}`);
    worksheet.getCell(`J${currentRow}`).value = "Щільність";
    worksheet.getCell(`J${currentRow}`).alignment = { 
      vertical: "middle", 
      horizontal: "center", 
      wrapText: true 
    };
    worksheet.getCell(`J${currentRow}`).font = { bold: true, size: 12 };

    worksheet.mergeCells(`K${currentRow}:K${currentRow + 1}`);
    worksheet.getCell(`K${currentRow}`).value = "Тариф\nкг/м3";
    worksheet.getCell(`K${currentRow}`).alignment = { 
      vertical: "middle", 
      horizontal: "center", 
      wrapText: true 
    };
    worksheet.getCell(`K${currentRow}`).font = { bold: true, size: 12 };

    worksheet.mergeCells(`L${currentRow}:L${currentRow + 1}`);
    worksheet.getCell(`L${currentRow}`).value = "Вартість";
    worksheet.getCell(`L${currentRow}`).alignment = { 
      vertical: "middle", 
      horizontal: "center", 
      wrapText: true 
    };
    worksheet.getCell(`L${currentRow}`).font = { bold: true, size: 12 };

    // Apply borders and gray background to header cells
    for (let col = 1; col <= 12; col++) {
      for (let row = headerStartRow; row <= headerStartRow + 1; row++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
        // Gray background for all except merged "Страхування" parent
        if (!(row === headerStartRow && col >= 5 && col <= 7)) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD9D9D9" },
          };
        }
      }
    }

    currentRow += 2;

    // DATA ROWS (Items)
    let totalInsuranceValue = 0;
    let totalInsuranceCost = 0;
    let totalWeight = 0;
    let totalVolume = 0;
    let totalDeliveryCost = 0;

    shipment.items.forEach((item: (typeof shipment.items)[number]) => {
      const insuranceValue = item.insuranceValue ? Number(item.insuranceValue) : 0;
      const insurancePercent = item.insurancePercent || 0;
      const insuranceCost = item.insuranceCost ? Number(item.insuranceCost) : 0;
      const weight = item.weightKg ? Number(item.weightKg) : 0;
      const volume = item.volumeM3 ? Number(item.volumeM3) : 0;
      const deliveryCost = item.deliveryCost ? Number(item.deliveryCost) : 0;
      const density = weight > 0 && volume > 0 ? weight / volume : 0;
      const tariff = item.tariffValue ? Number(item.tariffValue) : 0;

      totalInsuranceValue += insuranceValue;
      totalInsuranceCost += insuranceCost;
      totalWeight += weight;
      totalVolume += volume;
      totalDeliveryCost += deliveryCost;

      // Set row height for data rows
      worksheet.getRow(currentRow).height = 22;
      
      worksheet.getCell(`A${currentRow}`).value = item.placeNumber || "";
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
      worksheet.getCell(`A${currentRow}`).font = { size: 11 };
      
      worksheet.getCell(`B${currentRow}`).value = formatTrackNumber(item.trackNumber);
      worksheet.getCell(`B${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
      worksheet.getCell(`B${currentRow}`).font = { size: 11 };
      
      worksheet.getCell(`C${currentRow}`).value = item.description || "";
      worksheet.getCell(`C${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
      worksheet.getCell(`C${currentRow}`).font = { size: 11 };
      
      worksheet.getCell(`D${currentRow}`).value = item.quantity || "";
      worksheet.getCell(`D${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
      worksheet.getCell(`D${currentRow}`).font = { size: 11 };
      
      worksheet.getCell(`E${currentRow}`).value = insuranceValue > 0 ? Number(insuranceValue.toFixed(2)) : "";
      worksheet.getCell(`E${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
      worksheet.getCell(`E${currentRow}`).numFmt = "0.00";
      worksheet.getCell(`E${currentRow}`).font = { size: 11 };
      
      worksheet.getCell(`F${currentRow}`).value = insurancePercent > 0 ? `${insurancePercent}%` : "";
      worksheet.getCell(`F${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
      worksheet.getCell(`F${currentRow}`).font = { size: 11 };
      
      worksheet.getCell(`G${currentRow}`).value = insuranceCost > 0 ? Number(insuranceCost.toFixed(2)) : "";
      worksheet.getCell(`G${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
      worksheet.getCell(`G${currentRow}`).numFmt = "0.00";
      worksheet.getCell(`G${currentRow}`).font = { size: 11 };
      
      worksheet.getCell(`H${currentRow}`).value = weight > 0 ? Number(weight.toFixed(2)) : "";
      worksheet.getCell(`H${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
      worksheet.getCell(`H${currentRow}`).numFmt = "0.00";
      worksheet.getCell(`H${currentRow}`).font = { size: 11 };
      
      worksheet.getCell(`I${currentRow}`).value = volume > 0 ? Number(volume.toFixed(4)) : "";
      worksheet.getCell(`I${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
      worksheet.getCell(`I${currentRow}`).numFmt = "0.0000";
      worksheet.getCell(`I${currentRow}`).font = { size: 11 };
      
      worksheet.getCell(`J${currentRow}`).value = density > 0 ? Number(density.toFixed(2)) : "";
      worksheet.getCell(`J${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
      worksheet.getCell(`J${currentRow}`).numFmt = "0.00";
      worksheet.getCell(`J${currentRow}`).font = { size: 11 };
      
      worksheet.getCell(`K${currentRow}`).value = tariff > 0 ? Number(tariff.toFixed(2)) : "";
      worksheet.getCell(`K${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
      worksheet.getCell(`K${currentRow}`).numFmt = "0.00";
      worksheet.getCell(`K${currentRow}`).font = { size: 11 };
      
      worksheet.getCell(`L${currentRow}`).value = deliveryCost > 0 ? Number(deliveryCost.toFixed(2)) : "";
      worksheet.getCell(`L${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
      worksheet.getCell(`L${currentRow}`).numFmt = "0.00";
      worksheet.getCell(`L${currentRow}`).font = { size: 11 };

      // Borders for data rows
      for (let col = 1; col <= 12; col++) {
        const cell = worksheet.getCell(currentRow, col);
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      }

      currentRow++;
    });

    // TOTAL ROW (bold + gray background)
    worksheet.getRow(currentRow).height = 25; // Increased height for total row
    
    const avgDensity = totalWeight > 0 && totalVolume > 0 ? totalWeight / totalVolume : 0;
    const avgTariff = totalDeliveryCost > 0 && totalVolume > 0 ? totalDeliveryCost / totalVolume : 0;

    worksheet.getCell(`A${currentRow}`).value = shipment.items.length;
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
    
    worksheet.getCell(`B${currentRow}`).value = formatTrackNumber(shipment.internalTrack);
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
    worksheet.getCell(`B${currentRow}`).font = { bold: true, size: 12 };
    
    worksheet.getCell(`E${currentRow}`).value = totalInsuranceValue > 0 ? Number(totalInsuranceValue.toFixed(2)) : "";
    worksheet.getCell(`E${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`E${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`E${currentRow}`).numFmt = "0.00";
    
    worksheet.getCell(`G${currentRow}`).value = totalInsuranceCost > 0 ? Number(totalInsuranceCost.toFixed(2)) : "";
    worksheet.getCell(`G${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`G${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`G${currentRow}`).numFmt = "0.00";
    
    worksheet.getCell(`H${currentRow}`).value = totalWeight > 0 ? Number(totalWeight.toFixed(2)) : "";
    worksheet.getCell(`H${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`H${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`H${currentRow}`).numFmt = "0.00";
    
    worksheet.getCell(`I${currentRow}`).value = totalVolume > 0 ? Number(totalVolume.toFixed(5)) : "";
    worksheet.getCell(`I${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`I${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`I${currentRow}`).numFmt = "0.00000";
    
    worksheet.getCell(`J${currentRow}`).value = avgDensity > 0 ? Number(avgDensity.toFixed(2)) : "";
    worksheet.getCell(`J${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`J${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`J${currentRow}`).numFmt = "0.00";
    
    worksheet.getCell(`K${currentRow}`).value = avgTariff > 0 ? Number(avgTariff.toFixed(2)) : "";
    worksheet.getCell(`K${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`K${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`K${currentRow}`).numFmt = "0.00";
    
    worksheet.getCell(`L${currentRow}`).value = totalDeliveryCost > 0 ? Number(totalDeliveryCost.toFixed(2)) : "";
    worksheet.getCell(`L${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`L${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`L${currentRow}`).numFmt = "0.00";

    // Total row borders and gray background
    for (let col = 1; col <= 12; col++) {
      const cell = worksheet.getCell(currentRow, col);
      cell.border = {
        top: { style: "medium", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "medium", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
    }

    currentRow += 3;

    // SUMMARY SECTION (right side)
    const packingCost = shipment.packingCost ? Number(shipment.packingCost) : 0;
    const localDeliveryCost = shipment.localDeliveryCost ? Number(shipment.localDeliveryCost) : 0;
    const totalCost = totalDeliveryCost + packingCost + localDeliveryCost + totalInsuranceCost;

    // Set row heights for summary section
    worksheet.getRow(currentRow).height = 22;
    worksheet.getRow(currentRow + 1).height = 22;
    worksheet.getRow(currentRow + 2).height = 22;
    worksheet.getRow(currentRow + 3).height = 22;
    worksheet.getRow(currentRow + 5).height = 25;
    worksheet.getRow(currentRow + 7).height = 25;
    worksheet.getRow(currentRow + 9).height = 28;

    // Вартість доставки
    worksheet.mergeCells(`J${currentRow}:K${currentRow}`);
    worksheet.getCell(`J${currentRow}`).value = "Вартість доставки:";
    worksheet.getCell(`J${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`J${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
    
    worksheet.mergeCells(`L${currentRow}:M${currentRow}`);
    worksheet.getCell(`L${currentRow}`).value = `${totalDeliveryCost.toFixed(1).replace(".", ",")} USD`;
    worksheet.getCell(`L${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`L${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };

    // Вартість пакування
    currentRow++;
    worksheet.mergeCells(`J${currentRow}:K${currentRow}`);
    worksheet.getCell(`J${currentRow}`).value = "Вартість пакування:";
    worksheet.getCell(`J${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`J${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
    
    worksheet.mergeCells(`L${currentRow}:M${currentRow}`);
    worksheet.getCell(`L${currentRow}`).value = `${packingCost.toFixed(2).replace(".", ",")} USD`;
    worksheet.getCell(`L${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`L${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };

    // Вартість локальної доставки
    currentRow++;
    worksheet.mergeCells(`J${currentRow}:K${currentRow}`);
    worksheet.getCell(`J${currentRow}`).value = "Вартість локальної доставки:";
    worksheet.getCell(`J${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`J${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
    
    worksheet.mergeCells(`L${currentRow}:M${currentRow}`);
    worksheet.getCell(`L${currentRow}`).value = `${localDeliveryCost.toFixed(2).replace(".", ",")} USD`;
    worksheet.getCell(`L${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`L${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };

    // Вартість страхування
    currentRow++;
    worksheet.mergeCells(`J${currentRow}:K${currentRow}`);
    worksheet.getCell(`J${currentRow}`).value = "Вартість страхування:";
    worksheet.getCell(`J${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`J${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
    
    worksheet.mergeCells(`L${currentRow}:M${currentRow}`);
    worksheet.getCell(`L${currentRow}`).value = `${totalInsuranceCost.toFixed(1).replace(".", ",")} USD`;
    worksheet.getCell(`L${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`L${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };

    currentRow += 2;

    // Загалом (USD)
    worksheet.mergeCells(`J${currentRow}:K${currentRow}`);
    worksheet.getCell(`J${currentRow}`).value = "Загалом (USD)";
    worksheet.getCell(`J${currentRow}`).font = { bold: true, size: 13 };
    worksheet.getCell(`J${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
    
    worksheet.mergeCells(`L${currentRow}:M${currentRow}`);
    worksheet.getCell(`L${currentRow}`).value = `${totalCost.toFixed(1).replace(".", ",")} USD`;
    worksheet.getCell(`L${currentRow}`).font = { bold: true, size: 13 };
    worksheet.getCell(`L${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };

    currentRow += 2;

    // Баланс клієнта
    worksheet.mergeCells(`J${currentRow}:K${currentRow}`);
    worksheet.getCell(`J${currentRow}`).value = "Баланс клієнта";
    worksheet.getCell(`J${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`J${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
    
    worksheet.getCell(`L${currentRow}`).value = shipment.user.clientCode;
    worksheet.getCell(`L${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`L${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
    
    worksheet.getCell(`M${currentRow}`).value = "0,00 USD";
    worksheet.getCell(`M${currentRow}`).font = { bold: true, size: 12 };
    worksheet.getCell(`M${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };

    currentRow += 2;

    // Загалом до сплати (USD) with gray background
    worksheet.mergeCells(`J${currentRow}:M${currentRow}`);
    worksheet.getCell(`J${currentRow}`).value = `Загалом до сплати (USD):               ${totalCost.toFixed(1).replace(".", ",")} USD`;
    worksheet.getCell(`J${currentRow}`).font = { bold: true, size: 14 };
    worksheet.getCell(`J${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`J${currentRow}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    worksheet.getCell(`J${currentRow}`).border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return Excel file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="invoice_${shipment.internalTrack}_${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating invoice:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}