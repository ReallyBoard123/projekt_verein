"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Vereine", href: "/vereine" },
  { label: "Events", href: "/events" },
  { label: "Karte", href: "/karte" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 h-16 bg-background border-b border-border flex items-center px-6 md:px-12"
      style={{ borderBottomWidth: "0.5px" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-4 md:flex-1">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-bold text-sm leading-none">
            V
          </span>
        </div>
        <span
          className="text-[18px] md:text-[20px] leading-none shrink-0"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span className="text-primary">Vereine</span>
          <span className="text-brand-accent">Finder</span>
        </span>
      </div>

      {/* Center nav - scrollable on mobile */}
      <nav
        aria-label="Hauptnavigation"
        className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar py-2"
      >
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-[14px] md:text-[15px] font-medium text-text-nav pb-0.5 transition-colors hover:text-primary whitespace-nowrap",
                isActive && "text-primary border-b-2 border-primary",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="flex-1 flex justify-end ml-4">
        <Button
          size="sm"
          className="gap-1.5 text-[12px] md:text-[13px] px-3 md:px-4"
        >
          <Plus size={13} aria-hidden="true" />
          <span className="hidden sm:inline">Verein eintragen</span>
          <span className="sm:hidden">Plus</span>
        </Button>
      </div>
    </header>
  );
}
