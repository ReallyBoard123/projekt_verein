"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const SCROLL_THRESHOLD = 80;

export default function StickyLogo() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24 flex items-center px-4 md:px-8 transition-all duration-500 pointer-events-none">
      <Link
        href="/"
        aria-label="Together – nach oben scrollen"
        className="pointer-events-auto relative w-48 h-20"
        onClick={(e) => {
          if (scrolled) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        {/* Together text logo — shown at top */}
        <Image
          src="/together_logo.png"
          alt="Together"
          fill
          sizes="192px"
          className={`object-contain object-left transition-all duration-700 ease-in-out ${
            scrolled ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          priority
        />
        {/* Hands icon logo — fades in on scroll */}
        <Image
          src="/logo.png"
          alt="Together"
          fill
          sizes="192px"
          className={`object-contain object-left transition-all duration-700 ease-in-out ${
            scrolled ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          priority
        />
      </Link>
    </header>
  );
}
