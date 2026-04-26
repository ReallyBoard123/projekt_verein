"use client";

import { useEffect, useRef } from "react";
import type { MapClub } from "@/lib/actions";
import { MAP_CENTER, MAP_TILE_URL, MAP_TILE_ATTRIBUTION } from "@/lib/map-config";

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

function pinColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.default;
}

export default function InlineMap({ clubs }: { clubs: MapClub[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: MAP_CENTER,
        zoom: 12,
        zoomControl: false,
        scrollWheelZoom: false,
        preferCanvas: true,
      });

      L.tileLayer(MAP_TILE_URL, {
          attribution: MAP_TILE_ATTRIBUTION,
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || clubs.length === 0) return;

    import("leaflet").then((L) => {
      const map = mapRef.current;
      if (!map) return;

      if (layerRef.current) map.removeLayer(layerRef.current);

      const markers = clubs.map((club) =>
        L.circleMarker([club.latitude, club.longitude], {
          radius: 6,
          fillColor: pinColor(club.category),
          color: "#fff",
          weight: 1.5,
          fillOpacity: 0.85,
        }).bindPopup(
          `<div style="min-width:160px">
            <p style="font-size:13px;font-weight:700;margin:0 0 4px">${club.name}</p>
            <p style="font-size:11px;color:#666;margin:0 0 8px">${club.category}</p>
            <a href="/vereine/${club.slug}" style="font-size:12px;font-weight:600;color:#0d5c63">Details ansehen →</a>
          </div>`,
          { closeButton: false, maxWidth: 220 }
        )
      );

      layerRef.current = L.layerGroup(markers).addTo(map);
    });
  }, [clubs]);

  return <div ref={containerRef} className="w-full h-full" />;
}
