import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "asc" },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch events" },
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
    const {
      title,
      description,
      imageUrl,
      location,
      startDate,
      endDate,
      type,
      isPublic,
      capacity,
    } = body;

    if (!title || !location || !startDate || !type) {
      return NextResponse.json(
        { error: "Title, location, start date and type are required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        imageUrl,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        type,
        isPublic: isPublic ?? true,
        capacity: capacity ? parseInt(capacity) : null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}