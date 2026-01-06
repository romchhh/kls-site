import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizePath, logSecurityEvent } from "@/lib/security";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join("/");

    // Security: Only allow files from uploads directory
    if (!filePath.startsWith("uploads/")) {
      await logSecurityEvent("PATH_TRAVERSAL_ATTEMPT", { filePath }, request);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Sanitize path to prevent path traversal
    const sanitized = sanitizePath(filePath);
    if (!sanitized || sanitized !== filePath) {
      await logSecurityEvent("PATH_TRAVERSAL_ATTEMPT", { filePath, sanitized }, request);
      return NextResponse.json({ error: "Invalid file path" }, { status: 403 });
    }

    // Check authentication for sensitive files
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fullPath = path.join(process.cwd(), "public", sanitized);
    
    // Additional security: ensure path is within public/uploads
    const resolvedPath = path.resolve(fullPath);
    const publicPath = path.resolve(process.cwd(), "public");
    if (!resolvedPath.startsWith(publicPath)) {
      await logSecurityEvent("PATH_TRAVERSAL_ATTEMPT", { resolvedPath, publicPath }, request);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read file
    const fileBuffer = await fs.readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();

    // Determine content type
    const contentTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".bmp": "image/bmp",
      ".svg": "image/svg+xml",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";
    const fileName = path.basename(fullPath);

    // For PDF files, use attachment to force download, especially on mobile
    const isPDF = ext === ".pdf";
    const contentDisposition = isPDF 
      ? `attachment; filename="${fileName}"` 
      : `inline; filename="${fileName}"`;

    // Return file with proper headers
    // Use no-cache for newly uploaded files to ensure they're visible immediately
    // After first load, browser can cache them
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Cache-Control": "public, max-age=3600, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}

