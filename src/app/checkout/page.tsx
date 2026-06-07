"use client";

import { useCart } from "@/store/cart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: session?.user?.name ?? "",
    phone: "",
    address: "",
    notes: "",
  });

  const cartTotal = total();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please login to place an order");
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!form.phone || !form.address) {
      toast.error("Phone and address are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
          })),
          totalAmount: cartTotal,
          phone: form.phone,
          address: form.address,
          notes: form.notes,
        }),
      });

      if (!res.ok) throw new Error();

      clearCart();
      toast.success("Order placed successfully!");
      router.push("/checkout/success");
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <ShoppingBag size={64} className="mb-6 text-muted-foreground/20" />
          <h1 className="text-3xl font-black text-foreground mb-3">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some products before checking out.
          </p>
          <Link
            href="/shop"
            className="rounded-full bg-amber-400 px-8 py-3.5 font-semibold text-black transition hover:bg-amber-300"
          >
            Browse Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-36 md:px-16">

        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
          Checkout
        </p>
        <h1 className="mb-12 text-4xl font-black md:text-5xl">
          Complete Your Order
        </h1>

        <div className="grid gap-12 lg:grid-cols-2">

          {/* ORDER FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-bold text-foreground">
                Delivery Details
              </h2>

              <div className="flex flex-col gap-4">

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
                    placeholder="Your full name"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Delivery Address *
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    rows={3}
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none resize-none"
                    placeholder="House, Road, Area, District"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Order Notes
                  </label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
                    placeholder="Any special instructions (optional)"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT NOTE */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <p className="text-sm font-semibold text-amber-500 mb-1">
                💳 Payment on Delivery
              </p>
              <p className="text-sm text-muted-foreground">
                Pay with cash or bKash when your order arrives.
                Our team will contact you to confirm the order.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-full bg-amber-400 py-4 font-semibold text-black transition hover:bg-amber-300 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Place Order"
              )}
            </button>
          </form>

          {/* ORDER SUMMARY */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-bold text-foreground">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex items-center gap-4"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-accent">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
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
                      <p className="font-semibold text-foreground text-sm">
                        {item.name}
                      </p>
                      {item.size && (
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-amber-500">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-semibold text-foreground">
                    ৳{cartTotal.toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-muted-foreground">Delivery</p>
                  <p className="font-semibold text-green-500">Free</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <p className="text-lg font-black text-foreground">Total</p>
                  <p className="text-2xl font-black text-amber-400">
                    ৳{cartTotal.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}