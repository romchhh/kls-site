import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
    console.error("Error loading user balance (admin)", error);
    return NextResponse.json(
      { error: "Failed to load user balance" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;
    const body = await request.json();

    const { type, amount, description } = body as {
      type: "income" | "expense";
      amount: number | string;
      description?: string;
    };

    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 },
      );
    }

    const numericAmount = typeof amount === "string" ? Number(amount) : amount;

    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 },
      );
    }

    const tx = await prisma.transaction.create({
      data: {
        userId,
        type,
        amount: new Prisma.Decimal(numericAmount),
        description: description || null,
      },
    });

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
      transaction: tx,
      balance: balance.toNumber(),
      incomeTotal: income.toNumber(),
      expenseTotal: expense.toNumber(),
      currency: "USD",
    });
  } catch (error) {
    console.error("Error updating user balance (admin)", error);
    return NextResponse.json(
      { error: "Failed to update user balance" },
      { status: 500 },
    );
  }
}


