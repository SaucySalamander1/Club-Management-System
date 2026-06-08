"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { GalleryCategory } from "@prisma/client";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/ImageUpload";

const CATEGORIES: GalleryCategory[] = [
  "MATCH", "TRAINING", "EVENT", "TROPHY", "TEAM", "OTHER",
];

type GalleryImage = {
  id: string;
  title: string | null;
  caption: string | null;
  imageUrl: string;
  category: GalleryCategory;
  featured: boolean;
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    caption: "",
    imageUrl: "",
    category: "OTHER" as GalleryCategory,
    featured: false,
  });

  const fetchImages = async () => {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) return toast.error("Please upload or enter an image");
    setSubmitting(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Image added!");
      setForm({
        title: "",
        caption: "",
        imageUrl: "",
        category: "OTHER",
        featured: false,
      });
      fetchImages();
    } catch {
      toast.error("Failed to add image");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      toast.success("Image deleted");
      fetchImages();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Gallery</h1>
        <p className="text-muted-foreground">Manage club photos</p>
      </div>

      {/* ADD FORM */}
      <div className="mb-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">
          Add New Photo
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">

          {/* IMAGE UPLOAD */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Photo *
            </label>
            <ImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              bucket="gallery"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Title
            </label>
            <input
              type="text"
              placeholder="Match vs Dhaka FC"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Caption
            </label>
            <input
              type="text"
              placeholder="Optional description"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as GalleryCategory })
              }
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
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
              Featured photo (shown on homepage)
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
              Add Photo
            </button>
          </div>
        </form>
      </div>

      {/* IMAGE GRID */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-amber-400" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-4 text-5xl">📷</p>
          <p className="font-semibold text-foreground">No photos yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first photo above
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={img.imageUrl}
                  alt={img.title ?? "Gallery"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              <div className="p-3">
                <p className="truncate text-sm font-semibold text-foreground">
                  {img.title ?? "Untitled"}
                </p>
                <span className="mt-1 inline-block rounded-full bg-amber-400/10 px-2 py-0.5 text-xs text-amber-500">
                  {img.category}
                </span>
              </div>

              <button
                onClick={() => handleDelete(img.id)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>

              {img.featured && (
                <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-black">
                  Featured
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}