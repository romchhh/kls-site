import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiToken } from "@/lib/api-auth";
import { Prisma } from "@prisma/client";
import { formatDecimalWithZero } from "@/lib/utils/api-formatting";

// GET - Get user finances (balance and transactions with running balance)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify Bearer token
    const tokenVerification = await verifyApiToken(req);
    if (!tokenVerification.valid) {
      return NextResponse.json(
        {
          error: tokenVerification.error || "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Get balance (income and expense totals)
    const [incomeAgg, expenseAgg] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId: id, type: "income" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId: id, type: "expense" },
        _sum: { amount: true },
      }),
    ]);

    const zero = new Prisma.Decimal(0);
    const income = incomeAgg._sum.amount ?? zero;
    const expense = expenseAgg._sum.amount ?? zero;
    const balance = income.minus(expense);

    // Get transactions ordered by creation date (ascending for running balance calculation)
    const transactions = await prisma.transaction.findMany({
      where: { userId: id },
      orderBy: { createdAt: "asc" },
    });

    // Calculate running balance for each transaction
    let runningBalance = new Prisma.Decimal(0);
    const transactionsWithBalance = transactions.map((tx) => {
      const amount = tx.amount;
      if (tx.type === "income") {
        runningBalance = runningBalance.add(amount);
      } else {
        runningBalance = runningBalance.sub(amount);
      }

      return {
        id: tx.id,
        type: tx.type,
        amount: formatDecimalWithZero(tx.amount),
        description: tx.description || null,
        createdAt: tx.createdAt.toISOString(),
        runningBalance: formatDecimalWithZero(runningBalance),
      };
    });

    return NextResponse.json(
      {
        balance: {
          available: formatDecimalWithZero(balance),
          incomeTotal: formatDecimalWithZero(income),
          expenseTotal: formatDecimalWithZero(expense),
          currency: "USD",
        },
        transactions: transactionsWithBalance,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching user finances:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}


