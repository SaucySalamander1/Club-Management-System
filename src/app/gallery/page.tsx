import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata = {
  title: "Gallery | Savar CF",
  description: "Photos from matches, training, events and club life at Savar CF.",
};

export default async function GalleryPage() {
  const images = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* HERO */}
      <section className="relative border-b border-border px-6 pb-16 pt-36 md:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-500">
            Gallery
          </p>
          <h1 className="text-5xl font-black md:text-7xl">
            Life at <br />
            <span className="text-amber-400">Savar CF</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Behind the scenes, on the pitch, and everything in between.
          </p>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-6xl">
          <GalleryGrid images={images} />
        </div>
      </section>

    </main>
  );
}