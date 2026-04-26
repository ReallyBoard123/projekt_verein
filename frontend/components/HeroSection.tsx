"use client";

import { useState, useEffect, useMemo } from "react";
import Fuse from 'fuse.js'; // Import Fuse.js
import { Search, Check } from "lucide-react"; // Import Search icon for the button
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OnboardingPanel from "@/components/OnboardingPanel";
import type { Club } from "@/types"; // Assuming Club type is available

// Import the server action
import { fetchAllClubsForSearch } from "@/lib/actions"; 

// REMOVED: QUICK_CHIPS array as the chips are removed from the UI
// const QUICK_CHIPS = ["Fußball", "Kinder", "Musik", "Wandern", "Kunst"];

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onMatch?: (answers: Record<string, any>) => void;
  // Prop to receive club data from the parent Server Component
  clubsData?: Club[]; 
}

// Configure Fuse.js
const fuseOptions = {
  keys: [
    'name',
    'summary',
    'description',
    'tags',
    'category',
    'location',
  ],
  includeScore: true,
  threshold: 0.3, // Adjust for desired fuzziness (0 is exact match, 1 is loose match)
};

export default function HeroSection({ onSearch, onMatch, clubsData }: HeroSectionProps) {
  const [query, setQuery] = useState("");
  // REMOVED: activeChip state as Quick chips are removed
  // const [activeChip, setActiveChip] = useState("Fußball"); 
  const [searchResults, setSearchResults] = useState<Club[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch club data if not provided as prop
  const [localClubsData, setLocalClubsData] = useState<Club[] | null>(clubsData || null);

  useEffect(() => {
    if (!clubsData) { // If clubsData prop is NOT provided
      const loadClubs = async () => {
        setIsLoadingData(true);
        try {
          const fetchedClubs = await fetchAllClubsForSearch();
          setLocalClubsData(fetchedClubs); // Populate local state
        } catch (error) {
          console.error("Failed to fetch clubs for search:", error);
        } finally {
          setIsLoadingData(false);
        }
      };
      loadClubs();
    } else { // If clubsData prop IS provided
      setLocalClubsData(clubsData); // Use the prop
      setIsLoadingData(false); // Data is already available
    }
  }, [clubsData]); // Re-run if clubsData prop changes

  // Initialize Fuse instance - now correctly depends on localClubsData
  const fuse = useMemo(() => {
    if (!localClubsData) {
      return null;
    }
    return new Fuse(localClubsData, fuseOptions);
  }, [localClubsData]); // Dependency changed to localClubsData

  // Effect to update search results when query changes or data is loaded
  useEffect(() => {
    // Check if fuse is ready (not null) and data is loaded
    if (!fuse || !localClubsData || isLoadingData) {
      setSearchResults([]); 
      return;
    }

    if (query.trim() === "") {
      setSearchResults([]); 
      return;
    }
    const results = fuse.search(query);
    
    // Fuse.js returns results with score and item
    const clubsWithScores = results.map(result => result.item);
    setSearchResults(clubsWithScores);

  }, [query, fuse, localClubsData, isLoadingData]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (query.trim() === "") return;
    if (searchResults.length > 0) {
      onSearch?.(query); 
    } else {
      onSearch?.(query); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
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
                style={{
                  fontFamily: "var(--font-serif)",
                  letterSpacing: "-0.3px",
                }}
              >
                Passende Vereine & Initiativen in Kassel
              </h1>
              <p className="text-[15px] md:text-[17px] text-text-body leading-[1.6]">
                Entdecke Gemeinschaften in deiner Nähe – personalisiert,
                barrierefrei und kostenlos.
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
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Verein oder Sportart suchen …"
                className="flex-1 px-3 py-3 text-[15px] text-foreground bg-transparent outline-none placeholder:text-text-muted"
                aria-label="Verein oder Sportart suchen"
              />
              {/* Updated Button: Icon only on sm, icon + text on md+ */}
              <Button
                onClick={handleSearchSubmit}
                className="m-1 rounded-lg shrink-0 px-3 sm:px-5" // Responsive padding
              >
                <Search size={16} className="mr-2 sm:mr-0" /> {/* Icon always visible, margin changes */}
                <span className="hidden sm:inline">Suchen</span> {/* Text hidden on screens smaller than sm */}
              </Button>
            </div>

            {/* Display Fuzzy Search Results */}
            {!isLoadingData && query.trim() !== "" && searchResults.length > 0 && (
              <div
                className="mt-2 rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
                style={{
                  scrollbarColor: 'var(--primary) var(--background)', // Primary color for scrollbar thumb, background for track
                  scrollbarWidth: 'thin'
                }}
              >
                {searchResults.slice(0, 4).map((club) => ( // Changed from 5 to 4 suggestions
                  <div
                    key={club.id}
                    className="p-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                    onClick={() => {
                      setQuery(club.name); 
                      setSearchResults([]); 
                      onSearch?.(club.name); 
                    }}
                  >
                    <div className="font-medium text-sm">{club.name}</div>
                    <div className="text-xs text-gray-500 truncate">{club.summary || club.description}</div>
                  </div>
                ))}
                 {searchResults.length > 4 && ( // Adjusted check for "Mehr Ergebnisse..."
                  <div className="p-2 text-xs text-gray-500 cursor-pointer hover:bg-gray-100" onClick={() => {
                    setQuery(""); 
                    setSearchResults([]);
                    onSearch?.(query); 
                  }}>
                    Mehr Ergebnisse...
                  </div>
                )}
              </div>
            )}
            {/* Message if no results found */}
            {!isLoadingData && query.trim() !== "" && searchResults.length === 0 && (
              <div className="mt-2 text-sm text-gray-500">Keine passenden Vereine gefunden.</div>
            )}

            {/* REMOVED: Quick-filter chips section */}
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
