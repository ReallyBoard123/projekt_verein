"use server";

import type { Club, ClubEvent } from "@/types";
import { MOCK_CLUBS, MOCK_EVENTS } from "./mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// Map backend "Verein" to frontend "Club"
function mapBackendClub(v: any): Club {
  return {
    id: String(v.id),
    name: v.name || "Unbekannter Verein",
    category: v.angebote?.[0]?.name || "Verein",
    location: v.adresse || "Kassel",
    memberCount: 0, 
    foundingYear: 0, 
    description: v.beschreibung || "",
    tags: v.eigenschaften?.map((e: any) => e.name) || [],
    matchScore: 0,
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
}): Promise<Club[]> {
  "use cache";
  
  try {
    const body: any = {};
    if (filters?.category && filters.category !== "Alle") {
      body.tags = [filters.category.toLowerCase()];
    }
    if (filters?.tags) {
      body.tags = [...(body.tags || []), ...filters.tags];
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
    return MOCK_CLUBS;
  }
}

export async function fetchClubById(id: string): Promise<Club> {
  "use cache";
  
  try {
    const res = await fetch(`${API_BASE}/api/vereine/${id}`);
    if (!res.ok) throw new Error(`Club ${id} not found`);
    const data = await res.json();
    return mapBackendClub(data);
  } catch (error) {
    console.warn(`Backend for club ${id} failed`, error);
    const club = MOCK_CLUBS.find((c) => c.id === id);
    if (!club) throw new Error(`Club ${id} not found in mocks`);
    return club;
  }
}

export async function fetchEvents(): Promise<ClubEvent[]> {
  "use cache";
  
  try {
    const res = await fetch(`${API_BASE}/api/angebote`);
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    if (data.length === 0) return MOCK_EVENTS;
    
    return data.map((a: any) => ({
      id: String(a.id),
      name: a.name,
      date: new Date().toISOString(),
      location: "Kassel",
      category: "Info",
      isOpenForAll: true
    }));
  } catch (error) {
    console.warn("Backend events failed", error);
    return MOCK_EVENTS;
  }
}
