"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { GalleryCategory } from "@prisma/client";

const CATEGORIES: { label: string; value: GalleryCategory | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Matches", value: "MATCH" },
  { label: "Training", value: "TRAINING" },
  { label: "Events", value: "EVENT" },
  { label: "Trophies", value: "TROPHY" },
  { label: "Team", value: "TEAM" },
  { label: "Other", value: "OTHER" },
];

type GalleryImage = {
  id: string;
  title: string | null;
  caption: string | null;
  imageUrl: string;
  category: GalleryCategory;
  featured: boolean;
  takenAt: Date | null;
};

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<GalleryCategory | "ALL">("ALL");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered =
    active === "ALL"
      ? images
      : images.filter((img) => img.category === active);

  return (
    <>
      {/* FILTER TABS */}
      <div className="mb-10 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActive(cat.value)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              active === cat.value
                ? "bg-amber-400 text-black"
                : "border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="mb-4 text-5xl">📷</p>
          <p className="text-lg font-semibold text-foreground">
            No photos yet
          </p>
          <p className="mt-2 text-muted-foreground">
            Check back soon — photos will appear here.
          </p>
        </div>
      )}

      {/* GRID */}
      {filtered.length > 0 && (
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
          {filtered.map((img) => (
            <div
              key={img.id}
              onClick={() => setLightbox(img)}
              className="group relative mb-4 cursor-pointer overflow-hidden rounded-2xl border border-border bg-card break-inside-avoid"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={img.imageUrl}
                  alt={img.title ?? "Gallery image"}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* hover overlay */}
              <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                <span className="mb-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-black">
                  {img.category}
                </span>
                {img.title && (
                  <p className="text-sm font-semibold text-white">
                    {img.title}
                  </p>
                )}
                <ZoomIn
                  size={18}
                  className="absolute right-4 top-4 text-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>

          <div
            className="relative max-h-[85vh] max-w-4xl w-full overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.imageUrl}
              alt={lightbox.title ?? "Gallery image"}
              width={1200}
              height={800}
              className="h-auto w-full object-contain"
            />
            {(lightbox.title || lightbox.caption) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                {lightbox.title && (
                  <p className="font-bold text-white">{lightbox.title}</p>
                )}
                {lightbox.caption && (
                  <p className="mt-1 text-sm text-white/70">
                    {lightbox.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}