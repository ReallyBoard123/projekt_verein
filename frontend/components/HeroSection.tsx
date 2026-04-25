"use client";

import { useState } from "react";
import { Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OnboardingPanel from "@/components/OnboardingPanel";

const QUICK_CHIPS = ["Fußball", "Kinder", "Musik", "Wandern", "Kunst"];

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("Fußball");

  const handleSearch = () => onSearch?.(query);

  return (
    <section
      className="px-12 py-16"
      style={{ background: "var(--bg-panel)" }}
    >
      <div
        className="max-w-[1200px] mx-auto grid gap-16 items-center"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {/* Left: Search */}
        <div className="flex flex-col gap-6">
          <p
            className="text-[13px] font-semibold uppercase tracking-[0.8px] text-brand-accent"
          >
            Kassel & Umgebung
          </p>

          <div className="flex flex-col gap-3">
            <h1
              className="text-[44px] leading-[1.1] text-foreground"
              style={{
                fontFamily: "var(--font-serif)",
                letterSpacing: "-0.3px",
              }}
            >
              Dein passender Verein in Kassel
            </h1>
            <p className="text-[17px] text-text-body leading-[1.6]">
              Entdecke Vereine in deiner Nähe – personalisiert, barrierefrei und
              kostenlos.
            </p>
          </div>

          {/* Search bar */}
          <div
            className="flex items-center rounded-[10px] bg-card overflow-hidden"
            style={{ border: "1.5px solid var(--primary)" }}
          >
            <Search
              size={16}
              className="ml-4 text-text-muted shrink-0"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Verein oder Sportart suchen …"
              className="flex-1 px-3 py-3 text-[15px] text-foreground bg-transparent outline-none placeholder:text-text-muted"
              aria-label="Verein oder Sportart suchen"
            />
            <Button
              onClick={handleSearch}
              className="m-1 rounded-lg text-[13px] font-semibold shrink-0"
            >
              Suchen
            </Button>
          </div>

          {/* Quick-filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-medium text-text-muted">Schnellfilter:</span>
            {QUICK_CHIPS.map((chip) => {
              const isActive = activeChip === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveChip(chip)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all",
                    isActive
                      ? "text-primary"
                      : "border-border text-text-body hover:border-primary/50"
                  )}
                  style={{
                    border: isActive ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                    background: isActive ? "rgb(13 92 99 / 0.08)" : "#fff",
                  }}
                >
                  {isActive && (
                    <Check size={12} strokeWidth={3} aria-hidden="true" />
                  )}
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Onboarding */}
        <OnboardingPanel />
      </div>
    </section>
  );
}
