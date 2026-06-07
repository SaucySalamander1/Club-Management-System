"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type OrderItem = {
  id: string;
  quantity: number;
  size: string | null;
  price: number;
  product: {
    name: string;
    imageUrl: string | null;
  };
};

type Order = {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  phone: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  PROCESSING: "bg-blue-500/10 text-blue-500",
  SHIPPED: "bg-purple-500/10 text-purple-500",
  DELIVERED: "bg-green-500/10 text-green-500",
  CANCELLED: "bg-red-500/10 text-red-500",
};

const STATUS_STEPS: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanding, setExpanding] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
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
      <div className="mx-auto max-w-4xl px-6 py-36 md:px-16">

        {/* HEADER */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="mb-4 inline-block text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← Back to dashboard
          </Link>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
            My Orders
          </p>
          <h1 className="text-4xl font-black">Order History</h1>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={64} className="mb-6 text-muted-foreground/20" />
            <h2 className="mb-2 text-xl font-black text-foreground">
              No orders yet
            </h2>
            <p className="mb-8 text-muted-foreground">
              Your orders will appear here once you place them.
            </p>
            <Link
              href="/shop"
              className="rounded-full bg-amber-400 px-8 py-3.5 font-semibold text-black transition hover:bg-amber-300"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                {/* ORDER HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          STATUS_COLORS[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                    {order.address && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        📍 {order.address}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-lg font-black text-amber-500">
                      ৳{order.totalAmount.toLocaleString()}
                    </p>
                    <button
                      onClick={() =>
                        setExpanding(
                          expanding === order.id ? null : order.id
                        )
                      }
                      className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent"
                    >
                      {expanding === order.id ? "Hide" : "View"} items
                    </button>
                  </div>
                </div>

                {/* ORDER PROGRESS */}
                {order.status !== "CANCELLED" && (
                  <div className="px-5 pb-4">
                    <div className="flex items-center gap-0">
                      {STATUS_STEPS.map((step, i) => {
                        const currentIndex = STATUS_STEPS.indexOf(
                          order.status as any
                        );
                        const isCompleted = i <= currentIndex;
                        const isLast = i === STATUS_STEPS.length - 1;

                        return (
                          <div
                            key={step}
                            className="flex flex-1 items-center"
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`h-2.5 w-2.5 rounded-full transition ${
                                  isCompleted
                                    ? "bg-amber-400"
                                    : "bg-border"
                                }`}
                              />
                              <p
                                className={`mt-1 text-[10px] font-medium ${
                                  isCompleted
                                    ? "text-amber-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {step}
                              </p>
                            </div>
                            {!isLast && (
                              <div
                                className={`h-px flex-1 transition ${
                                  i < currentIndex
                                    ? "bg-amber-400"
                                    : "bg-border"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ORDER ITEMS */}
                {expanding === order.id && (
                  <div className="border-t border-border bg-background p-5">
                    <div className="flex flex-col gap-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-accent">
                            {item.product.imageUrl ? (
                              <Image
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ShoppingBag
                                  size={16}
                                  className="text-muted-foreground/20"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                              {item.size && ` · Size: ${item.size}`}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-amber-500">
                            ৳
                            {(
                              item.price * item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        📝 {order.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}