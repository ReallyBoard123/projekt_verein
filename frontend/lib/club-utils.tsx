import { Music, Leaf, Palette, Trophy, Users, Heart } from "lucide-react";
import type { ReactNode } from "react";

const CATEGORY_MAP: Record<string, { label: string; icon: ReactNode }> = {
  sport: { label: "Sport", icon: <Trophy size={16} /> },
  musik: { label: "Musik", icon: <Music size={16} /> },
  kinder: { label: "Kinder & Familie", icon: <Users size={16} /> },
  kultur: { label: "Kultur", icon: <Palette size={16} /> },
  natur: { label: "Natur", icon: <Leaf size={16} /> },
  ehrenamt: { label: "Ehrenamt", icon: <Heart size={16} /> },
};

export function categoryLabel(category: string): string {
  return CATEGORY_MAP[category.toLowerCase()]?.label ?? category;
}

export function categoryIcon(category: string): ReactNode {
  return CATEGORY_MAP[category.toLowerCase()]?.icon ?? <Users size={16} />;
}

const MONTHS_DE = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];
const DAYS_DE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    dayAbbr: DAYS_DE[d.getDay()],
    day: d.getDate(),
    month: MONTHS_DE[d.getMonth()],
    time: d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
  };
}
