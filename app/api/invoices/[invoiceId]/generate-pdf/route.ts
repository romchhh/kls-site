import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyApiToken } from "@/lib/api-auth";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;
    
    // Try to authenticate via session first
    const session = await getServerSession(authOptions);
    
    // If no session, try API token
    let authenticated = false;
    let userId: string | null = null;
    let isAdmin = false;
    
    if (session) {
      authenticated = true;
      userId = session.user.id;
      isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPERADMIN";
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

    // Get invoice with shipment and related data
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        shipment: {
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
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Інвойс не знайдено" },
        { status: 404 }
      );
    }

    if (!invoice.shipment) {
      return NextResponse.json(
        { error: "Вантаж не знайдено для цього інвойсу" },
        { status: 404 }
      );
    }

    const shipment = invoice.shipment;

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

    // Helper function to format track number
    const formatTrackNumber = (track: string | null | undefined): string => {
      if (!track) return "";
      const parts = track.split("-");
      return parts.length > 1 ? parts.slice(1).join("-") : track;
    };

    // Calculate totals
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

      totalInsuranceValue += insuranceValue;
      totalInsuranceCost += insuranceCost;
      totalWeight += weight;
      totalVolume += volume;
      totalDeliveryCost += deliveryCost;
    });

    const packingCost = shipment.packingCost ? Number(shipment.packingCost) : 0;
    const localDeliveryCost = shipment.localDeliveryCost ? Number(shipment.localDeliveryCost) : 0;
    const totalCost = totalDeliveryCost + packingCost + localDeliveryCost + totalInsuranceCost;
    const avgDensity = totalWeight > 0 && totalVolume > 0 ? totalWeight / totalVolume : 0;
    const avgTariff = totalDeliveryCost > 0 && totalVolume > 0 ? totalDeliveryCost / totalVolume : 0;

    // Format dates
    const formatDate = (date: Date | null | undefined): string => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      });
    };

    // Get logo as base64
    const logoBase64 = await getLogoBase64();

    // Generate HTML for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      margin: 0.5cm;
      size: A4 landscape;
    }
    body {
      font-family: Arial, sans-serif;
      font-size: 10px;
      margin: 0;
      padding: 0;
    }
    .header {
      background-color: #006D77;
      height: 100px;
      position: relative;
      margin-bottom: 10px;
    }
    .logo {
      position: absolute;
      top: -30px;
      left: 10px;
      width: 280px;
      height: 120px;
    }
    .info-row {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 5px;
      font-weight: bold;
      font-size: 11px;
    }
    .info-item {
      display: flex;
      align-items: center;
      margin-right: 20px;
      min-width: 180px;
    }
    .info-label {
      background-color: #D9D9D9;
      padding: 3px 8px;
      min-width: 120px;
      text-align: left;
      margin-right: 8px;
    }
    .info-value {
      text-align: left;
      min-width: 60px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 10px;
    }
    th {
      background-color: #D9D9D9;
      border: 1px solid #000;
      padding: 5px;
      text-align: center;
      font-weight: bold;
    }
    td {
      border: 1px solid #000;
      padding: 4px;
      text-align: right;
    }
    td.left {
      text-align: left;
    }
    td.center {
      text-align: center;
    }
    .total-row {
      background-color: #D9D9D9;
      font-weight: bold;
    }
    .summary {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
    .summary-table {
      width: 400px;
      border-collapse: collapse;
      font-size: 11px;
    }
    .summary-table td {
      padding: 5px 8px;
      border: 1px solid #000;
    }
    .summary-table td.label {
      background-color: #D9D9D9;
      font-weight: bold;
      text-align: right;
      width: 60%;
    }
    .summary-table td.value {
      text-align: right;
      font-weight: bold;
      width: 40%;
    }
    .summary-total {
      background-color: #D9D9D9;
      padding: 8px;
      font-size: 13px;
      font-weight: bold;
      border: 1px solid #000;
      margin-top: 10px;
      text-align: right;
    }
    .services-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 10px;
    }
    .services-table th {
      background-color: #D9D9D9;
      border: 1px solid #000;
      padding: 5px;
      text-align: center;
      font-weight: bold;
    }
    .services-table td {
      border: 1px solid #000;
      padding: 4px;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="data:image/png;base64,${logoBase64}" class="logo" alt="KLS Logo">
  </div>

  <div class="info-row">
    <div class="info-item">
      <span class="info-label">Код Клієнта:</span>
      <span class="info-value">${shipment.user.clientCode}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Тип:</span>
      <span class="info-value">${shipment.deliveryType === "AIR" ? "АВІА" : shipment.deliveryType === "SEA" ? "МОРЕ" : shipment.deliveryType === "RAIL" ? "ЗАЛІЗНИЦЯ" : "МУЛЬТИМОДАЛЬНА"}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Напрям:</span>
      <span class="info-value">${shipment.routeFrom || "CN"} ${shipment.routeTo || "UA"}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Отримано:</span>
      <span class="info-value">${formatDate(shipment.receivedAtWarehouse)}</span>
    </div>
  </div>

  <div class="info-row">
    <div class="info-item">
      <span class="info-label">Маркування:</span>
      <span class="info-value">${shipment.cargoLabel || ""}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Відправлено:</span>
      <span class="info-value">${formatDate(shipment.sentAt)}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Доставлено:</span>
      <span class="info-value">${formatDate(shipment.deliveredAt)}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th rowspan="2">№ Місця</th>
        <th rowspan="2">Трек номер</th>
        <th rowspan="2">Опис</th>
        <th rowspan="2">Кількість ШТ</th>
        <th colspan="3">Страхування</th>
        <th rowspan="2">Вага KG</th>
        <th rowspan="2">об'єм м3</th>
        <th rowspan="2">Щільність</th>
        <th rowspan="2">Тариф кг/м3</th>
        <th rowspan="2">Вартість</th>
      </tr>
      <tr>
        <th>Сума</th>
        <th>%</th>
        <th>Вартість</th>
      </tr>
    </thead>
    <tbody>
      ${shipment.items.map((item: (typeof shipment.items)[number]) => {
        const insuranceValue = item.insuranceValue ? Number(item.insuranceValue) : 0;
        const insurancePercent = item.insurancePercent || 0;
        const insuranceCost = item.insuranceCost ? Number(item.insuranceCost) : 0;
        const weight = item.weightKg ? Number(item.weightKg) : 0;
        const volume = item.volumeM3 ? Number(item.volumeM3) : 0;
        const deliveryCost = item.deliveryCost ? Number(item.deliveryCost) : 0;
        const density = weight > 0 && volume > 0 ? weight / volume : 0;
        const tariff = item.tariffValue ? Number(item.tariffValue) : 0;

        return `
          <tr>
            <td class="center">${item.placeNumber || ""}</td>
            <td class="left">${formatTrackNumber(item.trackNumber)}</td>
            <td class="left">${item.description || ""}</td>
            <td class="center">${item.quantity || ""}</td>
            <td>${insuranceValue > 0 ? insuranceValue.toFixed(2).replace(".", ",") : ""}</td>
            <td class="center">${insurancePercent > 0 ? `${insurancePercent}%` : ""}</td>
            <td>${insuranceCost > 0 ? insuranceCost.toFixed(2).replace(".", ",") : ""}</td>
            <td>${weight > 0 ? weight.toFixed(2).replace(".", ",") : ""}</td>
            <td>${volume > 0 ? volume.toFixed(4).replace(".", ",") : ""}</td>
            <td>${density > 0 ? density.toFixed(2).replace(".", ",") : ""}</td>
            <td>${tariff > 0 ? tariff.toFixed(2).replace(".", ",") : ""}</td>
            <td>${deliveryCost > 0 ? deliveryCost.toFixed(2).replace(".", ",") : ""}</td>
          </tr>
        `;
      }).join("")}
      <tr class="total-row">
        <td class="center">${shipment.items.length}</td>
        <td class="left">${formatTrackNumber(shipment.internalTrack)}</td>
        <td></td>
        <td></td>
        <td>${totalInsuranceValue > 0 ? totalInsuranceValue.toFixed(2).replace(".", ",") : ""}</td>
        <td></td>
        <td>${totalInsuranceCost > 0 ? totalInsuranceCost.toFixed(2).replace(".", ",") : ""}</td>
        <td>${totalWeight > 0 ? totalWeight.toFixed(2).replace(".", ",") : ""}</td>
        <td>${totalVolume > 0 ? totalVolume.toFixed(5).replace(".", ",") : ""}</td>
        <td>${avgDensity > 0 ? avgDensity.toFixed(2).replace(".", ",") : ""}</td>
        <td>${avgTariff > 0 ? avgTariff.toFixed(2).replace(".", ",") : ""}</td>
        <td>${totalDeliveryCost > 0 ? totalDeliveryCost.toFixed(2).replace(".", ",") : ""}</td>
      </tr>
    </tbody>
  </table>

  <table class="services-table">
    <thead>
      <tr>
        <th>Послуга</th>
        <th>Сума (USD)</th>
      </tr>
    </thead>
    <tbody>
      ${totalDeliveryCost > 0 ? `
      <tr>
        <td>Вартість доставки</td>
        <td>${totalDeliveryCost.toFixed(2).replace(".", ",")}</td>
      </tr>
      ` : ""}
      ${packingCost > 0 ? `
      <tr>
        <td>Вартість пакування</td>
        <td>${packingCost.toFixed(2).replace(".", ",")}</td>
      </tr>
      ` : ""}
      ${localDeliveryCost > 0 ? `
      <tr>
        <td>Вартість локальної доставки</td>
        <td>${localDeliveryCost.toFixed(2).replace(".", ",")}</td>
      </tr>
      ` : ""}
      ${totalInsuranceCost > 0 ? `
      <tr>
        <td>Вартість страхування</td>
        <td>${totalInsuranceCost.toFixed(2).replace(".", ",")}</td>
      </tr>
      ` : ""}
    </tbody>
  </table>

  <div class="summary">
    <table class="summary-table">
      <tr>
        <td class="label">Загалом (USD):</td>
        <td class="value">${totalCost.toFixed(2).replace(".", ",")} USD</td>
      </tr>
      <tr>
        <td class="label">Баланс клієнта:</td>
        <td class="value">0,00 USD</td>
      </tr>
      <tr>
        <td class="label">Код клієнта:</td>
        <td class="value">${shipment.user.clientCode}</td>
      </tr>
    </table>
  </div>

  <div class="summary-total">Загалом до сплати (USD): ${totalCost.toFixed(2).replace(".", ",")} USD</div>
</body>
</html>
    `;

    // Try to generate PDF using puppeteer
    try {
      const puppeteer = await import("puppeteer");
      
      // Determine executable path
      let executablePath: string | undefined;
      const customPath = process.env.PUPPETEER_EXECUTABLE_PATH;
      
      if (customPath) {
        // Check if custom path exists
        if (fs.existsSync(customPath)) {
          executablePath = customPath;
        } else {
          console.warn(`Custom Puppeteer executable path not found: ${customPath}, using bundled Chromium`);
        }
      } else {
        // Try common paths
        const commonPaths = [
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium',
          '/usr/bin/google-chrome',
          '/usr/bin/google-chrome-stable',
        ];
        
        for (const path of commonPaths) {
          if (fs.existsSync(path)) {
            executablePath = path;
            break;
          }
        }
        
        // If no path found, use bundled Chromium (puppeteer will handle it)
        if (!executablePath) {
          console.log("No system Chromium found, using Puppeteer's bundled Chromium");
        }
      }
      
      const launchOptions: any = {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
        ],
        timeout: 60000, // 60 seconds timeout for server environments
      };
      
      // Only set executablePath if we found one
      if (executablePath) {
        launchOptions.executablePath = executablePath;
      }
      
      const browser = await puppeteer.launch(launchOptions);

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: "A4",
        landscape: true,
        margin: {
          top: "0.5cm",
          right: "0.5cm",
          bottom: "0.5cm",
          left: "0.5cm",
        },
        printBackground: true,
      });

      await browser.close();

      // Validate that pdfBuffer exists
      if (!pdfBuffer) {
        console.error("PDF generation failed: No buffer returned from puppeteer");
        return NextResponse.json(
          { 
            error: "PDF generation failed",
            message: "No PDF buffer returned",
            details: "The PDF generation process did not return any data"
          },
          { status: 500 }
        );
      }

      // Convert to Buffer if it's not already (puppeteer may return Uint8Array or Buffer)
      let buffer: Buffer;
      if (Buffer.isBuffer(pdfBuffer)) {
        buffer = pdfBuffer;
      } else {
        // Try to convert to Buffer (handles Uint8Array, Array, etc.)
        try {
          buffer = Buffer.from(pdfBuffer as any);
        } catch (e: any) {
          console.error("PDF generation failed: Cannot convert to Buffer", typeof pdfBuffer, e?.message);
          return NextResponse.json(
            { 
              error: "PDF generation failed",
              message: "Invalid buffer type returned",
              details: `Cannot convert ${typeof pdfBuffer} to Buffer: ${e?.message || 'Unknown error'}`
            },
            { status: 500 }
          );
        }
      }

      // Validate buffer has content
      if (buffer.length === 0) {
        console.error("PDF generation failed: Empty buffer returned");
        return NextResponse.json(
          { 
            error: "PDF generation failed",
            message: "Empty PDF buffer returned",
            details: "The PDF generation process returned an empty buffer"
          },
          { status: 500 }
        );
      }

      // Validate PDF signature (PDF files start with %PDF)
      const pdfSignature = buffer.slice(0, 4).toString('ascii');
      if (pdfSignature !== "%PDF") {
        console.error("PDF generation failed: Invalid PDF signature", pdfSignature, "Buffer length:", buffer.length);
        return NextResponse.json(
          { 
            error: "PDF generation failed",
            message: "Invalid PDF file generated",
            details: `The generated file does not appear to be a valid PDF. Signature: ${pdfSignature}`
          },
          { status: 500 }
        );
      }

      // Sanitize filename to ASCII only (remove non-ASCII characters)
      const sanitizedInvoiceNumber = invoice.invoiceNumber.replace(/[^\x00-\x7F]/g, "");
      const dateStr = new Date().toISOString().split("T")[0];
      const filename = `invoice_${sanitizedInvoiceNumber}_${dateStr}.pdf`;
      
      // Use RFC 5987 encoding for filename with non-ASCII characters
      const encodedFilename = encodeURIComponent(filename);
      const asciiFilename = filename; // ASCII-only version

      // Return PDF file as binary
      // Convert Buffer to Uint8Array for NextResponse compatibility
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`,
          "Content-Length": buffer.length.toString(),
        },
      });
    } catch (puppeteerError: any) {
      // If puppeteer is not available, return error
      console.error("Puppeteer error:", puppeteerError);
      
      // Return error message if puppeteer is not installed
      if (puppeteerError.code === "MODULE_NOT_FOUND" || puppeteerError.message?.includes("Cannot find module")) {
        return NextResponse.json(
          { 
            error: "PDF generation requires puppeteer package",
            message: "Please install puppeteer: npm install puppeteer",
            details: "For API usage, puppeteer must be installed to generate PDF files"
          },
          { status: 503 }
        );
      }

      // Check for missing Chromium dependencies (common on Ubuntu servers)
      if (
        puppeteerError.message?.includes("Executable doesn't exist") ||
        puppeteerError.message?.includes("No usable sandbox") ||
        puppeteerError.message?.includes("Could not find Chrome") ||
        puppeteerError.message?.includes("Failed to launch")
      ) {
        return NextResponse.json(
          { 
            error: "PDF generation failed - Chromium dependencies missing",
            message: "Chromium browser dependencies are not installed on the server",
            details: "On Ubuntu/Debian servers, install dependencies: sudo apt-get install -y chromium-browser chromium-chromedriver || sudo apt-get install -y google-chrome-stable",
            serverError: puppeteerError.message
          },
          { status: 503 }
        );
      }

      // Other puppeteer errors - return JSON error, never HTML
      return NextResponse.json(
        { 
          error: "PDF generation failed",
          message: puppeteerError.message || "Unknown error during PDF generation",
          details: "An error occurred while generating the PDF file. Please try again later.",
          serverError: puppeteerError.stack || puppeteerError.toString()
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error generating PDF invoice:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to get logo as base64
async function getLogoBase64(): Promise<string> {
  try {
    const logoPath = path.join(process.cwd(), "public", "білий на бірюзовому@2x.png");
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      return logoBuffer.toString("base64");
    }
  } catch (error) {
    console.error("Error loading logo:", error);
  }
  return "";
}

