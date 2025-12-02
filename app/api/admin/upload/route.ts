import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer - use stream() method which is more reliable in Node.js
    let buffer: Buffer;
    try {
      // Try using stream() first (works in Node.js 18+)
      if (typeof (file as any).stream === "function") {
        const stream = (file as any).stream();
        const chunks: Uint8Array[] = [];
        const reader = stream.getReader();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
          }
        }
        buffer = Buffer.concat(chunks);
      } else if (typeof (file as any).arrayBuffer === "function") {
        // Fallback to arrayBuffer if stream is not available
        const bytes = await (file as any).arrayBuffer();
        buffer = Buffer.from(bytes);
      } else {
        return NextResponse.json({ error: "Invalid file format - no stream or arrayBuffer method" }, { status: 400 });
      }
    } catch (error) {
      console.error("Error converting file to buffer:", error);
      return NextResponse.json({ error: "Failed to process file" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "shipments");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Get file name - handle both File and Blob types
    const fileName = (file as any).name || `file-${Date.now()}`;
    const ext = fileName.split(".").pop() || "jpg";
    const generatedFileName = `${crypto.randomBytes(16).toString("hex")}.${ext}`;
    const filePath = path.join(uploadsDir, generatedFileName);

    await fs.writeFile(filePath, buffer);

    // Verify file was written
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      console.error("File was not written correctly");
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
    }

    const publicUrl = `/uploads/shipments/${generatedFileName}`;
    
    console.log("File uploaded successfully:", {
      fileName: generatedFileName,
      size: stats.size,
      url: publicUrl,
      path: filePath
    });

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}


