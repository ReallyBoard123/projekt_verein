"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchClubs } from "@/lib/actions";
import { computeMatchScore, expandInterestTags } from "@/lib/scoring";
import type { Club } from "@/types";
import HeroSection from "@/components/HeroSection";
import ClubCard from "@/components/ClubCard";
import MapStrip from "@/components/MapStrip";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTER_CATEGORY_MAP: Record<string, string | null> = {
  Alle: null,
  Sport: "Sport",
  Kinder: "Jugend",
  Kultur: "Kultur",
  Technik: "Technik",
  Soziales: "Soziales",
};

const PAGE_SIZE = 9;

export default function VereineListingPage() {
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch full filtered set on category or tag change — paginate client-side
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setPage(1);
      const category = FILTER_CATEGORY_MAP[activeFilter];
      const clubs = await fetchClubs({
        category: category || undefined,
        tags: activeTag ? [activeTag] : undefined,
      });
      setAllClubs(clubs);
      setIsLoading(false);
    };
    load();
  }, [activeFilter, activeTag]);

  // Derive available tags from the current result set — only tags that exist
  const availableTags = useMemo(() => {
    const freq: Record<string, number> = {};
    allClubs.forEach((c) =>
      c.tags.forEach((t) => {
        if (t !== activeTag) freq[t] = (freq[t] ?? 0) + 1;
      })
    );
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [allClubs, activeTag]);

  // Apply search filter on top of loaded clubs
  const filteredClubs = useMemo(() => {
    if (!searchQuery) return allClubs;
    const q = searchQuery.toLowerCase();
    return allClubs.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [allClubs, searchQuery]);

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1); }, [searchQuery]);

  const visibleClubs = filteredClubs.slice(0, page * PAGE_SIZE);
  const hasMore = filteredClubs.length > page * PAGE_SIZE;
  const remaining = filteredClubs.length - visibleClubs.length;

  // Wizard match — replaces current result set, no pagination needed (max 12)
  const handleMatch = async (answers: Record<string, unknown>) => {
    setIsLoading(true);
    setPage(1);
    setActiveFilter("Alle");
    setActiveTag(null);

    const interests = (answers.interests as string[] | undefined) ?? [];
    const expandedTags = expandInterestTags(interests);

    const candidates = await fetchClubs({
      tags: expandedTags.length > 0 ? expandedTags : undefined,
    });

    const scored = candidates
      .map((club) => ({ ...club, matchScore: computeMatchScore(club, answers) }))
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      .slice(0, 12);

    setAllClubs(scored);
    setIsLoading(false);
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
  };

  const totalLabel = isLoading
    ? "Suche…"
    : filteredClubs.length === 0
    ? "Keine Treffer"
    : visibleClubs.length < filteredClubs.length
    ? `${visibleClubs.length} von ${filteredClubs.length} Vereinen`
    : `${filteredClubs.length} ${filteredClubs.length === 1 ? "Verein" : "Vereine"}`;

  return (
    <main>
      <HeroSection onSearch={setSearchQuery} onMatch={handleMatch} />
      <section
        id="results"
        className="px-6 md:px-12 py-10 md:py-16 bg-background"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[28px] md:text-[32px] leading-[1.2] font-serif font-bold">
                Vereine & Initiativen
              </h2>
              <p className="text-[15px] text-text-body mt-1">{totalLabel}</p>
            </div>
          </div>

          <FilterBar
            active={activeFilter}
            onChange={(f) => {
              setActiveFilter(f);
              setActiveTag(null);
            }}
            activeTag={activeTag}
            onTagChange={setActiveTag}
            availableTags={availableTags}
          />

          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 transition-all duration-500",
              isLoading ? "opacity-40 grayscale-[50%]" : "opacity-100"
            )}
          >
            {visibleClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onTagClick={(tag) => {
                  setActiveTag(tag);
                  setActiveFilter("Alle");
                }}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                className="border-primary text-primary hover:bg-primary/5 px-8 h-11 rounded-full"
              >
                Weitere {Math.min(remaining, PAGE_SIZE)} anzeigen
                <span className="ml-2 text-[12px] text-text-muted">
                  ({remaining} weitere)
                </span>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 md:px-12 pb-16">
        <MapStrip />
      </section>

      <section className="px-6 md:px-12 py-10 md:py-14 bg-primary">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-[24px] md:text-[30px] text-primary-foreground font-serif font-bold">
              Euer Verein fehlt?
            </h2>
            <p className="text-[14px] md:text-[16px] mt-2 text-primary-foreground/80">
              Tragt euren Verein kostenlos ein und erreicht neue Mitglieder in
              Kassel.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button className="h-12 bg-[var(--brand-accent)] hover:bg-[var(--brand-accent)]/90 text-white border-0">
              Verein kostenlos eintragen
            </Button>
            <Button
              variant="outline"
              className="h-12 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent"
            >
              Mehr erfahren
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
