"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2, Users } from "lucide-react";
import { EventType } from "@prisma/client";
import { toast } from "sonner";

const EVENT_TYPES: EventType[] = [
  "MATCHDAY",
  "TRAINING",
  "TOURNAMENT",
  "TRIAL",
  "YOUTH_TRIAL",
  "FAN_MEETUP",
  "JERSEY_LAUNCH",
  "CLUB_ANNOUNCEMENT",
  "TROPHY_CELEBRATION",
];

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

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string | null;
  type: EventType;
  isPublic: boolean;
  capacity: number | null;
  _count: { registrations: number };
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    type: "TRAINING" as EventType,
    isPublic: true,
    capacity: "",
  });

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.startDate) {
      return toast.error("Title, location and start date are required");
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Event created!");
      setForm({
        title: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        type: "TRAINING",
        isPublic: true,
        capacity: "",
      });
      fetchEvents();
    } catch {
      toast.error("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      toast.success("Event deleted");
      fetchEvents();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Events</h1>
        <p className="text-muted-foreground">Manage club events and sessions</p>
      </div>

      {/* ADD FORM */}
      <div className="mb-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">
          Create New Event
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Title *
            </label>
            <input
              type="text"
              placeholder="Savar Summer Cup 2026"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Type *
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as EventType })
              }
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {TYPE_ICONS[type]} {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              placeholder="Event details..."
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
              Location *
            </label>
            <input
              type="text"
              placeholder="Savar Stadium"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Capacity
            </label>
            <input
              type="number"
              placeholder="Leave empty for unlimited"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: e.target.value })
              }
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={form.isPublic}
              onChange={(e) =>
                setForm({ ...form, isPublic: e.target.checked })
              }
              className="h-4 w-4 rounded accent-amber-400"
            />
            <label htmlFor="isPublic" className="text-sm text-foreground">
              Public event (visible to everyone)
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
              Create Event
            </button>
          </div>
        </form>
      </div>

      {/* EVENTS LIST */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-amber-400" />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-4 text-5xl">📅</p>
          <p className="font-semibold text-foreground">No events yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first event above
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between rounded-2xl border border-border bg-card p-5 gap-4"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl mt-1">
                  {TYPE_ICONS[event.type]}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-foreground">{event.title}</p>
                    {!event.isPublic && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-muted-foreground">
                        Private
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.type.replace(/_/g, " ")} ·{" "}
                    {new Date(event.startDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {" · "}📍 {event.location}
                  </p>
                  {event.capacity && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Users size={12} />
                      <span>
                        {event._count.registrations} / {event.capacity}{" "}
                        registered
                      </span>
                    </div>
                  )}
                  {event.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-1">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(event.id)}
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