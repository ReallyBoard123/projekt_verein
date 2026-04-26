"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react"; // Import useState and useEffect

const NAV_LINKS = [
  { label: "Vereine", href: "/" },
  { label: "Karte", href: "/karte" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false); // State to track scroll position

  // Detect if the screen is mobile (smaller than 'sm' breakpoint)
  useEffect(() => {
    const handleResize = () => {
      // Tailwind's 'sm' breakpoint is typically 640px
      setIsMobile(window.innerWidth < 640);
    };
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // Cleanup listener
  }, []);

  // Detect if the user has scrolled down
  useEffect(() => {
    const handleScroll = () => {
      // Set a scroll threshold, e.g., 50px
      if (window.scrollY > 50) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup listener
  }, []);

  const isSlugPage = pathname.startsWith('/vereine/');
  // Use /logo.png if mobile OR on a slug page OR scrolled down
  // Otherwise, use /together_logo.png
  const shouldUseOtherLogo = isMobile || isSlugPage || isScrolledDown;
  const logoSrc = shouldUseOtherLogo ? "/logo.png" : "/together_logo.png";

  return (
    <header
      className="sticky top-0 z-50 h-20 md:h-24 bg-background border-b border-border flex items-center px-6 md:px-12"
      style={{ borderBottomWidth: "0.5px" }}
    >
      {/* Logo */}
      {/* Using a single Image with dynamic src for simple, instant swap */}
      <Link href="/" className="flex items-center mr-4 md:flex-1 shrink-0 -ml-2 md:-ml-4"> {/* Removed relative positioning */}
        <Image 
          src={logoSrc} // Dynamic src based on conditions
          alt="Club Logo" 
          width={500} 
          height={500} 
          // Reverted to simpler sizing classes, removed animation and opacity/pointer-event classes
          className="h-20 md:h-28 w-20 md:w-28 object-contain" 
          priority
        />
      </Link>

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
