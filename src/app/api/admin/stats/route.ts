import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalUsers,
      totalMembers,
      totalOrders,
      totalProducts,
      totalEvents,
      totalGallery,
      totalAchievements,
      pendingOrders,
      pendingMembers,
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.membership.count({ where: { status: "ACTIVE" } }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.event.count(),
      prisma.gallery.count(),
      prisma.achievement.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.membership.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    // total revenue
    const revenueData = await prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { totalAmount: true },
    });

    return NextResponse.json({
      totalUsers,
      totalMembers,
      totalOrders,
      totalProducts,
      totalEvents,
      totalGallery,
      totalAchievements,
      pendingOrders,
      pendingMembers,
      totalRevenue: revenueData._sum.totalAmount ?? 0,
      recentOrders,
      recentUsers,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}