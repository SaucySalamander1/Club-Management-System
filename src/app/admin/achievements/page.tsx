"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { AchievementType } from "@prisma/client";
import { toast } from "sonner";

const TYPES: AchievementType[] = [
  "LEAGUE_TITLE",
  "CUP_WIN",
  "PROMOTION",
  "FAIR_PLAY",
  "TOP_SCORER",
  "COMMUNITY",
  "OTHER",
];

const TROPHY_ICONS: Record<AchievementType, string> = {
  LEAGUE_TITLE: "🏆",
  CUP_WIN: "🥇",
  PROMOTION: "⬆️",
  FAIR_PLAY: "🤝",
  TOP_SCORER: "⚽",
  COMMUNITY: "❤️",
  OTHER: "⭐",
};

type Achievement = {
  id: string;
  title: string;
  description: string | null;
  type: AchievementType;
  imageUrl: string | null;
  date: string;
  featured: boolean;
};

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "OTHER" as AchievementType,
    date: "",
    featured: false,
  });

  const fetchAchievements = async () => {
    const res = await fetch("/api/achievements");
    const data = await res.json();
    setAchievements(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      return toast.error("Title and date are required");
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Achievement added!");
      setForm({
        title: "",
        description: "",
        type: "OTHER",
        date: "",
        featured: false,
      });
      fetchAchievements();
    } catch {
      toast.error("Failed to add achievement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    try {
      await fetch(`/api/achievements/${id}`, { method: "DELETE" });
      toast.success("Achievement deleted");
      fetchAchievements();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Achievements</h1>
        <p className="text-muted-foreground">Manage club honours and milestones</p>
      </div>

      {/* ADD FORM */}
      <div className="mb-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">
          Add New Achievement
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Title *
            </label>
            <input
              type="text"
              placeholder="Savar League Champions"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as AchievementType })
              }
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
            >
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {TROPHY_ICONS[type]} {type.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Date *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <input
              type="text"
              placeholder="Optional details"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) =>
                setForm({ ...form, featured: e.target.checked })
              }
              className="h-4 w-4 rounded accent-amber-400"
            />
            <label htmlFor="featured" className="text-sm text-foreground">
              Featured achievement (shown prominently on achievements page)
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
              Add Achievement
            </button>
          </div>
        </form>
      </div>

      {/* ACHIEVEMENTS LIST */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-amber-400" />
        </div>
      ) : achievements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-4 text-5xl">🏆</p>
          <p className="font-semibold text-foreground">No achievements yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first achievement above
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{TROPHY_ICONS[item.type]}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground">{item.title}</p>
                    {item.featured && (
                      <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-500">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.type.replace("_", " ")} ·{" "}
                    {new Date(item.date).getFullYear()}
                  </p>
                  {item.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
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