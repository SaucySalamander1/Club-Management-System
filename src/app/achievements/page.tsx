import { prisma } from "@/lib/prisma";
import { AchievementType } from "@prisma/client";
import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Achievements | Savar CF",
  description: "Honours, trophies and milestones of Savar CF.",
};

const TROPHY_ICONS: Record<AchievementType, string> = {
  LEAGUE_TITLE: "🏆",
  CUP_WIN: "🥇",
  PROMOTION: "⬆️",
  FAIR_PLAY: "🤝",
  TOP_SCORER: "⚽",
  COMMUNITY: "❤️",
  OTHER: "⭐",
};

const TYPE_LABELS: Record<AchievementType, string> = {
  LEAGUE_TITLE: "League Title",
  CUP_WIN: "Cup Win",
  PROMOTION: "Promotion",
  FAIR_PLAY: "Fair Play",
  TOP_SCORER: "Top Scorer",
  COMMUNITY: "Community",
  OTHER: "Other",
};

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { date: "desc" },
  });

  const featured = achievements.filter((a) => a.featured);
  const rest = achievements.filter((a) => !a.featured);

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* HERO */}
      <section className="relative border-b border-border px-6 pb-16 pt-36 md:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-500">
            Honours
          </p>
          <h1 className="text-5xl font-black md:text-7xl">
            Our <br />
            <span className="text-amber-400">Achievements</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Every trophy, every title, every milestone — the story of
            Savar CF told through our greatest moments.
          </p>
        </div>
      </section>

      {/* EMPTY STATE */}
      {achievements.length === 0 && (
        <section className="flex flex-col items-center justify-center py-40 text-center">
          <Trophy size={48} className="mb-4 text-amber-400/30" />
          <p className="text-lg font-semibold text-foreground">
            No achievements yet
          </p>
          <p className="mt-2 text-muted-foreground">
            Check back soon — great things are coming.
          </p>
        </section>
      )}

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="px-6 py-16 md:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-amber-500">
              Major Honours
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center"
                >
                  <span className="text-6xl">
                    {TROPHY_ICONS[item.type]}
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-amber-500">
                    {TYPE_LABELS[item.type]}
                  </p>
                  <h3 className="mt-2 text-xl font-black text-foreground">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  <p className="mt-4 text-2xl font-black text-amber-400">
                    {new Date(item.date).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIMELINE */}
      {rest.length > 0 && (
        <section className="border-t border-border px-6 py-16 md:px-16">
          <div className="mx-auto max-w-3xl">
            <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-amber-500">
              Full History
            </p>

            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-6 top-0 h-full w-px bg-border" />

              <div className="flex flex-col gap-6">
                {rest.map((item) => (
                  <div key={item.id} className="relative flex gap-6 pl-16">
                    {/* dot */}
                    <div className="absolute left-[19px] top-4 h-3 w-3 rounded-full border-2 border-amber-400 bg-background" />

                    <div className="flex-1 rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {TROPHY_ICONS[item.type]}
                          </span>
                          <div>
                            <p className="font-bold text-foreground">
                              {item.title}
                            </p>
                            <p className="text-xs text-amber-500 font-medium">
                              {TYPE_LABELS[item.type]}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 text-sm font-black text-amber-400">
                          {new Date(item.date).getFullYear()}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}