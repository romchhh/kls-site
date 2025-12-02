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

    // Check if file has arrayBuffer method (works for both File and Blob)
    if (typeof (file as any).arrayBuffer !== "function") {
      return NextResponse.json({ error: "Invalid file format" }, { status: 400 });
    }

    const bytes = await (file as any).arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "shipments");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Get file name - handle both File and Blob types
    const fileName = (file as any).name || `file-${Date.now()}`;
    const ext = fileName.split(".").pop() || "jpg";
    const generatedFileName = `${crypto.randomBytes(16).toString("hex")}.${ext}`;
    const filePath = path.join(uploadsDir, generatedFileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/shipments/${generatedFileName}`;

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}


