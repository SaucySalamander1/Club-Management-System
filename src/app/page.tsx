import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  Trophy,
  Users,
  Calendar,
  ShoppingBag,
  ArrowRight,
  Star,
} from "lucide-react";
import HeroSection from "@/components/home/HeroSection";

const ACHIEVEMENT_ICONS: Record<string, string> = {
  LEAGUE_TITLE: "🏆",
  CUP_WIN: "🥇",
  PROMOTION: "⬆️",
  FAIR_PLAY: "🤝",
  TOP_SCORER: "⚽",
  COMMUNITY: "❤️",
  OTHER: "⭐",
};

const EVENT_ICONS: Record<string, string> = {
  MATCHDAY: "⚽",
  JERSEY_LAUNCH: "👕",
  FAN_MEETUP: "🤝",
  YOUTH_TRIAL: "🌟",
  CLUB_ANNOUNCEMENT: "📢",
  TROPHY_CELEBRATION: "🏆",
  TRAINING: "🏃",
  TOURNAMENT: "🥇",
  TRIAL: "🎯",
};

export default async function HomePage() {
  const [products, events, achievements, gallery] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.event.findMany({
      where: {
        isPublic: true,
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: "asc" },
      take: 3,
    }),
    prisma.achievement.findMany({
      where: { featured: true },
      orderBy: { date: "desc" },
      take: 3,
    }),
    prisma.gallery.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  // fallback to latest if no featured
  const displayProducts =
    products.length > 0
      ? products
      : await prisma.product.findMany({
          orderBy: { createdAt: "desc" },
          take: 4,
        });

  const displayGallery =
    gallery.length > 0
      ? gallery
      : await prisma.gallery.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
        });

  const displayAchievements =
    achievements.length > 0
      ? achievements
      : await prisma.achievement.findMany({
          orderBy: { date: "desc" },
          take: 3,
        });

  // separate gallery for homepage grid (first 4)
  const galleryGrid = displayGallery.slice(0, 4);

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ── HERO ── */}
      <HeroSection images={displayGallery} />

      {/* ── ABOUT ── */}
      <section className="border-t border-border px-6 py-24 md:px-16">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-500">
              About the Club
            </p>
            <h2 className="mb-6 text-4xl font-black leading-tight md:text-5xl">
              Built on Passion.<br />Driven by Football.
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Savar CF was founded with one mission — to create a football
              community that goes beyond the pitch. From youth trials to
              senior tournaments, we nurture talent and celebrate the game.
            </p>
            <p className="mb-8 text-muted-foreground leading-relaxed">
              Our members get access to training sessions, club events,
              exclusive merchandise, and a community that lives and breathes
              football.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-amber-500 font-medium hover:gap-3 transition-all"
            >
              Our full story <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, title: "Community", desc: "A tight-knit group of football lovers" },
              { icon: Calendar, title: "Events", desc: "Tournaments, trials & training sessions" },
              { icon: ShoppingBag, title: "Official Shop", desc: "Jerseys, kits & club merchandise" },
              { icon: Trophy, title: "Achievements", desc: "Honours and trophies through the years" },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-5 transition hover:border-amber-500/30 hover:bg-amber-500/5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
                  <Icon size={18} className="text-amber-500" />
                </div>
                <p className="mb-1 font-semibold text-card-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP CTA ── */}
      <section className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-amber-500/20 bg-amber-500/5 p-10 md:p-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2">
                <Star size={14} className="text-amber-500" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                  Membership
                </span>
              </div>
              <h2 className="mb-3 text-3xl font-black md:text-4xl">
                Join the Club Today
              </h2>
              <p className="max-w-md text-muted-foreground">
                From just ৳200/month — get access to training sessions,
                events, trials, and the full Savar CF experience.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/membership"
                className="rounded-full bg-amber-400 px-8 py-3.5 text-center font-semibold text-black transition hover:bg-amber-300"
              >
                Get Started
              </Link>
              <Link
                href="/events"
                className="rounded-full border border-border px-8 py-3.5 text-center font-semibold transition hover:bg-accent"
              >
                View Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="border-t border-border px-6 py-24 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
                Official Store
              </p>
              <h2 className="text-3xl font-black md:text-4xl">
                Latest Kits & Gear
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:inline-flex transition"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {displayProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag size={48} className="mb-4 text-muted-foreground/20" />
              <p className="text-muted-foreground">No products yet — check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {displayProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="group rounded-2xl border border-border bg-card p-4 transition hover:border-amber-500/30"
                >
                  <div className="mb-4 aspect-square rounded-xl bg-accent flex items-center justify-center relative overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <ShoppingBag size={32} className="text-muted-foreground/20" />
                    )}
                    {product.featured && (
                      <span className="absolute top-2 left-2 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-black">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-card-foreground group-hover:text-amber-500 transition line-clamp-1">
                    {product.name}
                  </p>
                  <p className="mt-1 text-amber-500 font-bold">
                    ৳{product.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 md:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
            >
              View all products <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="border-t border-border px-6 py-24 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
                What's On
              </p>
              <h2 className="text-3xl font-black md:text-4xl">
                Upcoming Events
              </h2>
            </div>
            <Link
              href="/events"
              className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:inline-flex transition"
            >
              All events <ArrowRight size={14} />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar size={48} className="mb-4 text-muted-foreground/20" />
              <p className="text-muted-foreground">No upcoming events — check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href="/events"
                  className="group rounded-2xl border border-border bg-card p-6 transition hover:border-amber-500/30 hover:bg-amber-500/5"
                >
                  <span className="mb-4 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
                    {EVENT_ICONS[event.type]} {event.type.replace(/_/g, " ")}
                  </span>
                  <h3 className="mb-3 font-bold text-lg text-card-foreground group-hover:text-amber-500 transition line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>📅 {new Date(event.startDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}</p>
                    <p>📍 {event.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section className="border-t border-border px-6 py-24 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
                Honours
              </p>
              <h2 className="text-3xl font-black md:text-4xl">
                Our Achievements
              </h2>
            </div>
            <Link
              href="/achievements"
              className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:inline-flex transition"
            >
              Full history <ArrowRight size={14} />
            </Link>
          </div>

          {displayAchievements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Trophy size={48} className="mb-4 text-muted-foreground/20" />
              <p className="text-muted-foreground">Achievements coming soon!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {displayAchievements.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-card p-6 flex items-center gap-4"
                >
                  <span className="text-4xl shrink-0">
                    {ACHIEVEMENT_ICONS[item.type] ?? "⭐"}
                  </span>
                  <div>
                    <p className="font-bold text-card-foreground">{item.title}</p>
                    <p className="text-sm text-amber-500">
                      {new Date(item.date).getFullYear()}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="border-t border-border px-6 py-24 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
                Gallery
              </p>
              <h2 className="text-3xl font-black md:text-4xl">
                Life at Savar CF
              </h2>
            </div>
            <Link
              href="/gallery"
              className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:inline-flex transition"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {galleryGrid.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-5xl mb-4">📷</p>
              <p className="text-muted-foreground">Photos coming soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {galleryGrid.map((img, i) => (
                <Link
                  key={img.id}
                  href="/gallery"
                  className={`group relative overflow-hidden rounded-2xl bg-accent ${
                    i === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={img.imageUrl}
                      alt={img.title ?? "Gallery"}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes={
                        i === 0
                          ? "(max-width: 768px) 50vw, 50vw"
                          : "(max-width: 768px) 50vw, 25vw"
                      }
                    />
                  </div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition">
                    <div>
                      {img.title && (
                        <p className="text-sm font-semibold text-white">
                          {img.title}
                        </p>
                      )}
                      <span className="text-xs text-white/70">
                        {img.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 md:hidden">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
            >
              View all photos <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="border-t border-border px-6 py-24 md:px-16 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-500">
            Ready to Join?
          </p>
          <h2 className="mb-6 text-4xl font-black md:text-5xl">
            Be Part of<br />Savar CF
          </h2>
          <p className="mb-10 text-muted-foreground">
            Join hundreds of members who train, compete, and celebrate
            football together. Your journey starts here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/membership"
              className="rounded-full bg-amber-400 px-8 py-3.5 font-semibold text-black transition hover:bg-amber-300"
            >
              Join Now — ৳200/month
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-border px-8 py-3.5 font-semibold transition hover:bg-accent"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}