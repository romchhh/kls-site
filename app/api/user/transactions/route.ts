import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error loading user transactions", error);
    return NextResponse.json(
      { error: "Failed to load transactions" },
      { status: 500 },
    );
  }
}


