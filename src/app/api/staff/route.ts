import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const staff = await prisma.clubStaff.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(staff);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch staff" },
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
    const { name, title, bio, imageUrl, order } = body;

    if (!name || !title) {
      return NextResponse.json(
        { error: "Name and title are required" },
        { status: 400 }
      );
    }

    const staff = await prisma.clubStaff.create({
      data: {
        name,
        title,
        bio,
        imageUrl,
        order: order ? parseInt(order) : 0,
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create staff" },
      { status: 500 }
    );
  }
}