"use client";

import { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  Package,
  Calendar,
  Image,
  Trophy,
  Loader2,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";

type Stats = {
  totalUsers: number;
  totalMembers: number;
  totalOrders: number;
  totalProducts: number;
  totalEvents: number;
  totalGallery: number;
  totalAchievements: number;
  pendingOrders: number;
  pendingMembers: number;
  totalRevenue: number;
  recentOrders: {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
    items: { product: { name: string } }[];
  }[];
  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  PROCESSING: "bg-blue-500/10 text-blue-500",
  SHIPPED: "bg-purple-500/10 text-purple-500",
  DELIVERED: "bg-green-500/10 text-green-500",
  CANCELLED: "bg-red-500/10 text-red-500",
};

const ROLE_COLORS: Record<string, string> = {
  USER: "bg-accent text-muted-foreground",
  MEMBER: "bg-amber-400/10 text-amber-500",
  ADMIN: "bg-red-500/10 text-red-500",
  PLAYER: "bg-blue-500/10 text-blue-500",
  COACH: "bg-purple-500/10 text-purple-500",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.error) throw new Error();
        setStats(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-amber-400" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-semibold text-foreground">
          Failed to load dashboard
        </p>
        <p className="text-sm text-muted-foreground">
          Make sure you are logged in as an admin.
        </p>
      </div>
    );
  }

  const recentOrders = stats.recentOrders ?? [];
  const recentUsers = stats.recentUsers ?? [];

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Savar CF admin panel
        </p>
      </div>

      {/* ALERT BANNERS */}
      <div className="mb-8 flex flex-col gap-3">
        {(stats.pendingMembers ?? 0) > 0 && (
          <Link
            href="/admin/members"
            className="flex items-center justify-between rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-5 py-4 transition hover:bg-yellow-500/10"
          >
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-yellow-500" />
              <p className="text-sm font-semibold text-yellow-500">
                {stats.pendingMembers} membership{" "}
                {stats.pendingMembers === 1 ? "application" : "applications"}{" "}
                pending approval
              </p>
            </div>
            <span className="text-xs text-yellow-500">Review →</span>
          </Link>
        )}
        {(stats.pendingOrders ?? 0) > 0 && (
          <Link
            href="/admin/orders"
            className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 transition hover:bg-amber-500/10"
          >
            <div className="flex items-center gap-3">
              <Package size={16} className="text-amber-500" />
              <p className="text-sm font-semibold text-amber-500">
                {stats.pendingOrders} order
                {stats.pendingOrders === 1 ? "" : "s"} pending processing
              </p>
            </div>
            <span className="text-xs text-amber-500">Review →</span>
          </Link>
        )}
      </div>

      {/* MAIN STATS */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Total Revenue",
            value: `৳${(stats.totalRevenue ?? 0).toLocaleString()}`,
            icon: TrendingUp,
            color: "text-amber-500",
            href: "/admin/orders",
          },
          {
            label: "Active Members",
            value: stats.totalMembers ?? 0,
            icon: Users,
            color: "text-green-500",
            href: "/admin/members",
          },
          {
            label: "Total Orders",
            value: stats.totalOrders ?? 0,
            icon: Package,
            color: "text-blue-500",
            href: "/admin/orders",
          },
          {
            label: "Total Users",
            value: stats.totalUsers ?? 0,
            icon: Users,
            color: "text-purple-500",
            href: "/admin/users",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-border bg-card p-5 transition hover:border-amber-500/30"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className={`text-3xl font-black ${stat.color}`}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* SECONDARY STATS */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Products",
            value: stats.totalProducts ?? 0,
            icon: ShoppingBag,
            href: "/admin/products",
          },
          {
            label: "Events",
            value: stats.totalEvents ?? 0,
            icon: Calendar,
            href: "/admin/events",
          },
          {
            label: "Gallery",
            value: stats.totalGallery ?? 0,
            icon: Image,
            href: "/admin/gallery",
          },
          {
            label: "Achievements",
            value: stats.totalAchievements ?? 0,
            icon: Trophy,
            href: "/admin/achievements",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-border bg-card p-5 transition hover:border-amber-500/30"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon size={16} className="text-muted-foreground" />
            </div>
            <p className="text-3xl font-black text-foreground">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        {/* RECENT ORDERS */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-black text-foreground">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-amber-500 hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {order.user?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(order.items ?? [])
                        .map((i) => i.product?.name)
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-500">
                      ৳{(order.totalAmount ?? 0).toLocaleString()}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_COLORS[order.status] ?? ""
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECENT USERS */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-black text-foreground">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-xs text-amber-500 hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-black">
                      {user.name?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      ROLE_COLORS[user.role] ?? ""
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}