"use client";

import { useEffect, useState } from "react";
import { Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

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
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  PROCESSING: "bg-blue-500/10 text-blue-500",
  SHIPPED: "bg-purple-500/10 text-purple-500",
  DELIVERED: "bg-green-500/10 text-green-500",
  CANCELLED: "bg-red-500/10 text-red-500",
};

const STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanding, setExpanding] = useState<string | null>(null);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    status: OrderStatus
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      {/* ORDERS */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-amber-400" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package size={48} className="mb-4 text-muted-foreground/20" />
          <p className="font-semibold text-foreground">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders will appear here when customers place them
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              {/* ORDER HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-foreground">
                        {order.user.name}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          STATUS_COLORS[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.user.email} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {order.phone && (
                      <p className="text-xs text-muted-foreground">
                        📞 {order.phone}
                      </p>
                    )}
                    {order.address && (
                      <p className="text-xs text-muted-foreground">
                        📍 {order.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-lg font-black text-amber-500">
                    ৳{order.totalAmount.toLocaleString()}
                  </p>

                  {/* STATUS SELECTOR */}
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value as OrderStatus
                      )
                    }
                    className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {/* EXPAND TOGGLE */}
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

              {/* ORDER ITEMS */}
              {expanding === order.id && (
                <div className="border-t border-border bg-background p-5">
                  {order.notes && (
                    <p className="mb-4 text-sm text-muted-foreground">
                      📝 Note: {order.notes}
                    </p>
                  )}
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
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}