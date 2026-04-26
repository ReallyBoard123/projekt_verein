import type { Club } from "@/types";

// ---------------------------------------------------------------------------
// Interest → DB tag mapping
// ---------------------------------------------------------------------------
const INTERESTS_TO_TAGS: Record<string, string[]> = {
  sport: [
    "Sport", "Fitness", "Turnen", "Fußball", "Basketball", "Handball",
    "Tennis", "Klettern", "Bouldern", "Rudern", "Kajak", "Kanu", "Segeln",
    "Windsurfing", "Skateboard", "Parkour", "Freerunning", "Boxen",
    "Kampfsport", "Kampfkunst", "WingTsun", "Fechten", "Selbstverteidigung",
    "Billard", "Carambolage", "Breitensport", "Leistungssport", "Schulsport",
    "Vereinssport", "Wassersport", "Indoor-Sport", "Urban Sports", "Tanz",
    "Choreografie", "Pilates", "Gymnastik", "Gesundheitssport", "Bewegung",
    "Hundesport", "Stockkampf", "Präzisionssport", "Mannschaftssport",
  ],
  musik_kunst: [
    "Musik", "Chor", "Orchester", "Jazz", "Klassik", "Kammermusik",
    "Blasmusik", "Blasorchester", "Jugendorchester", "Kirchenmusik",
    "Geistliche Musik", "Chormusik", "A-cappella", "Fanfarenzug",
    "Brass Band", "Volksmusik", "Neue Musik", "Zeitgenössische Musik",
    "Musiktheater", "Musical", "Musikunterricht", "Instrumentalunterricht",
    "Gesang", "Musikbildung", "Musikförderung", "Live-Musik", "Konzerte",
    "Kabarett", "Kleinkunst", "Theater", "Theaterpädagogik", "Schauspiel",
    "Jugendtheater", "Kindertheater", "Erzähltheater",
    "Kunst", "Bildende Kunst", "Malerei", "Bildhauerei", "Fotografie",
    "Galerie", "Ausstellungen", "Kunstpädagogik", "Kulturbildung",
    "Zeitgenössische Kunst", "Medienkunst", "Film", "Filmkultur",
    "Dokumentarfilm", "Programmkino", "Kino", "Literatur", "Lesen",
    "Schreibwerkstatt", "Kreatives Schreiben", "Performance",
    "Zeitgenössischer Tanz", "Experimentell",
  ],
  technik: [
    "DIY", "Reparatur", "Kreislaufwirtschaft", "Medienpädagogik", "Medien",
    "Radio", "Bürgerfunk", "Tonstudio", "Film",
  ],
  soziales: [
    "Soziales", "Ehrenamt", "Freiwilligenarbeit", "Nachbarschaft",
    "Nachbarschaftshilfe", "Integration", "Flüchtlingshilfe",
    "Jugendarbeit", "Jugendförderung", "Jugendhilfe", "Kinderhilfe",
    "Kinderrechte", "Kinderbetreuung", "Kinderladen", "Elterninitiative",
    "Eltern-Kind", "Familienarbeit", "Familienberatung", "Beratung",
    "Selbsthilfe", "Altenhilfe", "Ambulante Pflege", "Pflege",
    "Behindertenarbeit", "Inklusion", "Empowerment", "Mädchenarbeit",
    "Frauen", "Obdachlosenhilfe", "Lebensmittelhilfe", "Armut",
    "Notfallhilfe", "Opferhilfe", "Antirassismus", "Graswurzel",
    "Zivilgesellschaft", "Gemeinnützig", "Gemeinschaft", "Vernetzung",
    "Bürgerbeteiligung",
  ],
  natur: [
    "Natur", "Outdoor", "Wandern", "Naturschutz", "Klimaschutz",
    "Nachhaltigkeit", "Umweltbildung", "Umweltpolitik", "Ökologie",
    "Gartenbau", "Kleingarten", "Gärtnern", "Naherholung", "Fahrrad",
    "Radverkehr", "Bergsteigen", "Wassersport", "Rudern", "Kanu",
    "Kajak", "Segeln", "Windsurfing", "Wanderfahrten", "Transition",
  ],
  sonstiges: [
    "Brettspiele", "Gesellschaftsspiele", "Hundesport", "Hundezucht",
    "Hundeausbildung", "Stammtisch", "Freizeit", "Freizeitgestaltung",
    "Freizeitangebote", "Vereinsleben", "Kulinarik",
  ],
};

// Direct category matches per interest (strong signal, reliable)
const INTEREST_TO_CATEGORIES: Record<string, string[]> = {
  sport:       ["Sport"],
  musik_kunst: ["Musik", "Kunst", "Kultur"],
  technik:     ["Technik"],
  soziales:    ["Soziales", "Jugend"],
  natur:       ["Umwelt"],
  sonstiges:   [],
};

// Tag sets for fake dimensions
const INTENSE_TAGS    = new Set(["Leistungssport", "Wettkampf", "Profitraining", "Olympisch"]);
const COMMUNITY_TAGS  = new Set(["Ehrenamt", "Freiwilligenarbeit", "Nachbarschaftshilfe", "Lebensmittelhilfe", "Graswurzel", "Gemeinnützig"]);
const EVENING_TAGS    = new Set(["Konzerte", "Kabarett", "Theater", "Kino", "Programmkino", "Kleinkunst", "Live-Musik", "Stammtisch"]);
const TEAM_TAGS       = new Set(["Orchester", "Chor", "Ensemble", "Blasorchester", "Mannschaftssport"]);
const WORKSHOP_TAGS   = new Set(["Kurse", "Workshops", "Musikunterricht", "Instrumentalunterricht", "Kunstpädagogik", "Theaterpädagogik", "Weiterbildung"]);
const KIDS_TAGS       = new Set(["Kinder", "Jugend", "Kinderbetreuung", "Kindertheater", "Jugendarbeit", "Jugendförderung", "Eltern-Kind", "Kinderladen"]);
const SENIOR_TAGS     = new Set(["Altenhilfe", "Senioren", "Ambulante Pflege", "Osteoporose"]);

function hasTag(club: Club, set: Set<string>): boolean {
  return club.tags.some((t) => set.has(t));
}

// ---------------------------------------------------------------------------
// Core scoring — produces a spread from ~28 (weak match) to ~95 (perfect)
// ---------------------------------------------------------------------------
export function computeMatchScore(
  club: Club,
  answers: Record<string, unknown>
): number {
  const interests = (answers.interests as string[] | undefined) ?? [];

  // ── 1. INTEREST MATCHING (0–55 pts) ─────────────────────────────────────
  //
  // Two signals combined:
  //   a) Category-level match: reliable, coarse (0–20 pts per interest)
  //   b) Tag-level match: granular, counts every matching tag (0–5 pts each)
  //
  // This creates a real spread:
  //   Sport club with 6 sport tags + category match = 20 + 30 = 50 pts
  //   Sport club with 1 tag, wrong category          = 0  + 5  = 5 pts

  let interestPts = 0;
  let anyInterestMatch = false;
  const tagSet = new Set(club.tags.map((t) => t.toLowerCase()));

  for (const interest of interests) {
    // Category match (20 pts per matching interest)
    const cats = INTEREST_TO_CATEGORIES[interest] ?? [];
    const catMatch = cats.includes(club.category);
    if (catMatch) interestPts += 20;

    // Tag density (5 pts per matching tag, up to 15 per interest)
    const mapped = (INTERESTS_TO_TAGS[interest] ?? []).map((t) =>
      t.toLowerCase()
    );
    const tagHits = mapped.filter((m) => tagSet.has(m)).length;
    interestPts += Math.min(tagHits * 5, 15);

    if (catMatch || tagHits > 0) anyInterestMatch = true;
  }

  // No interest selected → neutral scoring, use fake dims only
  if (interests.length > 0 && !anyInterestMatch) {
    return 0; // Caller filters these out; if they slip through, hide them
  }

  interestPts = Math.min(interestPts, 55);

  // ── 2. DATA QUALITY BOOST (0–15 pts) ────────────────────────────────────
  //
  // Curated entries (completenessScore ≈ 0.95) get ~14 pts.
  // Raw stubs (completenessScore ≈ 0.30) get ~4 pts.
  // This ensures rich entries naturally surface above empty stubs
  // when interest scores are close.

  const qualityPts = Math.round((club.completenessScore ?? 0.3) * 15);

  // ── 3. AUDIENCE (0–10 pts) ───────────────────────────────────────────────
  const audience = answers.audience as string | undefined;
  let audiencePts = 0;
  if ((audience === "child" || audience === "youth") && hasTag(club, KIDS_TAGS))   audiencePts = 10;
  if (audience === "senior" && hasTag(club, SENIOR_TAGS))                           audiencePts = 10;
  if (audience === "adult"  && !hasTag(club, KIDS_TAGS) && !hasTag(club, SENIOR_TAGS)) audiencePts = 5;

  // ── 4. ACTIVITY LEVEL (0–8 pts) — fake but plausible ────────────────────
  const activityLevel = answers.activity_level as string | undefined;
  const isSportCat = club.category === "Sport";
  let activityPts = 0;
  if (activityLevel === "high")     activityPts = hasTag(club, INTENSE_TAGS) ? 8 : isSportCat ? 4 : 0;
  else if (activityLevel === "chill")    activityPts = !isSportCat ? 6 : 0;
  else if (activityLevel === "moderate") activityPts = 4;

  // ── 5. EXPERIENCE (0–7 pts) — fake ──────────────────────────────────────
  const experience = answers.experience as string | undefined;
  let expPts = 0;
  if (experience === "pro"          && hasTag(club, INTENSE_TAGS)) expPts = 7;
  else if (experience === "none"    && hasTag(club, WORKSHOP_TAGS)) expPts = 7;
  else if (experience === "intermediate")                            expPts = 4;

  // ── 6. COMMITMENT (0–6 pts) — fake ──────────────────────────────────────
  const commitment = answers.commitment as string | undefined;
  let commitPts = 0;
  if (commitment === "regular_required" && hasTag(club, INTENSE_TAGS)) commitPts = 6;
  else if (commitment === "trial"       && hasTag(club, WORKSHOP_TAGS)) commitPts = 5;
  else if (commitment === "regular_voluntary")                            commitPts = 4;

  // ── 7. BUDGET (0–5 pts) — fake ──────────────────────────────────────────
  const budget = answers.budget as string | undefined;
  let budgetPts = 0;
  if (budget === "free" && hasTag(club, COMMUNITY_TAGS)) budgetPts = 5;
  else if (budget === "flexible")                         budgetPts = 3;
  else if (budget === "10euro" || budget === "30euro")    budgetPts = 3;

  // ── 8. GROUP SIZE (0–5 pts) — fake ──────────────────────────────────────
  const groupSize = answers.group_size as string | undefined;
  let groupPts = 0;
  if (groupSize === "large" && hasTag(club, TEAM_TAGS))       groupPts = 5;
  else if (groupSize === "small" && !hasTag(club, TEAM_TAGS)) groupPts = 4;
  else if (groupSize === "egal")                               groupPts = 2;

  // ── 9. SCHEDULE (0–4 pts) — fake ────────────────────────────────────────
  const schedule = (answers.schedule as string[] | undefined) ?? [];
  let schedulePts = 0;
  if (schedule.includes("evening") && hasTag(club, EVENING_TAGS)) schedulePts += 4;
  if (schedule.includes("weekend") && isSportCat)                  schedulePts += 3;
  if (schedule.includes("flexible"))                               schedulePts += 1;
  schedulePts = Math.min(schedulePts, 4);

  // ── TOTAL & NORMALISE ────────────────────────────────────────────────────
  //
  // Max raw ≈ 55 + 15 + 10 + 8 + 7 + 6 + 5 + 5 + 4 = 115
  // Map to display range 32–96 so badges always look meaningful

  const raw = interestPts + qualityPts + audiencePts + activityPts +
              expPts + commitPts + budgetPts + groupPts + schedulePts;

  const normalised = Math.round((raw / 115) * 64) + 32;
  return Math.min(Math.max(normalised, 32), 96);
}

// ---------------------------------------------------------------------------
// Expand wizard interest IDs into real DB tag strings for filtering
// ---------------------------------------------------------------------------
export function expandInterestTags(interests: string[]): string[] {
  return interests.flatMap((i) => INTERESTS_TO_TAGS[i] ?? []);
}
