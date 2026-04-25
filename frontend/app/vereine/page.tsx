"use client";

import { useState, useEffect } from "react";
import { fetchClubs, fetchEvents } from "@/lib/actions";
import type { Club, ClubEvent } from "@/types";
import HeroSection from "@/components/HeroSection";
import ClubCard from "@/components/ClubCard";
import EventCard from "@/components/EventCard";
import MapStrip from "@/components/MapStrip";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function VereineListingPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const [c, e] = await Promise.all([
        fetchClubs({ category: activeFilter }),
        fetchEvents()
      ]);
      setClubs(c);
      setEvents(e);
      setIsLoading(false);
    };
    load();
  }, [activeFilter]);

  const handleMatch = async (answers: Record<string, any>) => {
    setIsLoading(true);
    const matched = await fetchClubs({ tags: answers.interests });
    setClubs(matched);
    setIsLoading(false);
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
  };

  const visibleClubs = clubs.filter((club) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return club.name.toLowerCase().includes(q) || club.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <main>
      <HeroSection onSearch={setSearchQuery} onMatch={handleMatch} />
      <section id="results" className="px-6 md:px-12 py-10 md:py-16 bg-background">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[28px] md:text-[32px] leading-[1.2] font-serif">Vereine in Kassel</h2>
              <p className="text-[15px] text-text-body mt-1">
                {isLoading ? "Matching..." : `${visibleClubs.length} Treffer`}
              </p>
            </div>
          </div>
          <FilterBar active={activeFilter} onChange={setActiveFilter} />
          <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 transition-all", isLoading && "opacity-40")}>
            {visibleClubs.map((club) => <ClubCard key={club.id} club={club} />)}
          </div>
        </div>
      </section>
      <section className="px-6 md:px-12 pb-16"><MapStrip /></section>
      <section className="px-6 md:px-12 py-16 bg-muted/5 border-t">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[28px] md:text-[32px] font-serif mb-8">Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
