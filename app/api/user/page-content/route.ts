import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get page content for users
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get("pageKey");
    const locale = searchParams.get("locale") || "ua";

    if (!pageKey) {
      return NextResponse.json(
        { error: "pageKey is required" },
        { status: 400 }
      );
    }

    const content = await prisma.pageContent.findUnique({
      where: { pageKey },
    });

    if (!content) {
      return NextResponse.json(
        { content: null },
        { status: 200 }
      );
    }

    // Return content based on locale
    let contentText = null;
    if (locale === "ua") {
      contentText = content.contentUa;
    } else if (locale === "ru") {
      contentText = content.contentRu;
    } else if (locale === "en") {
      contentText = content.contentEn;
    }

    // Fallback to UA if locale content is not available
    if (!contentText) {
      contentText = content.contentUa;
    }

    return NextResponse.json({ content: contentText }, { status: 200 });
  } catch (error) {
    console.error("Error fetching page content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

