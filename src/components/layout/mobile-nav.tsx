"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/membership", label: "Membership" },
];

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden">
          <Menu />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="border-white/10 bg-black text-white"
      >
        <div className="mt-10 flex flex-col gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}