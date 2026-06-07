import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EventType } from "@prisma/client";
import EventCard from "@/components/events/EventCard";

export const metadata = {
  title: "Events | Savar CF",
  description: "Upcoming matches, tournaments, training sessions and club events.",
};

const TYPE_LABELS: Record<EventType, string> = {
  MATCHDAY: "Match Day",
  JERSEY_LAUNCH: "Jersey Launch",
  FAN_MEETUP: "Fan Meetup",
  YOUTH_TRIAL: "Youth Trial",
  CLUB_ANNOUNCEMENT: "Announcement",
  TROPHY_CELEBRATION: "Trophy Celebration",
  TRAINING: "Training",
  TOURNAMENT: "Tournament",
  TRIAL: "Trial",
};

const TYPE_ICONS: Record<EventType, string> = {
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

export default async function EventsPage() {
  const session = await auth();
  const user = session?.user as any;

  const events = await prisma.event.findMany({
    where: { isPublic: true },
    orderBy: { startDate: "asc" },
    include: {
      _count: { select: { registrations: true } },
      registrations: user
        ? { where: { userId: user.id } }
        : false,
    },
  });

  const upcoming = events.filter(
    (e) => new Date(e.startDate) >= new Date()
  );

  const past = events.filter(
    (e) => new Date(e.startDate) < new Date()
  );

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* HERO */}
      <section className="relative border-b border-border px-6 pb-16 pt-36 md:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-500">
            Events
          </p>
          <h1 className="text-5xl font-black md:text-7xl">
            What's <br />
            <span className="text-amber-400">On</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Matches, tournaments, training sessions and more.
            Members can register directly from this page.
          </p>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-amber-500">
            Upcoming
          </p>

          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-5xl mb-4">📅</p>
              <p className="text-lg font-semibold text-foreground">
                No upcoming events
              </p>
              <p className="mt-2 text-muted-foreground">
                Check back soon — events will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  typeLabel={TYPE_LABELS[event.type]}
                  typeIcon={TYPE_ICONS[event.type]}
                  isRegistered={event.registrations?.length > 0}
                  userRole={user?.role}
                  userId={user?.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PAST EVENTS */}
      {past.length > 0 && (
        <section className="border-t border-border px-6 py-16 md:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Past Events
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  typeLabel={TYPE_LABELS[event.type]}
                  typeIcon={TYPE_ICONS[event.type]}
                  isRegistered={event.registrations?.length > 0}
                  userRole={user?.role}
                  userId={user?.id}
                  isPast
                />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}