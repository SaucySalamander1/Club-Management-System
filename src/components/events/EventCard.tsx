"use client";

import { useState } from "react";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  type: string;
  capacity: number | null;
  _count: { registrations: number };
};

type Props = {
  event: Event;
  typeLabel: string;
  typeIcon: string;
  isRegistered: boolean;
  userRole?: string;
  userId?: string;
  isPast?: boolean;
};

export default function EventCard({
  event,
  typeLabel,
  typeIcon,
  isRegistered: initialRegistered,
  userRole,
  userId,
  isPast = false,
}: Props) {
  const [isRegistered, setIsRegistered] = useState(initialRegistered);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(event._count.registrations);

  const isMember = userRole === "MEMBER" || userRole === "ADMIN";
  const isFull = event.capacity ? count >= event.capacity : false;

  const handleRegister = async () => {
    if (!userId) {
      toast.error("Please login to register for events");
      return;
    }
    if (!isMember) {
      toast.error("Only members can register for events");
      return;
    }

    setLoading(true);
    try {
      const method = isRegistered ? "DELETE" : "POST";
      const res = await fetch(`/api/events/${event.id}/register`, {
        method,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      if (isRegistered) {
        setIsRegistered(false);
        setCount((c) => c - 1);
        toast.success("Unregistered from event");
      } else {
        setIsRegistered(true);
        setCount((c) => c + 1);
        toast.success("Registered for event!");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const startDate = new Date(event.startDate);
  const formattedDate = startDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = startDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-card transition ${
        isPast
          ? "border-border opacity-60"
          : "border-border hover:border-amber-500/30"
      }`}
    >
      {/* TOP */}
      <div className="p-6 flex-1">

        {/* type badge */}
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
            {typeIcon} {typeLabel}
          </span>
          {isPast && (
            <span className="text-xs text-muted-foreground font-medium">
              Past
            </span>
          )}
          {isRegistered && !isPast && (
            <span className="text-xs font-semibold text-green-500">
              ✓ Registered
            </span>
          )}
        </div>

        {/* title */}
        <h3 className="mb-3 text-lg font-black text-foreground">
          {event.title}
        </h3>

        {/* description */}
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        {/* details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} className="shrink-0 text-amber-500" />
            <span>{formattedDate} · {formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} className="shrink-0 text-amber-500" />
            <span>{event.location}</span>
          </div>
          {event.capacity && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={14} className="shrink-0 text-amber-500" />
              <span>
                {count} / {event.capacity} registered
                {isFull && (
                  <span className="ml-2 text-red-500 font-medium">· Full</span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CAPACITY BAR */}
      {event.capacity && (
        <div className="px-6 pb-2">
          <div className="h-1.5 w-full rounded-full bg-accent overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{
                width: `${Math.min((count / event.capacity) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* REGISTER BUTTON */}
      {!isPast && (
        <div className="p-6 pt-4">
          {!userId ? (
            
              <a href="/login"
              className="block w-full rounded-full border border-border py-2.5 text-center text-sm font-semibold text-muted-foreground transition hover:bg-accent"
            >
              Login to Register
            </a>
          ) : !isMember ? (
            
              <a href="/membership"
              className="block w-full rounded-full border border-amber-500/30 bg-amber-500/10 py-2.5 text-center text-sm font-semibold text-amber-500 transition hover:bg-amber-500/20"
            >
              Become a Member to Register
            </a>
          ) : (
            <button
              onClick={handleRegister}
              disabled={loading || (isFull && !isRegistered)}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                isRegistered
                  ? "border border-border text-muted-foreground hover:border-red-500/30 hover:text-red-500"
                  : isFull
                  ? "border border-border text-muted-foreground cursor-not-allowed"
                  : "bg-amber-400 text-black hover:bg-amber-300"
              }`}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isRegistered ? (
                "Cancel Registration"
              ) : isFull ? (
                "Event Full"
              ) : (
                "Register Now"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}