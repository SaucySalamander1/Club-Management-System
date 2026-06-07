"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  price: number;
  stock: number;
  featured: boolean;
  category: string | null;
  sizes: string[];
};

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock === 0;

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card transition hover:border-amber-500/30"
    >
      {/* IMAGE */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-accent">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag size={40} className="text-muted-foreground/20" />
          </div>
        )}

        {/* badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.featured && (
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-black">
              Featured
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-semibold text-white">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* INFO */}
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {product.category}
          </p>
        )}
        <p className="font-bold text-foreground group-hover:text-amber-500 transition line-clamp-1">
          {product.name}
        </p>

        {/* sizes */}
        {product.sizes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="rounded-md border border-border px-1.5 py-0.5 text-xs text-muted-foreground"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="text-lg font-black text-amber-500">
            ৳{product.price.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {outOfStock ? (
              <span className="text-red-500">Out of stock</span>
            ) : (
              <span>{product.stock} left</span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}