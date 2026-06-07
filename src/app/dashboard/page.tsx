"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ShoppingBag,
  Star,
  Loader2,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

type Membership = {
  id: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
  startDate: string | null;
  endDate: string | null;
  monthlyFee: number;
};

type Order = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    product: { name: string };
  }[];
};

type EventReg = {
  id: string;
  registeredAt: string;
  event: {
    id: string;
    title: string;
    startDate: string;
    location: string;
    type: string;
  };
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-500",
  PROCESSING: "text-blue-500",
  SHIPPED: "text-purple-500",
  DELIVERED: "text-green-500",
  CANCELLED: "text-red-500",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [membership, setMembership] = useState<Membership | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<EventReg[]>([]);
  const [loading, setLoading] = useState(true);

  const user = session?.user as any;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchAll();
    }
  }, [status]);

  const fetchAll = async () => {
    try {
      const [membershipRes, ordersRes] = await Promise.all([
        fetch("/api/membership"),
        fetch("/api/orders"),
      ]);

      const membershipData = await membershipRes.json();
      const ordersData = await ordersRes.json();

      setMembership(membershipData);
      setOrders(ordersData.slice(0, 5));
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 size={32} className="animate-spin text-amber-400" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-36 md:px-16">

        {/* HEADER */}
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
            Member Dashboard
          </p>
          <h1 className="text-4xl font-black md:text-5xl">
            Welcome back,{" "}
            <span className="text-amber-400">
              {user?.name?.split(" ")[0]}
            </span>
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 lg:col-span-2">

            {/* MEMBERSHIP STATUS */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-black text-foreground text-lg">
                  Membership
                </h2>
                <Link
                  href="/membership"
                  className="text-xs text-amber-500 hover:underline"
                >
                  View details →
                </Link>
              </div>

              {!membership ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <Star
                    size={32}
                    className="mb-3 text-muted-foreground/20"
                  />
                  <p className="font-semibold text-foreground mb-1">
                    Not a member yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join Savar CF for ৳200/month
                  </p>
                  <Link
                    href="/membership"
                    className="rounded-full bg-amber-400 px-6 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
                  >
                    Become a Member
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {membership.status === "ACTIVE" ? (
                        <CheckCircle
                          size={16}
                          className="text-green-500"
                        />
                      ) : (
                        <Clock
                          size={16}
                          className="text-yellow-500"
                        />
                      )}
                      <p className="font-semibold text-foreground">
                        {membership.status === "ACTIVE"
                          ? "Active Member"
                          : membership.status === "PENDING"
                          ? "Pending Approval"
                          : membership.status}
                      </p>
                    </div>
                    {membership.startDate && (
                      <p className="text-sm text-muted-foreground">
                        Since{" "}
                        {new Date(membership.startDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    )}
                  </div>
                  <p className="text-2xl font-black text-amber-400">
                    ৳{membership.monthlyFee}
                    <span className="text-sm font-normal text-muted-foreground">
                      /mo
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* RECENT ORDERS */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-black text-foreground text-lg">
                  Recent Orders
                </h2>
                <Link
                  href="/dashboard/orders"
                  className="text-xs text-amber-500 hover:underline"
                >
                  View all →
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <ShoppingBag
                    size={32}
                    className="mb-3 text-muted-foreground/20"
                  />
                  <p className="font-semibold text-foreground mb-1">
                    No orders yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check out the official shop
                  </p>
                  <Link
                    href="/shop"
                    className="rounded-full bg-amber-400 px-6 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-xl border border-border p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {order.items
                            .map((i) => i.product.name)
                            .join(", ")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-500">
                          ৳{order.totalAmount.toLocaleString()}
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            STATUS_COLORS[order.status]
                          }`}
                        >
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* QUICK LINKS */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 font-black text-foreground text-lg">
                Quick Links
              </h2>
              <div className="flex flex-col gap-2">
                {[
                  { href: "/events", label: "View Events", icon: Calendar },
                  { href: "/shop", label: "Browse Shop", icon: ShoppingBag },
                  { href: "/membership", label: "My Membership", icon: Star },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium text-foreground transition hover:bg-accent"
                  >
                    <Icon size={16} className="text-amber-500" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* PROFILE */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 font-black text-foreground text-lg">
                Profile
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-2xl font-black text-black">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}