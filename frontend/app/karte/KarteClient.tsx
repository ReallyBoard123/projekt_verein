"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { MapClub } from "@/lib/actions";
import { categoryLabel, categoryIcon } from "@/lib/club-utils";
import { Badge } from "@/components/ui/badge";
import { MapPin, X } from "lucide-react";
import FilterBar from "@/components/FilterBar";
import { FILTER_CATEGORY_MAP } from "@/lib/filters";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#f0f4f3]">
      <div className="flex flex-col items-center gap-3 text-primary/60">
        <MapPin size={32} className="animate-bounce" />
        <span className="text-[14px] font-medium">Karte wird geladen…</span>
      </div>
    </div>
  ),
});

interface Props {
  clubs: MapClub[];
}

export default function KarteClient({ clubs }: Props) {
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<MapClub | null>(null);

  const filtered = useMemo(() => {
    const category = FILTER_CATEGORY_MAP[activeFilter];
    let result = category ? clubs.filter((c) => c.category === category) : clubs;
    if (activeTag) {
      result = result.filter((c) => c.tags.includes(activeTag));
    }
    return result;
  }, [clubs, activeFilter, activeTag]);

  const availableTags = useMemo(() => {
    const freq: Record<string, number> = {};
    filtered.forEach((c) =>
      c.tags.forEach((t) => {
        if (t !== activeTag) freq[t] = (freq[t] ?? 0) + 1;
      })
    );
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [filtered, activeTag]);

  return (
    <div className="flex flex-col h-screen">
      {/* Reuse the same FilterBar as the listing page */}
      <div className="bg-background border-b-[0.5px] border-border px-4 md:px-8 py-3 flex flex-col gap-2 shrink-0 z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 mr-1">
            <MapPin size={13} className="text-primary" />
            <span className="text-[13px] font-medium text-text-muted">
              {filtered.length} Vereine
            </span>
          </div>
          <FilterBar
            active={activeFilter}
            onChange={(f) => { setActiveFilter(f); setActiveTag(null); setSelected(null); }}
            activeTag={activeTag}
            onTagChange={(t) => { setActiveTag(t); setSelected(null); }}
            availableTags={availableTags}
          />
        </div>
      </div>

      {/* Map + detail panel */}
      <div className="flex flex-1 overflow-hidden relative">
        <MapView clubs={filtered} selected={selected} onSelect={setSelected} />

        {selected && (
          <div className="absolute bottom-0 left-0 right-0 md:right-auto md:top-0 md:w-[320px] bg-background border-t md:border-t-0 md:border-r border-border shadow-[0_-4px_24px_rgba(0,0,0,0.1)] md:shadow-[4px_0_24px_rgba(0,0,0,0.06)] z-[1000] flex flex-col animate-in slide-in-from-bottom md:slide-in-from-left duration-200">
            <div className="flex items-start justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-primary shrink-0"
                  style={{ background: "rgb(13 92 99 / 0.08)" }}
                >
                  <div className="scale-[1.3]">{categoryIcon(selected.category)}</div>
                </div>
                <div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[11px] mb-1">
                    {categoryLabel(selected.category)}
                  </Badge>
                  <h3 className="text-[14px] font-bold text-foreground leading-tight">
                    {selected.name}
                  </h3>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-text-muted hover:text-foreground ml-2 shrink-0 mt-0.5">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1">
              {selected.description ? (
                <p className="text-[13px] text-text-body leading-relaxed line-clamp-4">
                  {selected.description}
                </p>
              ) : (
                <p className="text-[13px] text-text-muted italic">Keine Beschreibung vorhanden.</p>
              )}

              {selected.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/5 text-primary/70 border border-primary/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {selected.address && (
                <div className="flex items-start gap-2 text-[12px] text-text-muted">
                  <MapPin size={12} className="text-primary mt-0.5 shrink-0" />
                  <span>{selected.address}</span>
                </div>
              )}
            </div>

            <div className="p-4 pt-0 flex gap-2">
              <a
                href={`/vereine/${selected.slug}`}
                className="flex-1 h-9 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 transition-colors"
              >
                Details →
              </a>
              {selected.website && (
                <a
                  href={selected.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 inline-flex items-center justify-center rounded-md border border-border text-[13px] font-medium text-text-body hover:bg-muted transition-colors"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
