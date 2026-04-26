"use server";

import { prisma } from "./prisma";
import type { Club, ClubEvent } from "@/types";

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

function mapVerein(v: {
  slug: string;
  name: string;
  type: string;
  description: string | null;
  summary: string | null;
  tags: string;
  categories: string;
  district: string | null;
  addressRaw: string | null;
  addressLat: number | null;
  addressLng: number | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  completenessScore: number | null;
}): Club {
  const tags: string[] = JSON.parse(v.tags || "[]");
  const categories: string[] = JSON.parse(v.categories || "[]");
  const category = categories[0] ?? tags[0] ?? v.type ?? "Verein";

  return {
    id: v.slug,
    slug: v.slug,
    name: v.name,
    category,
    location: v.district ?? "Kassel",
    description: v.description ?? v.summary ?? "",
    tags,
    latitude: v.addressLat ?? undefined,
    longitude: v.addressLng ?? undefined,
    contact: {
      email: v.email ?? undefined,
      website: v.website ?? undefined,
      address: v.addressRaw ?? undefined,
    },
    events: [],
    departments: [],
    fees: [],
    completenessScore: v.completenessScore ?? 0.3,
  };
}

// ---------------------------------------------------------------------------
// Tag + category filtering (in-memory — 155 records, no perf concern)
// ---------------------------------------------------------------------------

function filterClubs(
  clubs: Club[],
  filters: { category?: string; tags?: string[]; limit?: number }
): Club[] {
  let result = clubs;

  if (filters.category) {
    const cat = filters.category;
    result = result.filter((c) => c.category === cat);
  }

  if (filters.tags?.length) {
    const wanted = new Set(filters.tags.map((t) => t.toLowerCase()));
    result = result.filter((c) =>
      c.tags.some((t) => wanted.has(t.toLowerCase()))
    );
  }

  return filters.limit ? result.slice(0, filters.limit) : result;
}

// ---------------------------------------------------------------------------
// Public server actions
// ---------------------------------------------------------------------------

export async function fetchClubs(filters?: {
  category?: string;
  tags?: string[];
  limit?: number;
}): Promise<Club[]> {
  "use cache";

  const rows = await prisma.verein.findMany({
    select: {
      slug: true,
      name: true,
      type: true,
      description: true,
      summary: true,
      tags: true,
      categories: true,
      district: true,
      addressRaw: true,
      addressLat: true,
      addressLng: true,
      email: true,
      phone: true,
      website: true,
      completenessScore: true,
    },
  });

  const clubs = rows.map(mapVerein);
  return filters ? filterClubs(clubs, filters) : clubs;
}

export async function fetchClubBySlug(slug: string): Promise<Club | null> {
  "use cache";

  const v = await prisma.verein.findUnique({
    where: { slug },
    include: { events: true, meetings: true },
  });

  if (!v) return null;

  const club = mapVerein(v);

  club.events = v.events.map((e) => ({
    id: e.id,
    name: e.title ?? e.type ?? "Event",
    date: e.date ?? "",
    location: e.location ?? v.district ?? "Kassel",
    category: e.type ?? club.category,
    isOpenForAll: true,
  }));

  return club;
}

// Alias used by HeroSection for Fuse.js local search index
export async function fetchAllClubsForSearch(): Promise<Club[]> {
  return fetchClubs();
}

export async function fetchEvents(): Promise<ClubEvent[]> {
  "use cache";

  const events = await prisma.event.findMany({
    include: { verein: true },
    orderBy: { date: "asc" },
  });

  return events.map((e) => ({
    id: e.id,
    name: e.title ?? e.type ?? "Event",
    date: e.date ?? "",
    location: e.location ?? e.verein.district ?? "Kassel",
    category: e.type ?? "General",
    isOpenForAll: true,
  }));
}
