"use server";

import type { Club, ClubEvent } from "@/types";
import { MOCK_CLUBS, MOCK_EVENTS } from "./mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// Map backend "Verein" to frontend "Club"
function mapBackendClub(v: any): Club {
  const tags = v.angebote || [];
  
  // Find a specific category that is NOT just "Verein", "Initiative", or "e.V."
  const specificCategory = tags.find((a: any) => 
    !a.name.match(/^[\uD800-\uDBFF][\uDC00-\uDFFF]|^[^\w\s]/) && 
    !["Verein", "Initiative", "e.V.", "ev", "e. v."].some(noise => a.name.toLowerCase() === noise || a.name.toLowerCase().includes("verein"))
  );
  
  const clusterCategory = tags.find((a: any) => a.name.match(/^[\uD800-\uDBFF][\uDC00-\uDFFF]|^[^\w\s]/));
  
  // Fallback chain
  const categoryCandidate = (specificCategory?.name) || (clusterCategory?.name) || "Verein";

  return {
    id: String(v.id),
    slug: v.name?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
    name: v.name || "Unbekannter Verein",
    category: categoryCandidate,
    location: v.adresse || "Kassel",
    memberCount: 0, 
    foundingYear: 0, 
    description: v.beschreibung || "",
    tags: v.eigenschaften?.map((e: any) => e.name) || [],
    matchScore: 0,
    latitude: v.latitude,
    longitude: v.longitude,
    isOpenForAll: true,
    departments: v.angebote?.map((a: any) => ({
      id: String(a.id),
      name: a.name,
      memberCount: 0,
      ageRange: "Alle Alter",
      trainingTimes: [],
      icon: "users"
    })) || [],
    events: [], 
    contact: {
      phone: v.telefonnummer,
      website: v.websiteUrl,
      address: v.adresse
    },
    fees: []
  };
}

export async function fetchClubs(filters?: {
  category?: string;
  tags?: string[];
  limit?: number;
}): Promise<Club[]> {
  "use cache";
  
  try {
    const body: any = {
      limit: filters?.limit || 1000,
    };
    
    const searchTags = [];
    if (filters?.category && filters.category !== "Alle") {
      searchTags.push(filters.category);
    }
    if (filters?.tags) {
      searchTags.push(...filters.tags);
    }
    if (searchTags.length > 0) {
      body.tags = searchTags;
    }

    const res = await fetch(`${API_BASE}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Failed to search from backend");
    const data = await res.json();
    return data.map(mapBackendClub);
  } catch (error) {
    console.warn("Backend fetch failed, using mock data", error);
    const mock = [...MOCK_CLUBS];
    return filters?.limit ? mock.slice(0, filters.limit) : mock;
  }
}

export async function fetchClubBySlug(slug: string): Promise<Club> {
  "use cache";
  
  try {
    const all = await fetchClubs({ limit: 1422 });
    const club = all.find(c => c.slug === slug);
    if (!club) throw new Error(`Club with slug ${slug} not found`);
    return club;
  } catch (error) {
    console.warn(`Fetch by slug ${slug} failed, falling back to mock`);
    return MOCK_CLUBS[0];
  }
}

export async function fetchEvents(): Promise<ClubEvent[]> {
  "use cache";
  return []; 
}
