import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get site settings
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get or create site settings (there should be only one)
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {},
      });
    }

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update site settings
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { managerLinkUa, managerLinkRu, managerLinkEn } = body;

    // Get or create site settings
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          managerLinkUa: managerLinkUa || null,
          managerLinkRu: managerLinkRu || null,
          managerLinkEn: managerLinkEn || null,
        },
      });
    } else {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          managerLinkUa: managerLinkUa !== undefined ? managerLinkUa : settings.managerLinkUa,
          managerLinkRu: managerLinkRu !== undefined ? managerLinkRu : settings.managerLinkRu,
          managerLinkEn: managerLinkEn !== undefined ? managerLinkEn : settings.managerLinkEn,
        },
      });
    }

    // Log action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "UPDATE_SITE_SETTINGS",
        targetType: "SITE_SETTINGS",
        targetId: settings.id,
        description: "Updated site settings",
      },
    });

    return NextResponse.json(
      { message: "Site settings updated successfully", settings },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating site settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

