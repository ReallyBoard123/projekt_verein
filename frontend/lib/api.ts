import type { Club, ClubEvent, Contact, Fee } from "@/types";
import { MOCK_CLUBS, MOCK_EVENTS } from "./mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const USE_MOCK = !API_BASE;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapBackendToClub(backend: any, index: number): Club {
  const id = backend.id ? String(backend.id) : `club-${index}`;
  const name = backend.name || "Unbekannter Verein";
  
  return {
    id,
    slug: generateSlug(name),
    name,
    category: "Kultur", 
    location: backend.adresse || "Kassel",
    memberCount: 0,
    foundingYear: 2000,
    description: backend.beschreibung || "",
    tags: backend.tags || ["Kassel", "Gemeinschaft"],
    matchScore: 0,
    latitude: backend.latitude,
    longitude: backend.longitude,
    isOpenForAll: true,
    departments: [],
    events: [],
    contact: {
      phone: backend.telefonnummer !== "null" ? backend.telefonnummer : undefined,
      email: "",
      website: backend.websiteUrl !== "null" ? backend.websiteUrl : undefined,
      address: backend.adresse,
    },
    fees: [],
  };
}

export async function getClubs(filters?: {
  category?: string;
  maxDistance?: number;
  childFriendly?: boolean;
}): Promise<Club[]> {
  if (USE_MOCK) {
    await delay(200);
    let clubs = MOCK_CLUBS;
    if (filters?.category && filters.category !== "Alle") {
      clubs = clubs.filter(
        (c) => c.category === filters.category?.toLowerCase(),
      );
    }
    return clubs;
  }

  try {
    const res = await fetch(`${API_BASE}/api/vereine`);
    if (!res.ok) throw new Error("Failed to fetch clubs");
    const data = await res.json();
    return data.map((item: any, index: number) => mapBackendToClub(item, index));
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

export async function getClub(id: string): Promise<Club> {
  if (USE_MOCK) {
    await delay(150);
    const club = MOCK_CLUBS.find((c) => c.id === id);
    if (!club) throw new Error(`Club ${id} not found`);
    return club;
  }

  if (!isNaN(Number(id))) {
    const res = await fetch(`${API_BASE}/api/vereine/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch club ${id}`);
    const data = await res.json();
    return mapBackendToClub(data, 0);
  } else {
    const all = await getClubs();
    const club = all.find(c => c.id === id || c.slug === id);
    if (!club) throw new Error(`Club ${id} not found`);
    return club;
  }
}

export async function getEvents(): Promise<ClubEvent[]> {
  if (USE_MOCK) {
    await delay(150);
    return MOCK_EVENTS;
  }

  try {
    const res = await fetch(`${API_BASE}/api/angebote`);
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    return data.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      date: new Date().toISOString(),
      location: "Kassel",
      category: "Aktion",
      isOpenForAll: true,
    }));
  } catch (error) {
    console.error("API Error:", error);
    return MOCK_EVENTS;
  }
}
