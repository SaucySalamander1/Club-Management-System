import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = session.user as any;

  if (user.role !== "MEMBER" && user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only members can register for events" },
      { status: 403 }
    );
  }

  try {
    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (
      event.capacity &&
      event._count.registrations >= event.capacity
    ) {
      return NextResponse.json(
        { error: "Event is full" },
        { status: 400 }
      );
    }

    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
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

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: id,
        userId: user.id,
      },
    });

    return NextResponse.json(registration, {
      status: 201,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to register for event",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = session.user as any;

  try {
    await prisma.eventRegistration.delete({
      where: {
        eventId_userId: {
          eventId: id,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("UNREGISTER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to unregister from event",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}