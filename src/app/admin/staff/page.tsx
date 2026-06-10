"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2, Pencil, X, Check } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import ImageUpload from "@/components/ui/ImageUpload";

type Staff = {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  imageUrl: string | null;
  order: number;
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    imageUrl: "",
    order: "0",
  });

  const fetchStaff = async () => {
    const res = await fetch("/api/staff");
    const data = await res.json();
    setStaff(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.title) {
      return toast.error("Name and title are required");
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Staff member added!");
      setForm({ name: "", title: "", bio: "", imageUrl: "", order: "0" });
      fetchStaff();
    } catch {
      toast.error("Failed to add staff member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this staff member?")) return;
    try {
      await fetch(`/api/staff/${id}`, { method: "DELETE" });
      toast.success("Staff member deleted");
      fetchStaff();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = async (id: string) => {
    if (!editing) return;
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error();
      toast.success("Staff member updated!");
      setEditing(null);
      fetchStaff();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Club Staff</h1>
        <p className="text-muted-foreground">
          Manage club management team and staff info
        </p>
      </div>

      {/* ADD FORM */}
      <div className="mb-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">
          Add Staff Member
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Name *
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Title *
            </label>
            <input
              type="text"
              placeholder="President, Vice President, Director..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Bio
            </label>
            <textarea
              placeholder="Short description about this person..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Display Order
            </label>
            <input
              type="number"
              placeholder="0"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
            />
            <p className="text-xs text-muted-foreground">
              Lower number = shown first
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Photo
            </label>
            <ImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              bucket="gallery"
            />
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
              Add Staff Member
            </button>
          </div>
        </form>
      </div>

      {/* STAFF LIST */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-amber-400" />
        </div>
      ) : staff.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-4 text-5xl">👥</p>
          <p className="font-semibold text-foreground">No staff added yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first staff member above
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {staff.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              {editing?.id === member.id ? (
                /* EDIT MODE */
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <input
                      value={editing.name}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                      className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <input
                      value={editing.title}
                      onChange={(e) =>
                        setEditing({ ...editing, title: e.target.value })
                      }
                      className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Bio</label>
                    <textarea
                      value={editing.bio ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, bio: e.target.value })
                      }
                      rows={2}
                      className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-amber-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <button
                      onClick={() => handleEdit(member.id)}
                      className="flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-black transition hover:bg-amber-300"
                    >
                      <Check size={12} /> Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
                    >
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* VIEW MODE */
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-accent">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-black text-muted-foreground">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">{member.name}</p>
                    <p className="text-sm text-amber-500 font-medium">
                      {member.title}
                    </p>
                    {member.bio && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {member.bio}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      #{member.order}
                    </span>
                    <button
                      onClick={() => setEditing(member)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}