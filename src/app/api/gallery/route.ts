import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const images = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(images);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, caption, imageUrl, category, featured, takenAt } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const image = await prisma.gallery.create({
      data: {
        title,
        caption,
        imageUrl,
        category: category ?? "OTHER",
        featured: featured ?? false,
        takenAt: takenAt ? new Date(takenAt) : null,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 }
    );
  }
}