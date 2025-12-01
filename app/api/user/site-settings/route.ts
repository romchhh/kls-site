import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get site settings for users
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "ua";

    // Get site settings (handle case where table doesn't exist yet)
    let settings = null;
    try {
      settings = await prisma.siteSettings.findFirst();
    } catch (error: any) {
      // If table doesn't exist, return null
      if (error.code === "P2021" || error.code === "P2001") {
        return NextResponse.json(
          { managerLink: null },
          { status: 200 }
        );
      }
      throw error;
    }

    if (!settings) {
      return NextResponse.json(
        { managerLink: null },
        { status: 200 }
      );
    }

    // Return manager link based on locale
    let managerLink = null;
    if (locale === "ua") {
      managerLink = settings.managerLinkUa;
    } else if (locale === "ru") {
      managerLink = settings.managerLinkRu;
    } else if (locale === "en") {
      managerLink = settings.managerLinkEn;
    }

    // Fallback to UA if locale link is not available
    if (!managerLink) {
      managerLink = settings.managerLinkUa;
    }

    return NextResponse.json({ managerLink }, { status: 200 });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

