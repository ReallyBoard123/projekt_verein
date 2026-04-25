import type { Club, ClubEvent } from "@/types";
import { MOCK_CLUBS, MOCK_EVENTS } from "./mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const USE_MOCK = !API_BASE;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
    if (filters?.childFriendly) {
      clubs = clubs.filter(
        (c) => c.tags.includes("Kinder") || c.tags.includes("Familie"),
      );
    }
    return clubs;
  }
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.maxDistance)
    params.set("maxDistance", String(filters.maxDistance));
  if (filters?.childFriendly) params.set("childFriendly", "true");
  const res = await fetch(`${API_BASE}/api/clubs?${params}`);
  if (!res.ok) throw new Error("Failed to fetch clubs");
  return res.json();
}

export async function getClub(id: string): Promise<Club> {
  if (USE_MOCK) {
    await delay(150);
    const club = MOCK_CLUBS.find((c) => c.id === id);
    if (!club) throw new Error(`Club ${id} not found`);
    return club;
  }
  const res = await fetch(`${API_BASE}/api/clubs/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch club ${id}`);
  return res.json();
}

export async function getEvents(): Promise<ClubEvent[]> {
  if (USE_MOCK) {
    await delay(150);
    return MOCK_EVENTS;
  }
  const res = await fetch(`${API_BASE}/api/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}
