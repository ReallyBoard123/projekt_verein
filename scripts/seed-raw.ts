#!/usr/bin/env tsx
/**
 * Seeds the DB with raw entries from vereine.json that are not already
 * present (by name match against cleaned_entries.json).
 *
 * Maps the original platform tags to the clean category/tag vocabulary
 * used by the scoring system.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "dev.db");
const rawPath = path.join(__dirname, "..", "data", "vereine.json");
const cleanedPath = path.join(__dirname, "..", "data", "cleaned_entries.json");

const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Platform tag → DB primary_category
// ---------------------------------------------------------------------------
const TAG_TO_CATEGORY: Record<string, string> = {
  // Sport (OSM tags)
  soccer: "Sport", handball: "Sport", tennis: "Sport", fitness: "Sport",
  gymnastics: "Sport", climbing: "Sport", rowing: "Sport", sailing: "Sport",
  canoe: "Sport", windsurfing: "Sport", water_sports: "Sport", sport: "Sport",
  martial_arts: "Sport", fencing: "Sport", crossfit: "Sport", darts: "Sport",
  shooting: "Sport", skateboard: "Sport", "10pin": "Sport", multi: "Sport",
  karting: "Sport", "pilates;fitness;gymnastics": "Sport",
  "rudern;rowing": "Sport", "climbing;bouldering": "Sport",
  "climbing_adventure": "Sport", "multi;soccer": "Sport",
  "multi;table_tennis": "Sport",
  // Sport (German)
  "Tanzvereine und Tanzschulen": "Sport",
  "Tanz-Ensembles": "Kunst",
  // Musik
  Musikvereine: "Musik", Chöre: "Musik", Orchester: "Musik", Bands: "Musik",
  Jazz: "Musik", "Ensembles (Profi)": "Musik", "Ensembles (Semiprofi)": "Musik",
  Musical: "Musik", Chanson: "Musik", "Musik in der Kirche": "Musik",
  "Instrumente und Service": "Musik", "Musikunterricht und Dozenten": "Musik",
  "Musiker (Profi)": "Musik", Konzert: "Musik",
  "Komponisten und Dirigenten": "Musik",
  // Kunst
  "Theaterensembles (Profi)": "Kunst", "Theaterensembles (Semiprofi)": "Kunst",
  "Theaterhäuser und Theaterbühnen": "Kunst", Kabarett: "Kunst",
  Kleinkunst: "Kunst", "Galerien und Ausstellungsorte": "Kunst",
  "Kunstvereine und Kunstinitiativen": "Kunst",
  "Angewandte Kunst und Design": "Kunst", Fotografie: "Kunst",
  "Kunst im öffentlichen Raum": "Kunst", Kunstpädagogik: "Kunst",
  Kunstvermittlung: "Kunst", "Schauspieler (Profi)": "Kunst",
  "Tänzer und Choreografen": "Kunst", "Kultur im öffentlichen Raum": "Kunst",
  // Kultur (catch-all)
  "Initiativen und Kulturvereine": "Kultur",
  "Regional- und Heimatmuseen": "Kultur",
  "Staatliche und Städtische Museen": "Kultur",
  "Kulturhäuser und Veranstaltungsorte": "Kultur",
  "Kulturstiftungen und Förderung": "Kultur",
  Kulturförderung: "Kultur",
  Kulturwissenschaften: "Kultur",
  Geschichtsvereine: "Kultur",
  "Kino und Filmvorführung": "Kultur",
  // Bildung
  "Bildung und Weiterbildung": "Bildung",
  Kursangebote: "Bildung",
  "Ausbildung und Studium": "Bildung",
  Medienpädagogik: "Bildung",
  Theaterpädagogik: "Bildung",
  Literatur: "Bildung",
  "Bibliotheken und Büchereien": "Bildung",
  Autoren: "Bildung",
  Schreibwerkstätten: "Bildung",
  "Lesung und Erzählung": "Bildung",
  Printmedien: "Bildung",
  Journalismus: "Bildung",
  // Jugend
  "Angebote für Kinder und Jugendliche": "Jugend",
  scout: "Jugend",
  // Technik
  "Webdesign und Grafik": "Technik",
  "Film und Video-Produktion": "Technik",
  // Soziales
  food_sharing: "Soziales",
  taxhelp: "Soziales",
  freemasonry: "Soziales",
  game: "Soziales",
  tabletop_games: "Soziales",
  dog: "Soziales",
  // Umwelt
  allotments: "Umwelt",
};

// ---------------------------------------------------------------------------
// Platform tag → clean DB secondary tags (for scoring compatibility)
// ---------------------------------------------------------------------------
const TAG_TO_CLEAN_TAGS: Record<string, string[]> = {
  soccer: ["Fußball", "Sport", "Mannschaftssport"],
  handball: ["Handball", "Sport", "Mannschaftssport"],
  tennis: ["Tennis", "Sport"],
  fitness: ["Fitness", "Sport", "Gesundheitssport"],
  gymnastics: ["Turnen", "Sport", "Gymnastik"],
  climbing: ["Klettern", "Bouldern", "Sport", "Outdoor"],
  "climbing;bouldering": ["Klettern", "Bouldern", "Sport"],
  "climbing_adventure": ["Klettern", "Sport", "Outdoor"],
  rowing: ["Rudern", "Wassersport", "Sport", "Outdoor"],
  "rudern;rowing": ["Rudern", "Wassersport", "Sport"],
  sailing: ["Segeln", "Wassersport", "Sport", "Outdoor"],
  canoe: ["Kanu", "Kajak", "Wassersport", "Sport", "Outdoor"],
  windsurfing: ["Windsurfing", "Wassersport", "Sport"],
  water_sports: ["Wassersport", "Sport"],
  sport: ["Sport", "Breitensport"],
  martial_arts: ["Kampfsport", "Kampfkunst", "Sport"],
  fencing: ["Fechten", "Sport"],
  crossfit: ["Fitness", "Crossfit", "Sport", "Leistungssport"],
  darts: ["Billard", "Präzisionssport", "Freizeit"],
  shooting: ["Schießen", "Präzisionssport", "Sport"],
  skateboard: ["Skateboard", "Urban Sports", "Sport"],
  "10pin": ["Bowling", "Präzisionssport", "Sport"],
  multi: ["Sport", "Breitensport", "Freizeitgestaltung"],
  "multi;soccer": ["Fußball", "Sport", "Mannschaftssport"],
  "multi;table_tennis": ["Tischtennis", "Sport"],
  karting: ["Motorsport", "Sport"],
  "pilates;fitness;gymnastics": ["Pilates", "Fitness", "Gymnastik", "Sport"],
  Musikvereine: ["Musik", "Vereinsleben"],
  Chöre: ["Chor", "Gesang", "Musik"],
  Orchester: ["Orchester", "Musik", "Ensemble"],
  Bands: ["Bands", "Musik", "Live-Musik"],
  Jazz: ["Jazz", "Musik", "Konzerte"],
  "Ensembles (Profi)": ["Ensemble", "Musik", "Profitraining", "Leistungssport"],
  "Ensembles (Semiprofi)": ["Ensemble", "Musik"],
  Musical: ["Musical", "Musiktheater", "Theater"],
  Chanson: ["Chanson", "Musik", "Konzerte"],
  Konzert: ["Konzerte", "Musik", "Live-Musik"],
  "Tanzvereine und Tanzschulen": ["Tanz", "Sport", "Kurse"],
  "Tanz-Ensembles": ["Tanz", "Zeitgenössischer Tanz", "Ensemble"],
  "Theaterensembles (Profi)": ["Theater", "Schauspiel", "Ensemble", "Leistungssport"],
  "Theaterensembles (Semiprofi)": ["Theater", "Schauspiel", "Ensemble"],
  "Theaterhäuser und Theaterbühnen": ["Theater", "Veranstaltungsort", "Konzerte"],
  Kabarett: ["Kabarett", "Kleinkunst", "Konzerte"],
  Kleinkunst: ["Kleinkunst", "Kabarett"],
  Kursangebote: ["Kurse", "Workshops", "Weiterbildung"],
  "Bildung und Weiterbildung": ["Bildungsarbeit", "Weiterbildung", "Erwachsenenbildung"],
  "Angebote für Kinder und Jugendliche": ["Kinder", "Jugend", "Jugendarbeit"],
  "Initiativen und Kulturvereine": ["Kultur", "Kulturverein", "Ehrenamt"],
  Fotografie: ["Fotografie", "Kunst", "Ausstellungen"],
  "Galerien und Ausstellungsorte": ["Galerie", "Ausstellungen", "Kunst"],
  Literatur: ["Literatur", "Lesen", "Bildung"],
  food_sharing: ["Nachhaltigkeit", "Ehrenamt", "Gemeinschaft", "Freiwilligenarbeit"],
  taxhelp: ["Beratung", "Soziales", "Ehrenamt"],
  allotments: ["Kleingarten", "Gartenbau", "Natur"],
  "Kino und Filmvorführung": ["Kino", "Programmkino", "Film"],
  "Webdesign und Grafik": ["Medienkunst", "DIY", "Kreativität"],
  "Film und Video-Produktion": ["Film", "Medienkunst", "DIY"],
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function inferCategory(tags: string[]): string {
  for (const tag of tags) {
    if (TAG_TO_CATEGORY[tag]) return TAG_TO_CATEGORY[tag];
  }
  return "Kultur"; // default
}

function mapToCleanTags(rawTags: string[]): string[] {
  const result = new Set<string>();
  for (const tag of rawTags) {
    const mapped = TAG_TO_CLEAN_TAGS[tag];
    if (mapped) mapped.forEach((t) => result.add(t));
    else {
      // Keep the raw tag if it looks like a clean German word (not OSM syntax)
      if (!tag.includes(";") && tag.length < 40) result.add(tag);
    }
  }
  return [...result];
}

async function main() {
  const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));
  const cleaned = JSON.parse(fs.readFileSync(cleanedPath, "utf-8"));

  const cleanedNames = new Set(
    cleaned.map((e: { name: string }) => e.name?.toLowerCase().trim())
  );

  // Only entries not covered by cleaned_entries
  const toImport = raw.filter((v: Record<string, unknown>) => {
    const identity = v.identity as Record<string, unknown> | undefined;
    const name = String(identity?.name ?? "").toLowerCase().trim();
    return name && !cleanedNames.has(name);
  });

  console.log(`Raw entries: ${raw.length}`);
  console.log(`Already in cleaned: ${raw.length - toImport.length}`);
  console.log(`To import: ${toImport.length}\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of toImport) {
    const identity = (item.identity ?? {}) as Record<string, unknown>;
    const content = (item.content ?? {}) as Record<string, unknown>;
    const classification = (item.classification ?? {}) as Record<string, unknown>;
    const contact = (item.contact ?? {}) as Record<string, unknown>;
    const metadata = (item.metadata ?? {}) as Record<string, unknown>;

    const name = String(identity.name ?? "").trim();
    if (!name) { skipped++; continue; }

    const slug = slugify(name);

    try {
      const existing = await prisma.verein.findUnique({ where: { slug } });
      if (existing) { skipped++; continue; }

      const rawTags: string[] = Array.isArray(classification.tags)
        ? (classification.tags as string[])
        : [];

      const category = inferCategory(rawTags);
      const cleanTags = mapToCleanTags(rawTags);

      const completeness = typeof metadata.completeness_score === "number"
        ? metadata.completeness_score
        : 0.3;

      await prisma.verein.create({
        data: {
          slug,
          name,
          type: String(identity.type ?? "Verein"),
          isCharitable: false,
          summary: String(content.summary ?? "").slice(0, 500) || null,
          description: String(content.description ?? content.summary ?? "").slice(0, 2000) || null,
          categories: JSON.stringify([category]),
          tags: JSON.stringify(cleanTags),
          district: String(classification.district ?? "").replace(" (General)", "").trim() || null,
          addressRaw: String(contact.address_raw ?? "") || null,
          email: String(contact.email ?? "") || null,
          website: String(contact.website ?? "") || null,
          source: String(metadata.source ?? "vereine.json"),
          originalUrl: String(metadata.original_url ?? "") || null,
          completenessScore: completeness,
          verification: String(metadata.verification ?? "raw"),
        },
      });

      success++;
    } catch (err) {
      failed++;
      console.error(`Failed: ${name}`, err);
    }
  }

  const total = await prisma.verein.count();
  console.log(`\nDone: +${success} added, ${skipped} skipped, ${failed} failed`);
  console.log(`Total in DB: ${total}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
