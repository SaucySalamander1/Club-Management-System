"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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

const CATEGORIES = ["Jersey", "Kit", "Training", "Accessories"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    stock: "",
    featured: false,
    category: "Jersey",
    sizes: [] as string[],
  });

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      return toast.error("Name and price are required");
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Product created!");
      setForm({
        name: "",
        description: "",
        imageUrl: "",
        price: "",
        stock: "",
        featured: false,
        category: "Jersey",
        sizes: [],
      });
      fetchProducts();
    } catch {
      toast.error("Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Products</h1>
        <p className="text-muted-foreground">Manage shop products</p>
      </div>

      {/* ADD FORM */}
      <div className="mb-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Name *
            </label>
            <input
              type="text"
              placeholder="Home Kit 2026"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              placeholder="Product description..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Price (৳) *
            </label>
            <input
              type="number"
              placeholder="1200"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Stock
            </label>
            <input
              type="number"
              placeholder="50"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Image URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* SIZES */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    form.sizes.includes(size)
                      ? "border-amber-400 bg-amber-400 text-black"
                      : "border-border text-foreground hover:border-amber-500/50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) =>
                setForm({ ...form, featured: e.target.checked })
              }
              className="h-4 w-4 rounded accent-amber-400"
            />
            <label htmlFor="featured" className="text-sm text-foreground">
              Featured product (shown on homepage)
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Add Product
            </button>
          </div>
        </form>
      </div>

      {/* PRODUCTS LIST */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-amber-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-4 text-5xl">👕</p>
          <p className="font-semibold text-foreground">No products yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first product above
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              {/* image */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-accent">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ShoppingBag size={20} className="text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground truncate">
                    {product.name}
                  </p>
                  {product.featured && (
                    <span className="shrink-0 rounded-full bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-500">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-amber-500 font-bold">
                  ৳{product.price.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.category} · {product.stock} in stock
                </p>
                {product.sizes.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Sizes: {product.sizes.join(", ")}
                  </p>
                )}
              </div>

              {/* delete */}
              <button
                onClick={() => handleDelete(product.id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}