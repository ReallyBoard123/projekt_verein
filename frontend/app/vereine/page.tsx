"use client";

import { useState, useEffect } from "react";
import { getClubs, getEvents } from "@/lib/api";
import type { Club, ClubEvent } from "@/types";
import HeroSection from "@/components/HeroSection";
import ClubCard from "@/components/ClubCard";
import EventCard from "@/components/EventCard";
import MapStrip from "@/components/MapStrip";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";

const FILTER_CATEGORY_MAP: Record<string, string | null> = {
  Alle: null,
  Sport: "sport",
  Kinder: "kinder",
  Kultur: "kultur",
};

export default function VereineListingPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [matchAnswers, setMatchAnswers] = useState<Record<string, any> | null>(
    null,
  );

  useEffect(() => {
    getClubs().then(setClubs);
    getEvents().then(setEvents);
  }, []);

  const handleMatch = (answers: Record<string, any>) => {
    console.log("Wizard results:", answers);
    setMatchAnswers(answers);
    // TODO: Implement sophisticated filtering/scoring logic here
  };

  const visibleClubs = clubs.filter((club) => {
    const category = FILTER_CATEGORY_MAP[activeFilter];
    if (category && club.category !== category) return false;
    if (activeFilter === "≤ 5 km") return true; // placeholder — wire up geo later
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        club.name.toLowerCase().includes(q) ||
        club.tags.some((t) => t.toLowerCase().includes(q)) ||
        club.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <main>
      <HeroSection onSearch={setSearchQuery} onMatch={handleMatch} />

      {/* Results */}
      <section className="px-6 md:px-12 py-10 md:py-16 bg-background">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2
                className="text-[28px] md:text-[32px] leading-[1.2] text-foreground"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Vereine in Kassel
              </h2>
              <p className="text-[15px] text-text-body mt-1">
                {visibleClubs.length} Verein
                {visibleClubs.length !== 1 ? "e" : ""} gefunden
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-primary hover:bg-primary/5 self-start sm:self-auto border-primary"
            >
              Alle Filter
            </Button>
          </div>

          <FilterBar active={activeFilter} onChange={setActiveFilter} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {visibleClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </div>
      </section>

      {/* Map strip */}
      <section className="px-6 md:px-12 pb-10 md:pb-16 bg-background">
        <div className="max-w-[1200px] mx-auto">
          <MapStrip />
        </div>
      </section>

      {/* Events */}
      <section
        className="px-6 md:px-12 py-10 md:py-16"
        style={{
          background: "var(--bg-alt)",
          borderTop: "0.5px solid var(--border)",
        }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h2
              className="text-[28px] md:text-[32px] leading-[1.2] text-foreground"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Kommende Events
            </h2>
            <p className="text-[15px] text-text-body mt-1">
              Veranstaltungen in deiner Nähe
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Admin footer */}
      <section
        className="px-6 md:px-12 py-10 md:py-14"
        style={{ background: "#0B1A1A" }}
      >
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
          <div>
            <h2
              className="text-[24px] md:text-[30px] leading-[1.2] text-white"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Euer Verein fehlt?
            </h2>
            <p
              className="text-[14px] md:text-[16px] mt-2"
              style={{ color: "#8AB5B5" }}
            >
              Tragt euren Verein kostenlos ein und erreicht neue Mitglieder in
              Kassel.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Button className="h-12 text-white font-semibold transition-opacity hover:opacity-90 bg-[var(--brand-accent)] border-0">
              Verein kostenlos eintragen
            </Button>
            <Button
              variant="outline"
              className="h-12 font-medium transition-colors hover:bg-white/5 border-[#2A4545] text-[#8AB5B5]"
            >
              Mehr erfahren
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
