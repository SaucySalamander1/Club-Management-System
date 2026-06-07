import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(achievements);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
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
    const { title, description, type, imageUrl, date, featured } = body;

    if (!title || !date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 }
      );
    }

    const achievement = await prisma.achievement.create({
      data: {
        title,
        description,
        type: type ?? "OTHER",
        imageUrl,
        date: new Date(date),
        featured: featured ?? false,
      },
    });

    return NextResponse.json(achievement, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}