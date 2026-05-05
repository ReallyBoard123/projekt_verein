import type { ReactNode } from "react";

// Keyword-based mapping for better coverage of dynamic backend tags
const KEYWORD_MAP: { keywords: string[]; label: string; icon: ReactNode }[] = [
  { keywords: ["sport", "fußball", "turnen", "aktiv", "tanz", "training"], label: "Sport & Aktiv", icon: <span className="text-[16px]">⚽</span> },
  { keywords: ["musik", "kunst", "konzert", "chor", "gesang", "instrument", "chanson", "galerie", "theater", "ausstellung", "fotografie"], label: "Kultur & Musik", icon: <span className="text-[16px]">🎵</span> },
  { keywords: ["kinder", "familie", "jugend", "baby"], label: "Kinder & Familie", icon: <span className="text-[16px]">👶</span> },
  { keywords: ["natur", "umwelt", "green", "garten", "nachhaltig", "outdoor", "wandern"], label: "Natur & Umwelt", icon: <span className="text-[16px]">🌿</span> },
  { keywords: ["sozial", "hilfe", "ehrenamt", "care", "beratung", "pflege", "senioren"], label: "Soziales & Hilfe", icon: <span className="text-[16px]">🤝</span> },
  { keywords: ["tech", "digital", "diy", "handwerk", "it", "werkstatt", "reparier"], label: "Technik & Handwerk", icon: <span className="text-[16px]">🛠️</span> },
  { keywords: ["bildung", "wissen", "schule", "uni", "forschung", "bibliothek", "buch", "literatur"], label: "Bildung & Wissen", icon: <span className="text-[16px]">📖</span> },
  { keywords: ["verein", "initiative", "gemeinschaft"], label: "Verein", icon: <span className="text-[16px]">👥</span> },
  { keywords: ["sonstiges", "vielfalt", "divers"], label: "Sonstiges", icon: <span className="text-[16px]">✨</span> },
];

function getMatch(category: string) {
  const cat = category.toLowerCase();
  return KEYWORD_MAP.find(m => m.keywords.some(k => cat.includes(k)));
}

export function categoryLabel(category: string): string {
  const match = getMatch(category);
  return match ? match.label : category;
}

export function categoryIcon(category: string): ReactNode {
  const match = getMatch(category);
  return match ? match.icon : <span className="text-[16px]">🏢</span>;
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
