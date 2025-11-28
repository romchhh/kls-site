import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      // кешуємо на 5 хвилин
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch rates");
    }

    const data = await res.json();

    const usdToUah = data?.rates?.UAH;
    const eurRate = data?.rates?.EUR;

    if (!usdToUah || !eurRate) {
      throw new Error("Missing rates in provider response");
    }

    // 1 EUR в UAH
    const eurToUah = usdToUah / eurRate;

    // Робимо невеликий спред для купівлі/продажу
    const makePair = (mid: number) => ({
      buy: Number((mid - 0.1).toFixed(2)),
      sell: Number((mid + 0.1).toFixed(2)),
    });

    const result = {
      base: "USD",
      timestamp: Date.now(),
      usdUah: makePair(usdToUah),
      eurUah: makePair(eurToUah),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching FX rates", error);
    return NextResponse.json(
      { error: "Unable to fetch rates" },
      { status: 500 },
    );
  }
}


