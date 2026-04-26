"use client";

import { useState, useEffect } from "react";
import { fetchClubs } from "@/lib/actions";
import type { Club } from "@/types";
import HeroSection from "@/components/HeroSection";
import ClubCard from "@/components/ClubCard";
import MapStrip from "@/components/MapStrip";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTER_CATEGORY_MAP: Record<string, string | null> = {
  Alle: null,
  Sport: "Active & Sports",
  Kinder: "Kinder und Jugendliche",
  Kultur: "Arts & Culture",
  Technik: "Tech & DIY",
  Soziales: "Social & Care",
};

export default function VereineListingPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Responsive limit: 6 for mobile, 9 for desktop
  const [baseLimit, setLimit] = useState(9);

  useEffect(() => {
    const handleResize = () => {
      setLimit(window.innerWidth < 768 ? 6 : 9);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const category = FILTER_CATEGORY_MAP[activeFilter];
      const c = await fetchClubs({ 
        category: category || undefined, 
        limit: showAll ? 1000 : baseLimit 
      });
      setClubs(c);
      setIsLoading(false);
    };
    load();
  }, [activeFilter, baseLimit, showAll]);

  const handleMatch = async (answers: Record<string, any>) => {
    setIsLoading(true);
    const tags = answers.interests || [];
    const matched = await fetchClubs({ tags, limit: 12 });
    setClubs(matched);
    setIsLoading(false);
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
  };

  const visibleClubs = clubs.filter((club) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        club.name.toLowerCase().includes(q) ||
        club.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

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
                Vereine & Kollektive
              </h2>
              <p className="text-[15px] text-text-body mt-1">
                {isLoading
                  ? "Matching..."
                  : showAll 
                    ? "Alle Vereine in Kassel" 
                    : `${visibleClubs.length} Treffer für dich`}
              </p>
            </div>
            {!showAll && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(true)}
                className="border-primary text-primary hover:bg-primary/5 self-start sm:self-auto"
              >
                Alle anzeigen
              </Button>
            )}
            {showAll && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(false)}
                className="text-text-muted hover:text-primary self-start sm:self-auto"
              >
                Weniger anzeigen
              </Button>
            )}
          </div>

          <FilterBar active={activeFilter} onChange={setActiveFilter} />

          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 transition-all duration-500",
              isLoading ? "opacity-40 grayscale-[50%]" : "opacity-100",
            )}
          >
            {visibleClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-16">
        <MapStrip />
      </section>

      {/* Admin footer */}
      <section className="px-6 md:px-12 py-10 md:py-14 bg-[#0B1A1A]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-[24px] md:text-[30px] text-white font-serif font-bold">
              Euer Verein fehlt?
            </h2>
            <p className="text-[14px] md:text-[16px] mt-2 text-[#8AB5B5]">
              Tragt euren Verein kostenlos ein und erreicht neue Mitglieder in
              Kassel.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button className="h-12 bg-[var(--brand-accent)] text-white border-0">
              Verein kostenlos eintragen
            </Button>
            <Button
              variant="outline"
              className="h-12 border-[#2A4545] text-[#8AB5B5] hover:bg-white/5"
            >
              Mehr erfahren
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
