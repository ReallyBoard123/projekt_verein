"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { fetchMapClubs, type MapClub } from "@/lib/actions";

const InlineMap = dynamic(() => import("./InlineMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#f0f4f3] flex items-center justify-center">
      <div className="flex items-center gap-2 text-primary/50">
        <MapPin size={18} className="animate-bounce" />
        <span className="text-[13px]">Karte wird geladen…</span>
      </div>
    </div>
  ),
});

export default function MapSection() {
  const [clubs, setClubs] = useState<MapClub[]>([]);

  useEffect(() => {
    fetchMapClubs().then(setClubs);
  }, []);

  return (
    <div className="relative w-full h-[420px] rounded-[14px] overflow-hidden border-[0.5px] border-border shadow-sm">
      <InlineMap clubs={clubs} />

      {/* Top-left badge */}
      <div className="absolute top-3 left-3 z-[500] flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border-[0.5px] border-border/60">
        <MapPin size={13} className="text-primary" />
        <span className="text-[13px] font-medium text-foreground">
          {clubs.length > 0 ? `${clubs.length} Vereine auf der Karte` : "Kassel & Umgebung"}
        </span>
      </div>

      {/* Bottom-right link to full map */}
      <Link
        href="/karte"
        className="absolute bottom-3 right-3 z-[500] flex items-center gap-1.5 bg-primary text-primary-foreground rounded-lg px-3 py-2 text-[13px] font-semibold shadow-md hover:bg-primary/90 transition-colors"
      >
        Karte erkunden
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
