"use client";

import { useState, useEffect } from "react";
import { getClubs, getEvents } from "@/lib/api";
import type { Club, ClubEvent } from "@/types";
import HeroSection from "@/components/HeroSection";
import ClubCard from "@/components/ClubCard";
import EventCard from "@/components/EventCard";
import MapStrip from "@/components/MapStrip";
import FilterBar from "@/components/FilterBar";

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

  useEffect(() => {
    getClubs().then(setClubs);
    getEvents().then(setEvents);
  }, []);

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
      <HeroSection onSearch={setSearchQuery} />

      {/* Results */}
      <section className="px-12 py-16 bg-background">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2
                className="text-[32px] leading-[1.2] text-foreground"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Vereine in Kassel
              </h2>
              <p className="text-[15px] text-text-body mt-1">
                {visibleClubs.length} Verein{visibleClubs.length !== 1 ? "e" : ""} gefunden
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg text-[14px] font-medium text-primary transition-colors hover:bg-primary/5"
              style={{ border: "1px solid var(--primary)" }}
            >
              Alle Filter
            </button>
          </div>

          <FilterBar active={activeFilter} onChange={setActiveFilter} />

          <div className="grid grid-cols-3 gap-5 mt-8">
            {visibleClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </div>
      </section>

      {/* Map strip */}
      <section className="px-12 pb-16 bg-background">
        <div className="max-w-[1200px] mx-auto">
          <MapStrip />
        </div>
      </section>

      {/* Events */}
      <section
        className="px-12 py-16"
        style={{ background: "var(--bg-alt)", borderTop: "0.5px solid var(--border)" }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h2
              className="text-[32px] leading-[1.2] text-foreground"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Kommende Events
            </h2>
            <p className="text-[15px] text-text-body mt-1">
              Veranstaltungen in deiner Nähe
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Admin footer */}
      <section className="px-12 py-14" style={{ background: "#0B1A1A" }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-12">
          <div>
            <h2
              className="text-[30px] leading-[1.2] text-white"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Euer Verein fehlt?
            </h2>
            <p className="text-[16px] mt-2" style={{ color: "#8AB5B5" }}>
              Tragt euren Verein kostenlos ein und erreicht neue Mitglieder in Kassel.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              className="px-6 py-3 rounded-lg text-white text-[14px] font-semibold transition-opacity hover:opacity-90"
              style={{ background: "var(--brand-accent)" }}
            >
              Verein kostenlos eintragen
            </button>
            <button
              className="px-6 py-3 rounded-lg text-[14px] font-medium transition-colors hover:bg-white/5"
              style={{ border: "1px solid #2A4545", color: "#8AB5B5" }}
            >
              Mehr erfahren
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
