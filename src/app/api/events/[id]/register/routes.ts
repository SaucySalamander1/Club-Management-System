import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  // only members can register
  if (user.role !== "MEMBER" && user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only members can register for events" },
      { status: 403 }
    );
  }

  try {
    // check event exists
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // check capacity
    if (
      event.capacity &&
      event._count.registrations >= event.capacity
    ) {
      return NextResponse.json(
        { error: "Event is full" },
        { status: 400 }
      );
    }

    // check already registered
    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: params.id,
          userId: user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      );
    }

    // create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: params.id,
        userId: user.id,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  try {
    await prisma.eventRegistration.delete({
      where: {
        eventId_userId: {
          eventId: params.id,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to unregister from event" },
      { status: 500 }
    );
  }
}