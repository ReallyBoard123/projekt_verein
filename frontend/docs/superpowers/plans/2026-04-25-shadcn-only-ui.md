# Shadcn-Only UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every raw HTML primitive used as a UI element (`<article>`, `<div>` cards, `<button>`, `<input>`, `<span>` chips) with their installed shadcn/ui counterparts — without changing visual appearance.

**Architecture:** File-by-file replacement. Each task touches exactly one component file. All existing `className` and `style` overrides are preserved or migrated onto the shadcn wrapper. Internal structure inside cards is kept as-is unless a direct sub-component (`CardHeader`, `CardContent`) is a clean fit. No new shadcn components are added — only the ones already installed (`badge`, `button`, `card`, `input`) are wired up. `avatar` has no usage and is left untouched (YAGNI).

**Tech Stack:** Next.js 16.2.4, shadcn/ui (base-nova style, `@base-ui/react`), Tailwind CSS v4, TypeScript

**Key component APIs (already installed):**
- `Button` — variants: `default | outline | secondary | ghost | destructive | link`; sizes: `default | xs | sm | lg | icon`. Backed by `@base-ui/react/button`, accepts all standard button attributes including `aria-pressed`.
- `Badge` — variants: `default | secondary | destructive | outline | ghost | link`. Renders as `<span>` via `useRender`. Default `h-5 text-xs rounded-4xl`.
- `Card` / `CardHeader` / `CardContent` / `CardFooter` / `CardTitle` — `Card` renders `<div>` with `ring-1 ring-foreground/10 rounded-xl bg-card flex flex-col gap-4 py-4`.
- `Input` — backed by `@base-ui/react/input`. Default `h-8 border border-input rounded-lg`.

**Verification approach:** No test suite exists. After each task, start `npm run dev` (or check running dev server) and visually confirm the affected page looks unchanged.

---

## File Map

| File | Change |
|------|--------|
| `app/vereine/[id]/page.tsx` | Remove dead `Separator` import (Task 1), then Card/Badge/Button (Task 8) |
| `components/HeroSection.tsx` | `Input` + `Button` for quick-chips (Task 2) |
| `components/FilterBar.tsx` | `Button` for filter pill chips (Task 3) |
| `components/ClubCard.tsx` | `Card` wrapper + `Badge` for tags (Task 4) |
| `components/EventCard.tsx` | `Card` wrapper + `Badge` for category label (Task 5) |
| `components/OnboardingPanel.tsx` | `Card` wrapper (Task 6) |
| `app/vereine/page.tsx` | `Button` for "Alle Filter" + footer CTAs (Task 7) |
| `app/vereine/[id]/page.tsx` | `Card` for sidebar/dept sections + `Badge` for labels + `Button` for action buttons (Task 8) |

---

## Task 1: Remove dead Separator import

**Files:**
- Modify: `app/vereine/[id]/page.tsx:23`

`Separator` is imported but never rendered anywhere in the JSX — dead import.

- [ ] **Step 1: Remove the dead import**

In `app/vereine/[id]/page.tsx`, remove line 23:

```typescript
// DELETE this line:
import { Separator } from "@/components/ui/separator";
```

The imports block should go from:
```typescript
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
```
to:
```typescript
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
```

- [ ] **Step 2: Verify TypeScript is happy**

```bash
npm run build 2>&1 | head -30
```
Expected: no TypeScript errors about Separator.

- [ ] **Step 3: Commit**

```bash
git add app/vereine/\[id\]/page.tsx
git commit -m "chore: remove unused Separator import in ClubDetailPage"
```

---

## Task 2: HeroSection — Input + Button for quick-filter chips

**Files:**
- Modify: `components/HeroSection.tsx`

Two changes in this file:
1. Replace raw `<input>` with shadcn `Input` (the search bar lives inside a custom-styled wrapper div that owns the border/radius; the Input must suppress its own border and height).
2. Replace raw `<button>` quick-filter chips with shadcn `Button`.

- [ ] **Step 1: Update imports**

Replace the top of `components/HeroSection.tsx`:
```typescript
// Before:
import { Button } from "@/components/ui/button";

// After:
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
```

- [ ] **Step 2: Replace the raw `<input>` with `Input`**

Find (lines 64–71):
```tsx
<input
  type="search"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  placeholder="Verein oder Sportart suchen …"
  className="flex-1 px-3 py-3 text-[15px] text-foreground bg-transparent outline-none placeholder:text-text-muted"
  aria-label="Verein oder Sportart suchen"
/>
```

Replace with:
```tsx
<Input
  type="search"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  placeholder="Verein oder Sportart suchen …"
  className="flex-1 px-3 py-3 h-auto text-[15px] text-foreground bg-transparent border-0 rounded-none focus-visible:ring-0 focus-visible:border-0 placeholder:text-text-muted"
  aria-label="Verein oder Sportart suchen"
/>
```

Key overrides: `h-auto` removes the default `h-8`, `border-0 rounded-none` removes Input's own border (the wrapper div owns it), `focus-visible:ring-0 focus-visible:border-0` prevents Input's focus ring from conflicting with the wrapper's border.

- [ ] **Step 3: Replace quick-filter chip `<button>` elements with `Button`**

Find (lines 87–109):
```tsx
<button
  key={chip}
  type="button"
  onClick={() => setActiveChip(chip)}
  aria-pressed={isActive}
  className={cn(
    "flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all",
    isActive
      ? "text-primary"
      : "border-border text-text-body hover:border-primary/50"
  )}
  style={{
    border: isActive ? "1.5px solid var(--primary)" : "1px solid var(--border)",
    background: isActive ? "rgb(13 92 99 / 0.08)" : "#fff",
  }}
>
  {isActive && (
    <Check size={12} strokeWidth={3} aria-hidden="true" />
  )}
  {chip}
</button>
```

Replace with:
```tsx
<Button
  key={chip}
  type="button"
  onClick={() => setActiveChip(chip)}
  aria-pressed={isActive}
  variant="ghost"
  className={cn(
    "flex items-center gap-1 px-3 py-1.5 h-auto rounded-full text-[13px] font-medium transition-all",
    isActive
      ? "text-primary"
      : "border-border text-text-body hover:border-primary/50 hover:bg-transparent"
  )}
  style={{
    border: isActive ? "1.5px solid var(--primary)" : "1px solid var(--border)",
    background: isActive ? "rgb(13 92 99 / 0.08)" : "#fff",
  }}
>
  {isActive && (
    <Check size={12} strokeWidth={3} aria-hidden="true" />
  )}
  {chip}
</Button>
```

`variant="ghost"` gives a transparent background base so the inline `style.background` controls color cleanly.

- [ ] **Step 4: Verify visually**

```bash
npm run dev
```
Open `http://localhost:3000/vereine`. The search bar should look identical. The quick-filter chips (Fußball, Kinder, Musik, Wandern, Kunst) should look and behave identically.

- [ ] **Step 5: Commit**

```bash
git add components/HeroSection.tsx
git commit -m "feat: replace raw input and chip buttons with shadcn Input and Button in HeroSection"
```

---

## Task 3: FilterBar — Button for filter pill chips

**Files:**
- Modify: `components/FilterBar.tsx`

Replace the 5 raw `<button>` filter chips with shadcn `Button`.

- [ ] **Step 1: Update imports**

```typescript
// Before:
import { cn } from "@/lib/utils";

// After:
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

- [ ] **Step 2: Replace raw `<button>` with `Button`**

Find (lines 18–31):
```tsx
<button
  key={filter}
  type="button"
  onClick={() => onChange(filter)}
  aria-pressed={isActive}
  className={cn(
    "px-4 py-1.5 rounded-full text-[13px] border transition-all",
    isActive
      ? "bg-primary text-primary-foreground border-primary font-semibold"
      : "bg-card text-text-body border-border hover:border-primary/50"
  )}
  style={{ borderWidth: isActive ? "1.5px" : "0.5px" }}
>
  {filter}
</button>
```

Replace with:
```tsx
<Button
  key={filter}
  type="button"
  onClick={() => onChange(filter)}
  aria-pressed={isActive}
  variant={isActive ? "default" : "outline"}
  className={cn(
    "px-4 py-1.5 h-auto rounded-full text-[13px] transition-all",
    isActive
      ? "font-semibold"
      : "bg-card text-text-body hover:bg-card hover:border-primary/50 hover:text-text-body"
  )}
  style={{ borderWidth: isActive ? "1.5px" : "0.5px" }}
>
  {filter}
</Button>
```

`variant="default"` gives active state (primary bg/text). `variant="outline"` gives inactive state (border, background). The `hover:bg-card hover:text-text-body` overrides prevent the outline variant's default hover from changing the background color on inactive chips.

- [ ] **Step 3: Verify visually**

Check `http://localhost:3000/vereine`. The 5 filter chips (Alle, Sport, Kinder, Kultur, ≤ 5 km) should look identical. Active/inactive toggle should work.

- [ ] **Step 4: Commit**

```bash
git add components/FilterBar.tsx
git commit -m "feat: replace raw button chips with shadcn Button in FilterBar"
```

---

## Task 4: ClubCard — Card wrapper + Badge for tags

**Files:**
- Modify: `components/ClubCard.tsx`

Two changes:
1. Replace `<article>` outer wrapper with `Card` (preserve all styling via className overrides).
2. Replace tag `<span>` chips and match-score `<div>` with `Badge`.

- [ ] **Step 1: Update imports**

```typescript
// Before:
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Club } from "@/types";
import { categoryIcon, categoryLabel } from "@/lib/club-utils";

// After:
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Club } from "@/types";
import { categoryIcon, categoryLabel } from "@/lib/club-utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
```

- [ ] **Step 2: Replace `<article>` with `<Card>`**

Find (lines 10–18):
```tsx
export default function ClubCard({ club }: ClubCardProps) {
  return (
    <article
      className="bg-card border border-border flex flex-col overflow-hidden"
      style={{
        borderRadius: "10px",
        borderWidth: "0.5px",
        boxShadow: "0 1px 6px rgba(13,92,99,0.05)",
      }}
    >
```

Replace with:
```tsx
export default function ClubCard({ club }: ClubCardProps) {
  return (
    <Card
      className="flex flex-col gap-0 py-0 ring-0 border border-border rounded-[10px] shadow-[0_1px_6px_rgba(13,92,99,0.05)]"
      style={{ borderWidth: "0.5px" }}
    >
```

And the closing `</article>` at the bottom becomes `</Card>`.

Key overrides on `Card`: `gap-0 py-0` removes the default `gap-4 py-4`, `ring-0` removes the default ring-border, `border border-border` restores the original border, `rounded-[10px]` overrides `rounded-xl`.

- [ ] **Step 3: Replace match-score `<div>` with `Badge`**

Find (lines 37–48):
```tsx
{club.matchScore > 0 && (
  <div
    className="flex items-center gap-1 px-2 py-1 rounded-full text-primary"
    style={{
      background: "rgb(13 92 99 / 0.07)",
      border: "1px solid rgb(13 92 99 / 0.25)",
    }}
  >
    <Star size={11} fill="currentColor" aria-hidden="true" />
    <span className="text-[12px] font-semibold">{club.matchScore} % Match</span>
  </div>
)}
```

Replace with:
```tsx
{club.matchScore > 0 && (
  <Badge
    className="flex items-center gap-1 px-2 py-1 h-auto rounded-full text-primary text-[12px] font-semibold"
    style={{
      background: "rgb(13 92 99 / 0.07)",
      border: "1px solid rgb(13 92 99 / 0.25)",
    }}
  >
    <Star size={11} fill="currentColor" aria-hidden="true" />
    {club.matchScore} % Match
  </Badge>
)}
```

- [ ] **Step 4: Replace tag `<span>` chips with `Badge`**

Find (lines 61–70):
```tsx
{club.tags.map((tag) => (
  <span
    key={tag}
    className="px-2 py-0.5 rounded text-[12px] font-medium text-chip-text"
    style={{
      background: "var(--chip-bg)",
      borderRadius: "4px",
    }}
  >
    {tag}
  </span>
))}
```

Replace with:
```tsx
{club.tags.map((tag) => (
  <Badge
    key={tag}
    variant="outline"
    className="px-2 py-0.5 h-auto rounded-[4px] text-[12px] font-medium bg-chip-bg text-chip-text border-0"
  >
    {tag}
  </Badge>
))}
```

`bg-chip-bg` and `text-chip-text` are Tailwind utilities mapped from the CSS tokens defined in `globals.css` `@theme inline` block.

- [ ] **Step 5: Verify visually**

Check `http://localhost:3000/vereine`. The club cards should look identical — same border, shadow, tag chips, and match badge.

- [ ] **Step 6: Commit**

```bash
git add components/ClubCard.tsx
git commit -m "feat: replace article/span/div with Card and Badge in ClubCard"
```

---

## Task 5: EventCard — Card wrapper + Badge for category label

**Files:**
- Modify: `components/EventCard.tsx`

Replace `<article>` with `Card`. Replace the category `<span>` with `Badge`.

- [ ] **Step 1: Update imports**

```typescript
// Before:
import { MapPin, Clock } from "lucide-react";
import type { ClubEvent } from "@/types";
import { formatEventDate } from "@/lib/club-utils";

// After:
import { MapPin, Clock } from "lucide-react";
import type { ClubEvent } from "@/types";
import { formatEventDate } from "@/lib/club-utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
```

- [ ] **Step 2: Replace `<article>` with `<Card>`**

Find (lines 12–19):
```tsx
return (
  <article
    className="bg-card border border-border flex overflow-hidden"
    style={{
      borderRadius: "10px",
      borderWidth: "0.5px",
      boxShadow: "0 1px 6px rgba(13,92,99,0.05)",
    }}
  >
```

Replace with:
```tsx
return (
  <Card
    className="flex flex-row gap-0 py-0 ring-0 border border-border rounded-[10px] shadow-[0_1px_6px_rgba(13,92,99,0.05)]"
    style={{ borderWidth: "0.5px" }}
  >
```

Note `flex-row` to override Card's default `flex-col`, and closing `</article>` → `</Card>`.

- [ ] **Step 3: Replace category `<span>` with `Badge`**

Find (line 31):
```tsx
<span className="text-[11px] font-semibold uppercase tracking-[0.8px] text-brand-accent">
  {event.category}
</span>
```

Replace with:
```tsx
<Badge
  variant="ghost"
  className="h-auto px-0 py-0 text-[11px] font-semibold uppercase tracking-[0.8px] text-brand-accent bg-transparent"
>
  {event.category}
</Badge>
```

`variant="ghost"` gives a transparent base. `px-0 py-0 h-auto` removes Badge's default padding/height so it matches the original inline text exactly.

- [ ] **Step 4: Verify visually**

Check `http://localhost:3000/vereine` — scroll to the "Kommende Events" section. Event cards should look identical.

- [ ] **Step 5: Commit**

```bash
git add components/EventCard.tsx
git commit -m "feat: replace article/span with Card and Badge in EventCard"
```

---

## Task 6: OnboardingPanel — Card wrapper

**Files:**
- Modify: `components/OnboardingPanel.tsx`

Replace the outermost wrapper `<div>` with `Card`.

- [ ] **Step 1: Update imports**

```typescript
// Before:
import { Button } from "@/components/ui/button";

// After:
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

- [ ] **Step 2: Replace wrapper `<div>` with `Card`**

Find (lines 40–48):
```tsx
return (
  <div
    className="bg-card border border-border flex flex-col gap-5 p-8"
    style={{
      borderRadius: "14px",
      borderWidth: "0.5px",
      boxShadow: "0 2px 16px rgba(13,92,99,0.07)",
    }}
  >
```

Replace with:
```tsx
return (
  <Card
    className="flex flex-col gap-5 p-8 py-8 ring-0 border border-border rounded-[14px] shadow-[0_2px_16px_rgba(13,92,99,0.07)]"
    style={{ borderWidth: "0.5px" }}
  >
```

And closing `</div>` at the bottom of the component → `</Card>`.

`p-8 py-8` overrides Card's default `py-4`. `ring-0 border border-border` replaces the default ring. `gap-5` overrides Card's `gap-4`.

- [ ] **Step 3: Verify visually**

Check `http://localhost:3000/vereine`. The onboarding panel on the right side of the hero should look identical — same padding, border, shadow, and content.

- [ ] **Step 4: Commit**

```bash
git add components/OnboardingPanel.tsx
git commit -m "feat: replace wrapper div with Card in OnboardingPanel"
```

---

## Task 7: vereine/page.tsx — Button for "Alle Filter" and footer CTA buttons

**Files:**
- Modify: `app/vereine/page.tsx`

Three raw `<button>` elements: "Alle Filter" (line 65), and two dark-themed footer CTAs (lines 129, 135).

- [ ] **Step 1: Add Button import**

```typescript
// Before (no Button import):
import HeroSection from "@/components/HeroSection";
import ClubCard from "@/components/ClubCard";
import EventCard from "@/components/EventCard";
import MapStrip from "@/components/MapStrip";
import FilterBar from "@/components/FilterBar";

// After:
import HeroSection from "@/components/HeroSection";
import ClubCard from "@/components/ClubCard";
import EventCard from "@/components/EventCard";
import MapStrip from "@/components/MapStrip";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
```

- [ ] **Step 2: Replace "Alle Filter" raw button**

Find (lines 64–69):
```tsx
<button
  className="px-4 py-2 rounded-lg text-[14px] font-medium text-primary transition-colors hover:bg-primary/5"
  style={{ border: "1px solid var(--primary)" }}
>
  Alle Filter
</button>
```

Replace with:
```tsx
<Button
  variant="outline"
  className="px-4 py-2 h-auto rounded-lg text-[14px] font-medium text-primary border-primary hover:bg-primary/5 hover:text-primary"
>
  Alle Filter
</Button>
```

- [ ] **Step 3: Replace footer CTA buttons**

Find (lines 129–140):
```tsx
<button
  className="px-6 py-3 rounded-lg text-white text-[14px] font-semibold transition-opacity hover:opacity-90"
  style={{ background: "var(--brand-accent)" }}
>
  Verein kostenlos eintragen
</button>
<button
  className="px-6 py-3 rounded-lg text-[14px] font-medium transition-colors hover:bg-white/5"
  style={{ border: "1px solid #2A4545", color: "#8AB5B5" }}
>
  Mehr erfahren
</button>
```

Replace with:
```tsx
<Button
  variant="ghost"
  className="px-6 py-3 h-auto rounded-lg text-white text-[14px] font-semibold hover:opacity-90 hover:bg-transparent hover:text-white"
  style={{ background: "var(--brand-accent)" }}
>
  Verein kostenlos eintragen
</Button>
<Button
  variant="ghost"
  className="px-6 py-3 h-auto rounded-lg text-[14px] font-medium hover:bg-white/5"
  style={{ border: "1px solid #2A4545", color: "#8AB5B5" }}
>
  Mehr erfahren
</Button>
```

`variant="ghost"` is the right base for both: transparent background, then inline `style` controls the actual colors. `hover:bg-transparent hover:text-white` locks the first button's hover to opacity-only change.

- [ ] **Step 4: Verify visually**

Check `http://localhost:3000/vereine`. The "Alle Filter" button and the dark footer buttons should look identical.

- [ ] **Step 5: Commit**

```bash
git add app/vereine/page.tsx
git commit -m "feat: replace raw buttons with shadcn Button in vereine listing page"
```

---

## Task 8: vereine/[id]/page.tsx — Card + Badge + Button

**Files:**
- Modify: `app/vereine/[id]/page.tsx`

Most complex task — multiple changes across the detail page:
1. Add `Card` and `Badge` imports (Button already imported)
2. Replace category label `<span>` with `Badge`
3. Replace match-score `<div>` with `Badge`
4. Replace "Speichern" and "Teilen" raw `<button>` with `Button`
5. Replace department card `<div>` wrappers with `Card`
6. Replace department "Anfragen" `<button>` with `Button`
7. Replace match-breakdown sidebar `<div>` with `Card`
8. Replace fees sidebar `<div>` with `Card`
9. Replace contact sidebar `<div>` with `Card`
10. Replace tag `<span>` chips with `Badge`
11. Replace "Offen für alle" `<div>` with `Badge`

- [ ] **Step 1: Update imports**

```typescript
// Before:
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// After:
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
```

- [ ] **Step 2: Replace category label `<span>` with `Badge`**

Find (line 96):
```tsx
<span className="text-[12px] font-semibold uppercase tracking-[0.8px] text-primary px-2 py-1 rounded bg-primary/10">
  {categoryLabel(club.category)}
</span>
```

Replace with:
```tsx
<Badge className="text-[12px] font-semibold uppercase tracking-[0.8px] text-primary px-2 py-1 h-auto rounded bg-primary/10 border-0">
  {categoryLabel(club.category)}
</Badge>
```

- [ ] **Step 3: Replace match-score `<div>` in the hero header with `Badge`**

Find (lines 99–109):
```tsx
{club.matchScore > 0 && (
  <div
    className="flex items-center gap-1 px-2 py-1 rounded-full text-primary text-[12px] font-semibold"
    style={{
      background: "rgb(13 92 99 / 0.07)",
      border: "1px solid rgb(13 92 99 / 0.25)",
    }}
  >
    <Star size={11} fill="currentColor" aria-hidden="true" />
    {club.matchScore} % Match
  </div>
)}
```

Replace with:
```tsx
{club.matchScore > 0 && (
  <Badge
    className="flex items-center gap-1 px-2 py-1 h-auto rounded-full text-primary text-[12px] font-semibold"
    style={{
      background: "rgb(13 92 99 / 0.07)",
      border: "1px solid rgb(13 92 99 / 0.25)",
    }}
  >
    <Star size={11} fill="currentColor" aria-hidden="true" />
    {club.matchScore} % Match
  </Badge>
)}
```

- [ ] **Step 4: Replace "Speichern" raw `<button>` with `Button`**

Find (lines 138–158):
```tsx
<button
  type="button"
  onClick={() => setSaved((s) => !s)}
  aria-pressed={saved}
  aria-label={saved ? "Gespeichert" : "Speichern"}
  className={cn(
    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-medium border transition-all",
    saved
      ? "text-primary border-primary/40"
      : "text-text-body border-border hover:border-primary/50"
  )}
  style={saved ? { background: "rgb(13 92 99 / 0.06)" } : {}}
>
  <Heart
    size={15}
    aria-hidden="true"
    className={saved ? "text-primary fill-primary" : ""}
  />
  {saved ? "Gespeichert" : "Speichern"}
</button>
<button
  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-medium border border-border text-text-body hover:border-primary/50 transition-all"
  aria-label="Verein teilen"
>
  <Share2 size={15} aria-hidden="true" />
  Teilen
</button>
```

Replace with:
```tsx
<Button
  type="button"
  onClick={() => setSaved((s) => !s)}
  aria-pressed={saved}
  aria-label={saved ? "Gespeichert" : "Speichern"}
  variant="outline"
  className={cn(
    "flex items-center gap-1.5 px-4 py-2 h-auto rounded-lg text-[14px] font-medium transition-all",
    saved
      ? "text-primary border-primary/40 hover:text-primary"
      : "text-text-body border-border hover:border-primary/50 hover:text-text-body"
  )}
  style={saved ? { background: "rgb(13 92 99 / 0.06)" } : {}}
>
  <Heart
    size={15}
    aria-hidden="true"
    className={saved ? "text-primary fill-primary" : ""}
  />
  {saved ? "Gespeichert" : "Speichern"}
</Button>
<Button
  variant="outline"
  className="flex items-center gap-1.5 px-4 py-2 h-auto rounded-lg text-[14px] font-medium border-border text-text-body hover:border-primary/50 hover:text-text-body transition-all"
  aria-label="Verein teilen"
>
  <Share2 size={15} aria-hidden="true" />
  Teilen
</Button>
```

- [ ] **Step 5: Replace department card `<div>` with `Card` and "Anfragen" `<button>` with `Button`**

Find each department card (lines 261–297). The outer `<div>`:
```tsx
<div
  key={dept.id}
  className="bg-card border border-border rounded-[10px] p-5"
  style={{ borderWidth: "0.5px" }}
>
```

Replace with:
```tsx
<Card
  key={dept.id}
  className="gap-0 py-0 p-5 ring-0 border border-border rounded-[10px]"
  style={{ borderWidth: "0.5px" }}
>
```

And closing `</div>` → `</Card>`.

Also find the "Anfragen" raw button inside each department card (line 289–293):
```tsx
<button
  className="w-full py-2 rounded-lg text-[13px] font-medium text-primary border border-primary transition-colors hover:bg-primary/5"
  style={{ background: "rgb(13 92 99 / 0.03)" }}
>
  Anfragen
</button>
```

Replace with:
```tsx
<Button
  variant="outline"
  className="w-full py-2 h-auto rounded-lg text-[13px] font-medium text-primary border-primary hover:bg-primary/5 hover:text-primary"
  style={{ background: "rgb(13 92 99 / 0.03)" }}
>
  Anfragen
</Button>
```

- [ ] **Step 6: Replace tag `<span>` chips in the About section with `Badge`**

Find (lines 241–249):
```tsx
{club.tags.map((tag) => (
  <span
    key={tag}
    className="px-3 py-1 text-[13px] font-medium text-chip-text"
    style={{ background: "var(--chip-bg)", borderRadius: "6px" }}
  >
    {tag}
  </span>
))}
```

Replace with:
```tsx
{club.tags.map((tag) => (
  <Badge
    key={tag}
    variant="outline"
    className="px-3 py-1 h-auto text-[13px] font-medium bg-chip-bg text-chip-text border-0 rounded-[6px]"
  >
    {tag}
  </Badge>
))}
```

- [ ] **Step 7: Replace "Offen für alle" `<div>` with `Badge`**

Find (lines 346–356):
```tsx
{event.isOpenForAll && (
  <div
    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold text-success-text shrink-0"
    style={{
      background: "var(--success-bg)",
      border: "1px solid var(--success-border)",
    }}
  >
    <Check size={11} aria-hidden="true" />
    Offen für alle
  </div>
)}
```

Replace with:
```tsx
{event.isOpenForAll && (
  <Badge
    className="flex items-center gap-1 px-2.5 py-1 h-auto rounded-full text-[12px] font-semibold text-success-text shrink-0"
    style={{
      background: "var(--success-bg)",
      border: "1px solid var(--success-border)",
    }}
  >
    <Check size={11} aria-hidden="true" />
    Offen für alle
  </Badge>
)}
```

- [ ] **Step 8: Replace match-breakdown sidebar `<div>` with `Card`**

Find (lines 370–377):
```tsx
<div
  className="rounded-[12px] p-5"
  style={{
    background: "rgb(13 92 99 / 0.05)",
    border: "1px solid rgb(13 92 99 / 0.18)",
  }}
>
```

Replace with:
```tsx
<Card
  className="gap-0 py-0 p-5 ring-0 rounded-[12px]"
  style={{
    background: "rgb(13 92 99 / 0.05)",
    border: "1px solid rgb(13 92 99 / 0.18)",
  }}
>
```

And closing `</div>` → `</Card>`.

- [ ] **Step 9: Replace fees sidebar `<div>` with `Card`**

Find (lines 400–405):
```tsx
<div
  className="bg-card border border-border rounded-[10px] p-5"
  style={{ borderWidth: "0.5px" }}
>
```

Replace with:
```tsx
<Card
  className="gap-0 py-0 p-5 ring-0 border border-border rounded-[10px]"
  style={{ borderWidth: "0.5px" }}
>
```

And closing `</div>` → `</Card>`.

- [ ] **Step 10: Replace contact sidebar `<div>` with `Card`**

Find (lines 434–438):
```tsx
<div
  className="bg-card border border-border rounded-[10px] overflow-hidden"
  style={{ borderWidth: "0.5px" }}
  id="kontakt"
>
```

Replace with:
```tsx
<Card
  className="gap-0 py-0 ring-0 border border-border rounded-[10px]"
  style={{ borderWidth: "0.5px" }}
  id="kontakt"
>
```

And closing `</div>` → `</Card>`.

- [ ] **Step 11: Verify visually**

```bash
npm run dev
```

Navigate to `http://localhost:3000/vereine` then click a club to open the detail page. Check:
- Hero header: category badge, match badge look correct
- Tags in "Über den Verein" section look correct
- Department cards render with correct border/padding
- "Anfragen" buttons inside department cards look correct
- Sidebar: match breakdown, fees, and contact sections render with correct border/background
- "Offen für alle" badge in event rows looks correct
- "Speichern" (togglable) and "Teilen" buttons work correctly

- [ ] **Step 12: Commit**

```bash
git add app/vereine/\[id\]/page.tsx
git commit -m "feat: replace raw div/button/span with Card, Badge, Button in ClubDetailPage"
```

---

## Final Verification

- [ ] **Run a TypeScript build check**

```bash
npm run build 2>&1
```

Expected: no type errors. If there are errors, they will be about missing imports or prop mismatches — fix inline before marking done.

- [ ] **Check for remaining raw UI elements**

```bash
grep -rn "^  <article\|^    <article\|^  <button\|^    <button" components/ app/ --include="*.tsx" | grep -v "node_modules"
```

Expected: no results (all raw `<article>` and `<button>` replaced). Any remaining hits are legitimate semantic elements (e.g., `<button>` inside a form with full custom styling not matching any shadcn variant).

- [ ] **Final commit**

```bash
git add -A
git commit -m "chore: final shadcn-only UI migration complete"
```

---

## Out of Scope

- **`avatar`** — installed but no avatar usage exists anywhere. Leave as-is (YAGNI).
- **`separator`** — only the dead import is removed (Task 1); no visual separator is needed anywhere.
- **`tabs`** — already wired up correctly in ClubDetailPage, no changes needed.
- **`progress`** — already wired up correctly in ClubDetailPage, no changes needed.
- **The stats row `<div>` cards** in ClubDetailPage (lines 200–228) — these are simple stat boxes, not the `Card` pattern. Converting them would add noise without benefit. Left as custom divs.
