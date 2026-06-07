import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, startDate, endDate } = body;

    const membership = await prisma.membership.update({
      where: { id: params.id },
      data: {
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    // if activated update user role to MEMBER
    if (status === "ACTIVE") {
      await prisma.user.update({
        where: { id: membership.user.id },
        data: { role: "MEMBER" },
      });
    }

    // if cancelled or expired revert role to USER
    if (status === "CANCELLED" || status === "EXPIRED") {
      await prisma.user.update({
        where: { id: membership.user.id },
        data: { role: "USER" },
      });
    }

    return NextResponse.json(membership);
  } catch {
    return NextResponse.json(
      { error: "Failed to update membership" },
      { status: 500 }
    );
  }
}

// record a payment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, method, reference, periodStart, periodEnd } = body;

    const payment = await prisma.membershipPayment.create({
      data: {
        membershipId: params.id,
        amount,
        method,
        reference,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}