import Link from "next/link";
import { Flame } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-16">
        <div className="grid gap-12 md:grid-cols-4">

          {/* BRAND */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400">
                <Flame size={16} className="text-black" />
              </div>
              <span className="text-xl font-black tracking-widest text-foreground">
                SAVAR<span className="text-amber-400">CF</span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Official football club based in Savar, Bangladesh.
              Built on passion, driven by football.
            </p>
            <p className="text-xs text-muted-foreground">
              📍 Savar, Dhaka, Bangladesh
            </p>
          </div>

          {/* CLUB */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
              Club
            </p>
            <div className="flex flex-col gap-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/events", label: "Events" },
                { href: "/gallery", label: "Gallery" },
                { href: "/achievements", label: "Honours" },
                { href: "/membership", label: "Membership" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* SHOP */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
              Shop
            </p>
            <div className="flex flex-col gap-3">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop?category=Jersey", label: "Jerseys" },
                { href: "/shop?category=Kit", label: "Kits" },
                { href: "/shop?category=Training", label: "Training" },
                { href: "/checkout", label: "Checkout" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Savar CF. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-xs text-muted-foreground transition hover:text-foreground"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-xs text-muted-foreground transition hover:text-foreground"
            >
              Register
            </Link>
            <Link
              href="/membership"
              className="text-xs text-amber-500 transition hover:text-amber-400"
            >
              Join the Club
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}