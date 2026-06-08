import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import AddToCartButton from "@/components/shop/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
  });
  
  if (!product) notFound();

  const outOfStock = product.stock === 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-36 md:px-16">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">

          {/* IMAGE */}
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-accent">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingBag
                  size={80}
                  className="text-muted-foreground/20"
                />
              </div>
            )}

            {/* badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.featured && (
                <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-black">
                  Featured
                </span>
              )}
              {outOfStock && (
                <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                  Sold Out
                </span>
              )}
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col">

            {product.category && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
                {product.category}
              </p>
            )}

            <h1 className="mb-4 text-4xl font-black md:text-5xl">
              {product.name}
            </h1>

            <p className="mb-6 text-3xl font-black text-amber-400">
              ৳{product.price.toLocaleString()}
            </p>

            <p className="mb-8 text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* SIZES */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <p className="mb-3 text-sm font-semibold text-foreground">
                  Available Sizes
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* STOCK */}
            <div className="mb-8 flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  outOfStock ? "bg-red-500" : "bg-green-500"
                }`}
              />
              <p className="text-sm text-muted-foreground">
                {outOfStock
                  ? "Out of stock"
                  : `${product.stock} items in stock`}
              </p>
            </div>

            {/* ADD TO CART */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                sizes: product.sizes,
                stock: product.stock,
              }}
            />

            {/* BACK */}
            
              <a href="/shop"
              className="mt-6 text-sm text-muted-foreground transition hover:text-foreground"
            >
              ← Back to shop
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}