import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [incomeAgg, expenseAgg] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: "income" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: "expense" },
        _sum: { amount: true },
      }),
    ]);

    const zero = new Prisma.Decimal(0);

    const income = incomeAgg._sum.amount ?? zero;
    const expense = expenseAgg._sum.amount ?? zero;

    const balance = income.minus(expense);

    return NextResponse.json({
      balance: balance.toNumber(),
      incomeTotal: income.toNumber(),
      expenseTotal: expense.toNumber(),
      currency: "USD",
    });
  } catch (error) {
    console.error("Error loading user balance", error);
    return NextResponse.json(
      { error: "Failed to load balance" },
      { status: 500 },
    );
  }
}


