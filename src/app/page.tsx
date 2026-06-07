import Link from "next/link";
import { Trophy, Users, Calendar, ShoppingBag, ArrowRight, Star, Flame } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ── HERO ── */}
      <section className="relative flex min-h-screen flex-col items-start justify-center overflow-hidden px-6 md:px-16">

        {/* background grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />

        {/* amber glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

        <div className="relative z-10 max-w-4xl">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
            <Flame size={14} className="text-amber-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-amber-500">
              Official Football Club · Savar, Bangladesh
            </span>
          </div>

          <h1 className="mb-6 text-6xl font-black leading-[1.05] tracking-tight md:text-8xl">
            SAVAR
            <span className="block text-amber-400">CF</span>
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
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
              className="rounded-full border border-border px-8 py-3.5 font-semibold transition hover:bg-accent"
            >
              Shop Jerseys
            </Link>
          </div>
        </div>

        {/* stats bar */}
        <div className="relative z-10 mt-20 flex flex-wrap gap-12">
          {[
            { value: "12K+", label: "Club Fans" },
            { value: "25+", label: "Events Hosted" },
            { value: "3×", label: "Trophies Won" },
            { value: "2025", label: "New Era" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-black text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40">
          <div className="h-10 w-px bg-gradient-to-b from-transparent to-muted-foreground/40" />
          <span className="text-xs uppercase tracking-widest">Scroll</span>
        </div>
      </section>

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

          {/* feature grid */}
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

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: "Home Kit 2026", price: "৳1,200", tag: "New" },
              { name: "Away Kit 2026", price: "৳1,200", tag: "New" },
              { name: "Training Jersey", price: "৳800", tag: null },
              { name: "Club Polo", price: "৳600", tag: "Popular" },
            ].map((product) => (
              <Link
                key={product.name}
                href="/shop"
                className="group rounded-2xl border border-border bg-card p-4 transition hover:border-amber-500/30"
              >
                <div className="mb-4 aspect-square rounded-xl bg-accent flex items-center justify-center relative overflow-hidden">
                  <ShoppingBag size={32} className="text-muted-foreground/20" />
                  {product.tag && (
                    <span className="absolute top-2 left-2 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-black">
                      {product.tag}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-card-foreground group-hover:text-amber-500 transition">
                  {product.name}
                </p>
                <p className="mt-1 text-amber-500 font-bold">{product.price}</p>
              </Link>
            ))}
          </div>

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
                Whats On
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

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { type: "Tournament", title: "Savar Summer Cup 2026", date: "July 15, 2026", location: "Savar Stadium" },
              { type: "Training", title: "Open Training Session", date: "June 20, 2026", location: "Club Ground" },
              { type: "Trial", title: "Youth Trials U-18", date: "June 28, 2026", location: "Academy Ground" },
            ].map((event) => (
              <Link
                key={event.title}
                href="/events"
                className="group rounded-2xl border border-border bg-card p-6 transition hover:border-amber-500/30 hover:bg-amber-500/5"
              >
                <span className="mb-4 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
                  {event.type}
                </span>
                <h3 className="mb-3 font-bold text-lg text-card-foreground group-hover:text-amber-500 transition">
                  {event.title}
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>📅 {event.date}</p>
                  <p>📍 {event.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS TEASER ── */}
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

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { trophy: "🏆", title: "Savar League Champions", year: "2024" },
              { trophy: "🥈", title: "Regional Cup Runners-up", year: "2023" },
              { trophy: "⭐", title: "Fair Play Award", year: "2023" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 flex items-center gap-4"
              >
                <span className="text-4xl">{item.trophy}</span>
                <div>
                  <p className="font-bold text-card-foreground">{item.title}</p>
                  <p className="text-sm text-amber-500">{item.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY TEASER ── */}
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

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {["Match Day", "Training", "Trophy", "Team"].map((cat, i) => (
              <Link
                key={cat}
                href="/gallery"
                className={`group relative overflow-hidden rounded-2xl bg-accent ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <div className={`flex items-center justify-center ${i === 0 ? "aspect-square md:h-full" : "aspect-square"}`}>
                  <span className="text-xs text-muted-foreground/50 uppercase tracking-widest">{cat}</span>
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition">
                  <span className="text-sm font-semibold text-white">{cat}</span>
                </div>
              </Link>
            ))}
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