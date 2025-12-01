import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get page content
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get("pageKey");

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

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error("Error fetching page content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update or create page content
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
    const { pageKey, contentUa, contentRu, contentEn } = body;

    if (!pageKey) {
      return NextResponse.json(
        { error: "pageKey is required" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: {
      contentUa?: string | null;
      contentRu?: string | null;
      contentEn?: string | null;
    } = {};
    
    if (contentUa !== undefined) {
      updateData.contentUa = contentUa || null;
    }
    if (contentRu !== undefined) {
      updateData.contentRu = contentRu || null;
    }
    if (contentEn !== undefined) {
      updateData.contentEn = contentEn || null;
    }

    // Upsert page content
    const content = await prisma.pageContent.upsert({
      where: { pageKey },
      update: updateData,
      create: {
        pageKey,
        contentUa: contentUa || null,
        contentRu: contentRu || null,
        contentEn: contentEn || null,
      },
    });

    // Log action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "UPDATE_PAGE_CONTENT",
        targetType: "PAGE_CONTENT",
        targetId: content.id,
        description: `Updated page content: ${pageKey}`,
      },
    });

    return NextResponse.json(
      { message: "Page content updated successfully", content },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating page content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

