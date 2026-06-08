import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";

export const metadata = {
  title: "Shop | Savar CF",
  description: "Official Savar CF jerseys, kits and merchandise.",
};

const CATEGORIES = ["All", "Jersey", "Kit", "Training", "Accessories"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;

  const category =
    params.category && params.category !== "All"
      ? params.category
      : undefined;

  const products = await prisma.product.findMany({
    where: category ? { category } : {},
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* HERO */}
      <section className="relative border-b border-border px-6 pb-16 pt-36 md:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-500">
            Official Store
          </p>
          <h1 className="text-5xl font-black md:text-7xl">
            Kits &<br />
            <span className="text-amber-400">Gear</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Official Savar CF jerseys, kits and club merchandise.
            Wear the badge with pride.
          </p>
        </div>
      </section>

      {/* FILTER + PRODUCTS */}
      <section className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-6xl">

          {/* CATEGORY FILTER */}
          <div className="mb-10 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              
                <a key={cat}
                href={cat === "All" ? "/shop" : `/shop?category=${cat}`}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  (cat === "All" && !params.category) ||
                  cat === params.category
                    ? "bg-amber-400 text-black"
                    : "border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat}
              </a>
            ))}
          </div>

          {/* EMPTY STATE */}
          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="mb-4 text-5xl">👕</p>
              <p className="text-lg font-semibold text-foreground">
                No products yet
              </p>
              <p className="mt-2 text-muted-foreground">
                Check back soon — new kits are coming.
              </p>
            </div>
          )}

          {/* PRODUCT GRID */}
          {products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  );
}