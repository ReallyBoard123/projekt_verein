"use client";

import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import OnboardingPanel from "@/components/OnboardingPanel";
import type { Club } from "@/types";
import { fetchAllClubsForSearch } from "@/lib/actions";

const fuseOptions = {
  keys: ["name", "summary", "description", "tags", "category", "location"],
  includeScore: true,
  threshold: 0.3,
};

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onMatch?: (answers: Record<string, unknown>) => void;
  clubsData?: Club[];
}

export default function HeroSection({ onSearch, onMatch, clubsData }: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Club[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [localClubsData, setLocalClubsData] = useState<Club[] | null>(clubsData || null);

  useEffect(() => {
    if (!clubsData) {
      const loadClubs = async () => {
        setIsLoadingData(true);
        try {
          const fetched = await fetchAllClubsForSearch();
          setLocalClubsData(fetched);
        } finally {
          setIsLoadingData(false);
        }
      };
      loadClubs();
    } else {
      setLocalClubsData(clubsData);
      setIsLoadingData(false);
    }
  }, [clubsData]);

  const fuse = useMemo(
    () => (localClubsData ? new Fuse(localClubsData, fuseOptions) : null),
    [localClubsData]
  );

  useEffect(() => {
    if (!fuse || isLoadingData || query.trim() === "") {
      setSearchResults([]);
      return;
    }
    setSearchResults(fuse.search(query).map((r) => r.item));
  }, [query, fuse, isLoadingData]);

  const handleSearchSubmit = () => {
    if (query.trim() !== "") onSearch?.(query);
  };

  return (
    <section
      className="px-6 md:px-12 py-10 md:py-16"
      style={{ background: "var(--bg-panel)" }}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left: Search & Copy */}
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-4 md:gap-6">
            <p className="text-[13px] font-semibold uppercase tracking-[0.8px] text-brand-accent">
              Kassel & Umgebung
            </p>

            <div className="flex flex-col gap-3">
              <h1
                className="text-[32px] md:text-[44px] font-bold leading-[1.1] text-foreground"
                style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.3px" }}
              >
                Passende Vereine & Initiativen in Kassel
              </h1>
              <p className="text-[15px] md:text-[17px] text-text-body leading-[1.6]">
                Entdecke Gemeinschaften in deiner Nähe – personalisiert,
                barrierefrei und kostenlos.
              </p>
            </div>

            {/* Search bar */}
            <div className="flex items-center rounded-[10px] bg-card overflow-hidden border-[1.5px] border-primary">
              <Search size={16} className="ml-4 text-text-muted shrink-0" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                placeholder="Verein oder Sportart suchen …"
                className="flex-1 px-3 py-3 text-[15px] text-foreground bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset placeholder:text-text-muted"
                aria-label="Verein oder Sportart suchen"
              />
              <Button
                onClick={handleSearchSubmit}
                className="m-1 rounded-lg shrink-0 px-3 sm:px-5"
              >
                <Search size={16} className="sm:mr-0" aria-hidden="true" />
                <span className="hidden sm:inline">Suchen</span>
              </Button>
            </div>

            {/* Search results dropdown */}
            {!isLoadingData && query.trim() !== "" && searchResults.length > 0 && (
              <div
                className="mt-2 rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
                style={{ scrollbarColor: "var(--primary) var(--background)", scrollbarWidth: "thin" }}
              >
                {searchResults.slice(0, 4).map((club) => (
                  <button
                    key={club.id}
                    className="w-full text-left p-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 focus-visible:outline-none focus-visible:bg-gray-100"
                    onClick={() => { setQuery(club.name); setSearchResults([]); onSearch?.(club.name); }}
                  >
                    <div className="font-medium text-sm">{club.name}</div>
                    <div className="text-xs text-gray-500 truncate">{club.summary || club.description}</div>
                  </button>
                ))}
                {searchResults.length > 4 && (
                  <button
                    className="w-full text-left p-2 text-xs text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:bg-gray-100"
                    onClick={() => { setQuery(""); setSearchResults([]); onSearch?.(query); }}
                  >
                    Mehr Ergebnisse…
                  </button>
                )}
              </div>
            )}
            {!isLoadingData && query.trim() !== "" && searchResults.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">Keine passenden Vereine gefunden.</p>
            )}
          </div>
        </div>

        {/* Right: Onboarding */}
        <div className="w-full">
          <OnboardingPanel onComplete={onMatch} />
        </div>
      </div>
    </section>
  );
}
