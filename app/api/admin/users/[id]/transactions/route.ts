import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error loading admin user transactions", error);
    return NextResponse.json(
      { error: "Failed to load user transactions" },
      { status: 500 },
    );
  }
}


