"use client";

import { useCart } from "@/store/cart";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, count } = useCart();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!mounted) return null;

  const itemCount = count();
  const cartTotal = total();

  return (
    <>
      {/* CART BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
      >
        <ShoppingBag size={16} />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-black">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>

      {/* PORTAL — rendered at end of body via style trick */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
          
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* DRAWER */}
          <div
            ref={drawerRef}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-border p-6">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-amber-500" />
                <h2 className="text-lg font-black text-foreground">
                  Cart
                  {itemCount > 0 && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({itemCount} {itemCount === 1 ? "item" : "items"})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-accent"
              >
                <X size={18} />
              </button>
            </div>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="mb-4 text-muted-foreground/20" />
                  <p className="font-semibold text-foreground">
                    Your cart is empty
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add some products to get started
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-6 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300"
                  >
                    Browse Shop
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex gap-4 rounded-2xl border border-border bg-card p-4"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-accent">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag size={20} className="text-muted-foreground/20" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-1">
                        <p className="font-semibold text-foreground line-clamp-1">
                          {item.name}
                        </p>
                        {item.size && (
                          <p className="text-xs text-muted-foreground">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="text-sm font-bold text-amber-500">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-muted-foreground transition hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.quantity - 1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-accent"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-4 text-center text-sm font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.quantity + 1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-accent"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER */}
            {items.length > 0 && (
              <div className="border-t border-border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-muted-foreground">Total</p>
                  <p className="text-2xl font-black text-amber-400">
                    ৳{cartTotal.toLocaleString()}
                  </p>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-full bg-amber-400 py-3.5 text-center font-semibold text-black transition hover:bg-amber-300"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-3 block w-full rounded-full border border-border py-3.5 text-center text-sm font-semibold text-muted-foreground transition hover:bg-accent"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}