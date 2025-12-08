import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get next batch ID
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all batches and find the highest numeric batchId
    const allBatches = await (prisma as any).batch.findMany({
      select: { batchId: true },
      orderBy: { createdAt: "desc" },
    });

    let nextNumber = 1;
    if (allBatches.length > 0) {
      // Find the maximum numeric batchId
      const numericBatchIds = allBatches
        .map((b: any) => {
          const num = parseInt(b.batchId, 10);
          return isNaN(num) ? 0 : num;
        })
        .filter((n: number) => n > 0);
      
      if (numericBatchIds.length > 0) {
        nextNumber = Math.max(...numericBatchIds) + 1;
      }
    }

    // Format as XXXXXX (6 digits with leading zeros)
    const nextBatchId = String(nextNumber).padStart(6, "0");

    return NextResponse.json({ nextBatchId }, { status: 200 });
  } catch (error: any) {
    console.error("Error getting next batch ID:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

