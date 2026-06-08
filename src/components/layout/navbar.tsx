"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X, Flame, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CartDrawer from "@/components/shop/CartDrawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/achievements", label: "Honours" },
  { href: "/about", label: "Club" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const user = session?.user;
  const isAdmin = (user as any)?.role === "ADMIN";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 overflow-visible ${
          scrolled
            ? "border-b border-border bg-background/95 backdrop-blur-xl"
            : "bg-gradient-to-b from-black/50 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* LOGO */}
          <Link
            href="/"
            className={`flex items-center gap-2 text-2xl font-black tracking-widest transition ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400">
              <Flame size={16} className="text-black" />
            </div>
            SAVAR<span className="text-amber-400">CF</span>
          </Link>

          {/* NAV LINKS — desktop */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  scrolled
                    ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* CART */}
            <CartDrawer />

            {/* THEME TOGGLE */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              {!mounted ? (
                <span className="h-4 w-4" />
              ) : theme === "dark" ? (
                <Sun size={16} />
              ) : (
                <Moon size={16} />
              )}
            </button>

            {/* AUTH */}
            {!user ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/login"
                  className="rounded-full border border-border px-5 py-2 text-sm text-foreground transition hover:bg-accent"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
                >
                  Join Club
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border pl-1 pr-3 py-1 transition hover:bg-accent">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-amber-400 text-xs font-bold text-black">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm text-foreground md:block">
                    {user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-48 border-border bg-card text-card-foreground"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator className="bg-border" />

                  {/* DASHBOARD — role based */}
                  <DropdownMenuItem asChild>
                    <Link
                      href={isAdmin ? "/admin" : "/dashboard"}
                      className="cursor-pointer"
                    >
                      {isAdmin ? "Admin Panel" : "Dashboard"}
                    </Link>
                  </DropdownMenuItem>

                  {/* MEMBER ONLY LINKS */}
                  {!isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/membership" className="cursor-pointer">
                          Membership
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/orders"
                          className="cursor-pointer"
                        >
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="bg-border" />

                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-all duration-300 md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col px-6 pt-28 pb-10">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-4 text-xl font-semibold text-foreground transition hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-border py-3.5 text-center text-sm font-semibold text-foreground transition hover:bg-accent"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-amber-400 py-3.5 text-center text-sm font-semibold text-black transition hover:bg-amber-300"
                >
                  Join Club
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-border py-3.5 text-center text-sm font-semibold text-foreground transition hover:bg-accent"
                >
                  {isAdmin ? "Admin Panel" : "Dashboard"}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-full border border-destructive/30 py-3.5 text-center text-sm font-semibold text-destructive transition hover:bg-destructive/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}