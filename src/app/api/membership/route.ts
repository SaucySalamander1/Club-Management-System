import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  try {
    const membership = await prisma.membership.findUnique({
      where: { userId: user.id },
      include: {
        payments: {
          orderBy: { paidAt: "desc" },
          take: 5,
        },
      },
    });

    return NextResponse.json(membership);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch membership" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  try {
    // check if already has membership
    const existing = await prisma.membership.findUnique({
      where: { userId: user.id },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Membership already exists" },
        { status: 400 }
      );
    }

    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        status: "PENDING",
        monthlyFee: 200,
        currency: "BDT",
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create membership" },
      { status: 500 }
    );
  }
}