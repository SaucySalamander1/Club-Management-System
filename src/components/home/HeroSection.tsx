"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Flame } from "lucide-react";

type GalleryImage = {
  id: string;
  imageUrl: string;
  title: string | null;
  category: string;
};

export default function HeroSection({
  images,
}: {
  images: GalleryImage[];
}) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative flex min-h-screen flex-col items-start justify-center overflow-hidden px-6 pt-24 md:px-16 md:pt-0">

      {/* BACKGROUND IMAGES */}
      {images.length > 0 ? (
        <>
          {images.map((img, i) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === current && !transitioning
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              <Image
                src={img.imageUrl}
                alt={img.title ?? "Savar CF"}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}
          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </>
      ) : (
        <>
          {/* fallback grid background */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
        </>
      )}

      {/* CONTENT */}
      <div className="relative z-10 max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 backdrop-blur-sm">
          <Flame size={14} className="text-amber-400" />
          <span className="text-xs font-medium uppercase tracking-widest text-amber-400">
            Official Football Club · Savar, Bangladesh
          </span>
        </div>

        <h1 className="mb-6 text-6xl font-black leading-[1.05] tracking-tight text-white md:text-8xl">
          SAVAR
          <span className="block text-amber-400">CF</span>
        </h1>

        <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/70">
          More than a club. A community built on passion, discipline,
          and the beautiful game. Join us — on the pitch and off it.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/membership"
            className="rounded-full bg-amber-400 px-8 py-3.5 font-semibold text-black transition hover:bg-amber-300"
          >
            Become a Member
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Shop Jerseys
          </Link>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="relative z-10 mt-20 flex flex-wrap gap-12">
        {[
          { value: "12K+", label: "Club Fans" },
          { value: "25+", label: "Events Hosted" },
          { value: "3×", label: "Trophies Won" },
          { value: "2025", label: "New Era" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-4xl font-black text-white">{stat.value}</p>
            <p className="mt-1 text-sm text-white/60">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* IMAGE INDICATORS */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-amber-400" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* SCROLL HINT */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <div className="h-10 w-px bg-gradient-to-b from-transparent to-white/30" />
        <span className="text-xs uppercase tracking-widest">Scroll</span>
      </div>

      {/* CURRENT IMAGE LABEL */}
      {images.length > 0 && images[current]?.title && (
        <div className="absolute bottom-10 right-6 z-10 md:right-16">
          <p className="text-xs text-white/50 uppercase tracking-widest">
            {images[current].title}
          </p>
        </div>
      )}
    </section>
  );
}