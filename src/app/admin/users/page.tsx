"use client";

import { useEffect, useState } from "react";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";

type Role = "USER" | "MEMBER" | "PLAYER" | "COACH" | "ADMIN";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

const ROLES: Role[] = ["USER", "MEMBER", "PLAYER", "COACH", "ADMIN"];

const ROLE_COLORS: Record<Role, string> = {
  USER: "bg-accent text-muted-foreground",
  MEMBER: "bg-amber-400/10 text-amber-500",
  PLAYER: "bg-blue-500/10 text-blue-500",
  COACH: "bg-purple-500/10 text-purple-500",
  ADMIN: "bg-red-500/10 text-red-500",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, role: Role) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error();
      toast.success("Role updated!");
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Users</h1>
        <p className="text-muted-foreground">
          Manage user roles and accounts
        </p>
      </div>

      {/* STATS */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {ROLES.map((role) => (
          <div
            key={role}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <p className="text-xs text-muted-foreground">{role}</p>
            <p className="text-2xl font-black text-foreground">
              {users.filter((u) => u.role === role).length}
            </p>
          </div>
        ))}
      </div>

      {/* USERS LIST */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-amber-400" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users size={48} className="mb-4 text-muted-foreground/20" />
          <p className="font-semibold text-foreground">No users yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-sm font-black text-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    ROLE_COLORS[user.role]
                  }`}
                >
                  {user.role}
                </span>
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value as Role)
                  }
                  className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-amber-500 focus:outline-none"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}