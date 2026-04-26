"use client";

import { useEffect, useRef } from "react";
import type { MapClub } from "@/lib/actions";

const CATEGORY_COLORS: Record<string, string> = {
  Sport:    "#e05c3a",
  Kultur:   "#7c5cbf",
  Musik:    "#d4882b",
  Kunst:    "#c44d8a",
  Soziales: "#2b9e6e",
  Jugend:   "#3a8fd4",
  Bildung:  "#6b9e3a",
  Umwelt:   "#4aaa5c",
  Technik:  "#5a7abf",
  default:  "#0d5c63",
};

function color(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.default;
}

interface Props {
  clubs: MapClub[];
  selected: MapClub | null;
  onSelect: (club: MapClub | null) => void;
}

export default function MapView({ clubs, selected, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerRef = useRef<any>(null);

  // Initialise map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [51.315, 9.49],
        zoom: 13,
        zoomControl: false,
        preferCanvas: true, // canvas renderer — much faster for many markers
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);
      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-draw markers when clubs or selection changes
  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      const map = mapRef.current;
      if (!map) return;

      // Remove old layer
      if (layerRef.current) map.removeLayer(layerRef.current);

      // Build a LayerGroup with circleMarkers — canvas-rendered, no DOM per marker
      const markers = clubs.map((club) => {
        const isSelected = selected?.slug === club.slug;
        const c = color(club.category);

        return L.circleMarker([club.latitude, club.longitude], {
          radius: isSelected ? 10 : 7,
          fillColor: c,
          color: "#fff",
          weight: isSelected ? 3 : 1.5,
          fillOpacity: isSelected ? 1 : 0.85,
        }).on("click", () => onSelect(club));
      });

      const group = L.layerGroup(markers);
      group.addTo(map);
      layerRef.current = group;

      // Pan to selected marker
      if (selected) {
        map.panTo([selected.latitude, selected.longitude], { animate: true, duration: 0.4 });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubs, selected]);

  return <div ref={containerRef} className="flex-1 h-full w-full" style={{ minHeight: 0 }} />;
}
