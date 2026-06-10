"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Plus,
  Calendar,
  Package,
  Users,
  Image,
  Trophy,
  CreditCard,
  UserCircle,
} from "lucide-react";
import { Flame } from "lucide-react";

const links = [
  {
    group: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    group: "Shop",
    items: [
      { name: "Products", href: "/admin/products", icon: ShoppingBag },
      { name: "Create Product", href: "/admin/products/create", icon: Plus },
      { name: "Orders", href: "/admin/orders", icon: Package },
    ],
  },
  {
    group: "Club",
    items: [
      { name: "Events", href: "/admin/events", icon: Calendar },
      { name: "Gallery", href: "/admin/gallery", icon: Image },
      { name: "Achievements", href: "/admin/achievements", icon: Trophy },
      { name: "Club Staff", href: "/admin/staff", icon: UserCircle },
    ],
  },
  {
    group: "Members",
    items: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Memberships", href: "/admin/members", icon: CreditCard },
    ],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-72 border-r border-border bg-card text-card-foreground flex flex-col">

      {/* LOGO */}
      <div className="border-b border-border p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400">
            <Flame size={16} className="text-black" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-wide text-foreground">
              SAVAR CF
            </h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* NAV */}
      <nav className="flex-1 space-y-6 p-4 overflow-y-auto">
        {links.map((group) => (
          <div key={group.group}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-amber-400 text-black"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-border p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}