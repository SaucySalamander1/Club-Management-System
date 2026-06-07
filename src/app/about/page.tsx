import Link from "next/link";
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  Heart,
  Star,
  Flame,
} from "lucide-react";

export const metadata = {
  title: "About | Savar CF",
  description: "The story of Savar CF — who we are, what we stand for.",
};

const STATS = [
  { value: "2020", label: "Founded" },
  { value: "12K+", label: "Supporters" },
  { value: "25+", label: "Events Hosted" },
  { value: "3×", label: "Trophies Won" },
];

const VALUES = [
  {
    icon: Heart,
    title: "Passion",
    desc: "Football is more than a game — it's a way of life. We play with heart every time.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "We are nothing without our people. Every member, fan, and supporter is family.",
  },
  {
    icon: Star,
    title: "Excellence",
    desc: "We hold ourselves to the highest standards — on the pitch and off it.",
  },
  {
    icon: Trophy,
    title: "Winning Culture",
    desc: "We compete to win but never lose sight of respect, fair play, and sportsmanship.",
  },
];

const TEAM = [
  { name: "Club Chairman", role: "Leadership" },
  { name: "Head Coach", role: "Technical Staff" },
  { name: "Assistant Coach", role: "Technical Staff" },
  { name: "Team Manager", role: "Management" },
  { name: "Club Secretary", role: "Administration" },
  { name: "Fitness Coach", role: "Technical Staff" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* HERO */}
      <section className="relative border-b border-border px-6 pb-16 pt-36 md:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-500">
            About the Club
          </p>
          <h1 className="text-5xl font-black md:text-7xl">
            More Than<br />
            <span className="text-amber-400">A Club</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Savar CF was built on a simple belief — that football has
            the power to bring people together, build character, and
            create something bigger than the game itself.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border px-6 py-16 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-5xl font-black text-amber-400">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="border-b border-border px-6 py-24 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-500">
                Our Story
              </p>
              <h2 className="mb-6 text-4xl font-black leading-tight">
                Born in Savar.<br />Built for Football.
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Savar CF was founded in 2020 by a group of football
                  enthusiasts who wanted to create a proper football
                  club in the heart of Savar, Dhaka. What started as
                  weekend kickabouts quickly grew into something much
                  bigger.
                </p>
                <p>
                  Today, Savar CF is a full club with organized
                  training sessions, competitive matches, youth trials,
                  and a growing community of members and supporters who
                  share one common love — the beautiful game.
                </p>
                <p>
                  We believe football should be accessible to everyone.
                  Whether you're a seasoned player or just starting out,
                  Savar CF is your home.
                </p>
              </div>
            </div>

            {/* info cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: MapPin,
                  title: "Location",
                  value: "Savar, Dhaka",
                  desc: "Bangladesh",
                },
                {
                  icon: Calendar,
                  title: "Founded",
                  value: "2020",
                  desc: "Est. by local enthusiasts",
                },
                {
                  icon: Users,
                  title: "Members",
                  value: "200+",
                  desc: "Active club members",
                },
                {
                  icon: Trophy,
                  title: "Trophies",
                  value: "3×",
                  desc: "Regional honours",
                },
              ].map(({ icon: Icon, title, value, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10">
                    <Icon size={16} className="text-amber-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">{title}</p>
                  <p className="text-xl font-black text-foreground">
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-b border-border px-6 py-24 md:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-500">
            What We Stand For
          </p>
          <h2 className="mb-12 text-4xl font-black">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6 transition hover:border-amber-500/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10">
                  <Icon size={22} className="text-amber-500" />
                </div>
                <h3 className="mb-2 text-lg font-black text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAFF */}
      <section className="border-b border-border px-6 py-24 md:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-500">
            The People
          </p>
          <h2 className="mb-12 text-4xl font-black">Club Staff</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-400/10">
                  <Flame size={18} className="text-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="px-6 py-24 md:px-16 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-500">
            Get Involved
          </p>
          <h2 className="mb-6 text-4xl font-black md:text-5xl">
            Be Part of<br />the Story
          </h2>
          <p className="mb-10 text-muted-foreground">
            Whether you want to play, support, or just be part of
            something special — Savar CF welcomes everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/membership"
              className="rounded-full bg-amber-400 px-8 py-3.5 font-semibold text-black transition hover:bg-amber-300"
            >
              Join the Club
            </Link>
            <Link
              href="/events"
              className="rounded-full border border-border px-8 py-3.5 font-semibold transition hover:bg-accent"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}