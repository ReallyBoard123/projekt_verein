# Handoff: VereinsFinder — Civic Club Discovery Platform

## Overview

VereinsFinder is a civic engagement web platform helping residents of Kassel, Germany discover local clubs (Vereine) and events. Users can search and filter clubs, complete a short onboarding quiz to get AI-powered match recommendations, browse event listings, and view detailed club profiles.

## About the Design Files

The HTML files in this bundle are **high-fidelity design references built as React/Babel prototypes**. They are NOT production code — they exist solely to communicate the intended look, layout, interactions, and copy. Your task is to **recreate these designs in your target codebase** (e.g. Next.js, Remix, plain React) using its established conventions, routing system, component library, and data layer. Do not ship the HTML files directly.

## Fidelity

**High-fidelity.** The mocks include final colors, typography, spacing, component states, German copy, and interactions. Implement pixel-accurately using the design tokens listed below.

---

## Files in This Package

| File | Description |
|---|---|
| `VereinsFinder.html` | Main listing page — navbar, hero with search + onboarding panel, results grid, map strip, events section, admin footer |
| `VereinsFinder Detail.html` | Club detail page — header with tabs, stats, about, departments, events timeline, sidebar with match breakdown, fees, contact + mini map |

Open these in a browser to interact with the prototypes. Both pages are linked (Detail page has a "Zurück" breadcrumb back to the listing).

---

## Design Tokens

### Colors

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#0D5C63` | Primary actions, links, badges, icons, active states |
| `--color-accent` | `#B35C00` | Highlights, eyebrow labels, secondary CTAs |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-bg-panel` | `#E4F4F5` | Hero section, tinted panel backgrounds |
| `--color-bg-alt` | `#F5FAFA` | Events section background (slightly differentiated) |
| `--color-surface` | `#FFFFFF` | Cards, panels, inputs |
| `--color-border` | `#C5DEDE` | All card/input borders (0.5px) |
| `--color-border-light` | `#E8F0F0` | Dividers inside cards |
| `--color-text-primary` | `#0B1A1A` | Headings, primary body text |
| `--color-text-body` | `#3A5555` | Secondary body text, descriptions |
| `--color-text-muted` | `#7A9A9A` | Metadata, labels, placeholders |
| `--color-text-nav` | `#2A4545` | Nav links |
| `--color-chip-bg` | `#F0F9F9` | Tag/chip background |
| `--color-chip-text` | `#2A5555` | Tag/chip text |
| `--color-success-bg` | `#E8F5EE` | "Offen für alle" badge background |
| `--color-success-text` | `#2A7A52` | "Offen für alle" badge text |
| `--color-success-border` | `#B8DDC9` | "Offen für alle" badge border |

### Typography

| Role | Font | Size | Weight | Line-height | Notes |
|---|---|---|---|---|---|
| Logo / Brand | DM Serif Display | 20px | 400 | — | Serif display face |
| H1 (Hero) | DM Serif Display | 44px | 400 | 1.1 | `letter-spacing: -0.3px` |
| H2 (Section headings) | DM Serif Display | 32px | 400 | 1.2 | |
| H2 (Card headings) | DM Sans | 18px | 700 | — | |
| H3 (Club name in card) | DM Sans | 17px | 700 | — | |
| Body large | DM Sans | 17px | 400 | 1.6 | Hero subtitle |
| Body default | DM Sans | 15px | 400 | 1.55–1.7 | General descriptions |
| Body small | DM Sans | 14px | 400 | 1.55 | Card descriptions, contact rows |
| Label / Eyebrow | DM Sans | 13px | 600 | — | `text-transform: uppercase; letter-spacing: 0.8px` |
| Meta / Chip | DM Sans | 13px | 400–500 | — | Location, tags |
| Badge / Caption | DM Sans | 12px | 600–700 | — | Match %, category badges |
| Tiny | DM Sans | 11–12px | 500–600 | — | Map pin labels, progress text |

**Minimum font size: 14px for body text.**
Google Fonts import: `DM Sans` (400, 500, 600, 700) + `DM Serif Display`.

### Spacing

The layout uses an **8px base grid**.

| Token | Value |
|---|---|
| Page max-width | 1200px |
| Page horizontal padding | 48px |
| Section vertical padding | 64px |
| Card padding | 18–24px |
| Card gap (grid) | 20px |
| Sidebar gap | 24px |
| Hero column gap | 64px |
| Navbar height | 64px |

### Border Radius

| Context | Value |
|---|---|
| Cards | 10px (configurable 4–20px) |
| Panels / hero card | 14px |
| Buttons (primary CTA) | 8px |
| Filter buttons | 8px |
| Chips / pill filters | 20px (fully rounded) |
| Interest chips (onboarding) | 10px |
| Icon containers | 8px |
| Tags | 4–6px |
| Map strip | 14px |

### Shadows

| Context | Value |
|---|---|
| Cards | `0 1px 6px rgba(13,92,99,0.05)` |
| Hero onboarding panel | `0 2px 16px rgba(13,92,99,0.07)` |
| Map pins | `0 2px 8px rgba(13,92,99,0.2)` |
| Tooltip overlays | `0 1px 4px rgba(0,0,0,0.13)` |

### Borders

All borders use `0.5px` width with `#C5DEDE` color unless noted. Active/focus states use `1.5px` with the primary color.

---

## Screens

### 1. Listing Page (`VereinsFinder.html`)

#### Navbar
- Sticky, height 64px, white background, bottom border 0.5px `#C5DEDE`
- **Left:** Logo mark (32×32px, border-radius 8px, primary bg) + wordmark "VereineFinder" (DM Serif Display 20px — "Vereine" in primary, "Finder" in accent)
- **Center:** Nav links: Vereine / Events / Karte (DM Sans 15px 500). Active link has `2px solid primary` bottom border
- **Right:** Primary CTA button "Verein eintragen" with `+` icon

#### Hero Section
- Background: `#E4F4F5`, padding 64px 48px
- **Two equal columns** (CSS Grid `1fr 1fr`, gap 64px), vertically centered

**Left — Search:**
- Eyebrow label (13px 600, accent color, uppercase): "Kassel & Umgebung"
- H1 (DM Serif Display 44px): "Dein passender Verein in Kassel"
- Subtitle (17px, `#3A5555`, line-height 1.6)
- Search bar: flex row, `1.5px solid primary` border, radius 10px — icon left, text input center, "Suchen" button right (primary bg)
- Quick-filter chips: "Schnellfilter:" label + pill chips. **Selected chip: `1.5px solid primary` border + `primary 8%` bg + ✓ checkmark icon** (not color-only)

**Right — Onboarding panel ("Dein Vereins-Match"):**
- White card, border `0.5px #C5DEDE`, radius 14px, shadow, padding 32px
- Header: title (18px 700) + "KI-gestützt" label (12px, muted)
- Question: "Was interessiert dich?" (14px, body)
- 6 interest chips in a flex-wrap grid (90px wide each): Sport, Musik, Kinder, Kultur, Natur, Ehrenamt — each with icon + label
  - **Selected state: `2px solid primary` border + `primary 6%` bg + absolute ✓ badge (18×18px circle, primary bg) top-right** — not color-only
- Progress indicator:
  - 4 dots: completed = `primary` fill + 20px wide pill; pending = `#C5DEDE` 8px dot
  - Text label "Frage 2 von 4" (12px 500) — **always visible, not dot-only**
  - Sub-label: "Noch 2 Fragen, dann zeigen wir dir deine Treffer"
- "Weiter →" full-width primary button (13px padding, radius 8px)

#### Results Section
- White background, padding 64px 48px
- Section heading (DM Serif Display 32px) + result count subtitle
- "Alle Filter" ghost button (primary border/text) — top right
- **Filter bar:** pill buttons — Alle / Sport / Kinder / Kultur / ≤ 5 km. **Active: primary bg, white text, 1.5px border** — also uses font-weight change (400→600)
- **3-column card grid**, gap 20px

**Club Card anatomy:**
- Card: white, `0.5px #C5DEDE` border, radius (token), shadow
- Header strip (bottom border `0.5px #E8F0F0`): category icon container (32×32px, radius 8, `primary 8%` bg) + category label (12px 600 uppercase) — and match badge on the right
- **Match badge: `primary 7%` bg + `primary 25%` border + ⭐ icon + "{N} % Match" text** (never color alone)
- Body: club name (17px 700), location row with pin icon (13px muted), tags (chips: 12px 500, `#F0F9F9` bg, radius 4px), description (14px body), "Details →" link (14px 600 primary)

#### Map Strip
- Full-width, height 320px, radius 14px, border `0.5px #C5DEDE`
- Tinted background (`#E8F2F0`) with subtle diagonal stripe pattern
- SVG road lines (stroke `#C0D8D4`)
- 5 location pins (rotated square → teardrop, primary bg, white icon inside)
- Each pin has a white label tooltip below it
- "Kassel & Umgebung" label overlay (top-left, white card with pin icon)

#### Events Section
- Background: `#F5FAFA`, top border `0.5px #C5DEDE`, padding 64px 48px
- Section heading + subtitle
- **3-column event card grid**, gap 20px
- **Event card:** flex row — date block (primary bg, white text, left column with day abbr / day number / month) + content column (category badge, event name 15px 700, location + time rows with icons)

#### Admin Footer Banner
- Background: `#0B1A1A` (very dark teal-black), padding 56px 48px
- Two columns: heading (DM Serif Display 30px, white) + subtitle (16px, `#8AB5B5`) | buttons
- Primary CTA: accent bg (`#B35C00`) "Verein kostenlos eintragen"
- Ghost CTA: transparent, `#2A4545` border, `#8AB5B5` text "Mehr erfahren"

---

### 2. Club Detail Page (`VereinsFinder Detail.html`)

#### Breadcrumb Bar
- White bg, border-bottom `0.5px #E8F0F0`, padding 16px 48px
- "← Zurück zur Übersicht" (primary link) · "Vereine" (muted) · "FC Kassel Nordstadt" (body)

#### Hero Header
- Background: `#E4F4F5`, border-bottom `0.5px #C5DEDE`, padding 40px 48px 0
- Layout: logo placeholder (96×96px card, radius 16, primary icon) + title block + action buttons (right-aligned, flex)

**Title block:**
- Category badge + match badge (same pattern as listing card)
- H1: club name (DM Serif Display 38px, `letter-spacing: -0.3px`)
- Metadata row: location (with pin icon), member count (with users icon), founding year (with calendar icon) — all 14px `#3A5555`

**Action buttons (right):**
- "Speichern" toggle (heart icon): default = ghost; saved = primary tint border + primary tint bg + filled heart. **Uses `aria-pressed` for accessibility**
- "Teilen" ghost button (share icon)
- "Kontakt aufnehmen →" primary button

**Tab bar** (bottom of hero, flush with bottom edge):
- Tabs: Überblick / Abteilungen / Events / Kontakt
- Active tab: `2px solid primary` bottom border, primary text

#### Main Content (two-column grid: `1fr 340px`, gap 40px, padding 40px 48px)

**Left column:**

*Stats row (3-column grid):*
- Stat cards: white, border, radius 10px, padding 20px 24px
- Icon container (44×44px, radius 10, `primary 7%` bg) + value (22px 700) + label (13px muted)

*Über den Verein:*
- Section heading (18px 700)
- 2 paragraphs of body text (15px `#3A5555`, line-height 1.7)
- Tag row at bottom

*Abteilungen (2-column grid):*
- Department card: white, border, radius 10px
- Icon container + name (15px 700) + member count / age range (12px muted)
- Training times (each row: clock icon + text, 13px body)
- "Anfragen" full-width ghost button (primary border/text, `primary 3%` bg)

*Kommende Termine:*
- Heading + "Alle Termine →" link
- Event rows (bottom border separator): date column (52px wide — day abbr in primary 11px, number 22px 700, month 11px muted) + content column (event name 15px 600, location row) + optional "Offen für alle" pill badge (success green — **icon + text, not color only**)

**Right sidebar:**

*Match breakdown card* (`primary 5%` bg, `primary 18%` border, radius 12px):
- ⭐ icon + "95 % Match" heading (16px 700 primary)
- Explanatory text (13px body)
- 4 dimension rows: label + % value + progress bar (6px height, `primary 12%` track, primary fill)

*Mitgliedsbeitrag card:*
- White card, section heading
- 4 fee rows: group name + price (14px, price bold)
- Info callout box (`#F0F9F9` bg, info icon + note text 12px)

*Kontakt card:*
- Contact rows: icon container + label (12px muted) + value (14px 500 bold) — separated by 0.5px border
- Mini map placeholder (180px height, same pattern as main map strip)
- "Kontaktanfrage senden →" full-width primary button

---

## Interactions & Behavior

### Listing Page
- **Quick-filter chips:** single select; clicking a chip selects it (border + bg + checkmark icon appear)
- **Interest chips (onboarding):** multi-select toggle; checkmark badge appears/disappears on each chip
- **Filter bar (results):** single select; active button style switches
- **"Weiter →" button:** advances onboarding step (progress dots animate, step counter increments)
- **"Speichern" button (detail):** toggles saved state, aria-pressed updates

### Detail Page
- **Tab bar:** clicking a tab scrolls to the corresponding section (`#Überblick`, `#Abteilungen`, `#Events`, `#Kontakt`)
- **"Zurück zur Übersicht":** navigates back to listing page

### Hover States
- Buttons: slight brightness decrease (`filter: brightness(0.93)`) or background tint
- Nav links: color shifts toward primary
- Cards: no scale transform — use subtle shadow lift only (`box-shadow` transition)
- Links ("Details →", "Alle Termine →"): underline appears on hover

### Accessibility Requirements (CRITICAL)
- **Never use color as the only signal.** Every status must combine color + icon + text:
  - Match score: teal badge + ⭐ icon + "95 % Match" text
  - Selected chip: border highlight + ✓ checkmark icon
  - Progress: filled dot + "Frage 2 von 4" text label
  - "Offen für alle": green badge + ✓ icon + text label
- **Minimum contrast ratio:** 4.5:1 for all text on all backgrounds
- **Minimum touch target:** 44×44px for interactive elements
- **Keyboard navigation:** all interactive elements must be focusable and operable
- **`aria-pressed`** on the save/heart toggle button
- **Primary color `#0D5C63`** is teal-green, distinguishable for red-green color blind users (not pure green)

---

## State Management

### Listing page state
| State | Type | Initial | Description |
|---|---|---|---|
| `activeQuickChip` | `string` | `'Fußball'` | Currently selected quick-filter chip |
| `selectedInterests` | `string[]` | `['Musik']` | Multi-selected interest chips in onboarding panel |
| `activeFilter` | `string` | `'Alle'` | Active results filter tab |
| `currentOnboardingStep` | `number` | `2` | Current step in onboarding (1–4) |

### Detail page state
| State | Type | Initial | Description |
|---|---|---|---|
| `saved` | `boolean` | `false` | Whether the club is saved to user's list |
| `activeTab` | `string` | `'Überblick'` | Active detail tab |

---

## Assets & Icons

All icons are inline SVG — 24×24 viewBox, 2px stroke, round linecap/linejoin. No icon library dependency. Recommended replacements: **Lucide React** or **Heroicons** (both match the same visual style).

Icons used:
`search`, `check`, `star`, `mapPin`, `arrow`, `arrowLeft`, `users`, `music`, `ball` (soccer), `heart`, `heartFill`, `book`, `palette`, `tree`, `calendar`, `clock`, `tag`, `plus`, `menu`, `running`, `child`, `phone`, `mail`, `globe`, `share`, `trophy`, `info`

No external image assets. Club logo, map, and imagery are placeholders — replace with real assets in production.

---

## Routing

| Route | Component | Notes |
|---|---|---|
| `/` or `/vereine` | Listing page | Default landing |
| `/vereine/:id` | Detail page | Dynamic club ID |

---

## Copy Notes

All copy is in **German (de-DE)**. Key strings:

- Platform name: "VereinsFinder" (one word, Finder with capital F)
- Tagline: "Dein passender Verein in Kassel"
- Onboarding CTA: "Weiter →"
- Match label: "{N} % Match" (space before %)
- Save: "Speichern" / "Gespeichert"
- Back: "Zurück zur Übersicht"
- Footer: "Euer Verein fehlt?" / "Verein kostenlos eintragen"
