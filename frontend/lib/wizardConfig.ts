import {
  Baby,
  User,
  Users,
  History,
  Euro,
  Calendar,
  Clock,
  Accessibility,
  MapPin,
  Smile,
  ShieldCheck,
  Activity,
  UserCheck,
} from "lucide-react";

export type QuestionType = "single" | "multi" | "transition" | "finish";

export interface WizardOption {
  id: string;
  label: string;
  emoji?: string;
}

export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options?: WizardOption[];
  minSelect?: number;
  columns?: number;
}

export const WIZARD_STEPS: WizardStep[] = [
  // BLOCK A: Basics
  {
    id: "audience",
    title: "Für wen suchst du eine Freizeitaktivität?",
    type: "single",
    options: [
      { id: "child", label: "Kind (0–12)" },
      { id: "youth", label: "Jugend (13–17)" },
      { id: "adult", label: "Erwachsen (18–64)" },
      { id: "senior", label: "Senior (65+)" },
    ],
  },
  {
    id: "interests",
    title: "Was interessiert dich grundsätzlich?",
    type: "multi",
    minSelect: 3,
    columns: 2,
    options: [
      { id: "sport", label: "Sport", emoji: "⚽" },
      { id: "musik_kunst", label: "Musik / Kunst", emoji: "🎵" },
      { id: "technik", label: "Technik / Handwerk", emoji: "🛠️" },
      { id: "soziales", label: "Soziales / Ehrenamt", emoji: "🤝" },
      { id: "natur", label: "Natur / Outdoor", emoji: "🌿" },
      { id: "sonstiges", label: "Sonstiges", emoji: "✨" },
    ],
  },
  {
    id: "distance",
    title: "Wie weit würdest du fahren?",
    type: "single",
    options: [
      { id: "5km", label: "bis 5 km" },
      { id: "10km", label: "bis 10 km" },
      { id: "20km", label: "bis 20 km" },
      { id: "50km", label: "bis 50 km" },
      { id: "flexible", label: "egal / sehr flexibel" },
    ],
  },
  {
    id: "budget",
    title: "Welches Budget hast du zur Verfügung?",
    type: "single",
    options: [
      { id: "free", label: "kostenlos" },
      { id: "10euro", label: "bis 10 € / Monat" },
      { id: "30euro", label: "10–30 € / Monat" },
      { id: "100euro", label: "30–100 € / Monat" },
      { id: "flexible", label: "egal" },
    ],
  },
  {
    id: "entry_costs",
    title: "Wie wichtig sind dir geringe Einstiegskosten?",
    subtitle: "(z.B. Ausrüstung, Aufnahmegebühr)",
    type: "single",
    options: [
      { id: "very", label: "Sehr wichtig (lieber leihen/günstig)" },
      { id: "neutral", label: "Egal / Kommt darauf an" },
    ],
  },
  {
    id: "seasonal",
    title: "Suchst du etwas Saisonales?",
    type: "single",
    options: [
      { id: "yes", label: "Nur saisonal (z.B. Winter/Sommer)" },
      { id: "no", label: "Ganzjährig" },
      { id: "egal", label: "Egal" },
    ],
  },
  {
    id: "time_per_week",
    title: "Wie viel Zeit willst du pro Woche investieren?",
    type: "single",
    options: [
      { id: "occasionally", label: "einmalig / gelegentlich" },
      { id: "2h", label: "bis 2 Stunden" },
      { id: "4h", label: "2–4 Stunden" },
      { id: "6h", label: "4–6 Stunden" },
      { id: "more", label: "mehr als 6 Stunden" },
    ],
  },
  {
    id: "schedule",
    title: "Wann hast du Zeit?",
    type: "multi",
    options: [
      { id: "weekday", label: "nur unter der Woche" },
      { id: "evening", label: "nur abends" },
      { id: "weekend", label: "nur Wochenende" },
      { id: "flexible", label: "flexibel" },
      { id: "irregular", label: "Schicht-/unregelmäßig" },
    ],
  },
  {
    id: "commitment",
    title: "Wie verbindlich soll es sein?",
    type: "single",
    options: [
      { id: "trial", label: "einmalig / Schnuppern" },
      { id: "loose", label: "lose Teilnahme ohne Verpflichtung" },
      { id: "regular_voluntary", label: "regelmäßige Teilnahme (freiwillig)" },
      { id: "regular_required", label: "regelmäßige Teilnahme erforderlich" },
    ],
  },
  {
    id: "experience",
    title: "Wie viel Erfahrung hast du?",
    type: "single",
    options: [
      { id: "none", label: "Keine/ wenig" },
      { id: "intermediate", label: "leicht fortgeschritten" },
      { id: "experienced", label: "erfahren" },
      { id: "pro", label: "Profi" },
    ],
  },
  {
    id: "activity_level",
    title: "Wie sportlich aktiv soll es sein?",
    type: "single",
    options: [
      { id: "chill", label: "Eher gemütlich / Denksport" },
      { id: "moderate", label: "Moderates Training" },
      { id: "high", label: "Leistungssportlich / Intensiv" },
    ],
  },
  {
    id: "group_size",
    title: "Wie möchtest du aktiv sein?",
    type: "single",
    options: [
      { id: "alone", label: "allein / individuell" },
      { id: "small", label: "kleine Gruppe" },
      { id: "large", label: "großes Team / Verein" },
      { id: "egal", label: "egal / gemischt" },
    ],
  },

  // TRANSITION
  {
    id: "transition_accessibility",
    title: "Gibt es spezifische Bedürfnisse?",
    subtitle: "Sollen wir Barrierefreiheit oder Reizfaktoren berücksichtigen?",
    type: "transition",
    options: [
      { id: "yes", label: "Ja, bitte berücksichtigen" },
      { id: "no", label: "Nein, direkt zu den Ergebnissen" },
    ],
  },

  // BLOCK B: Deep Dive (Optional/Accessibility)
  {
    id: "limitations",
    title: "Gibt es Einschränkungen?",
    type: "multi",
    options: [
      { id: "none", label: "keine Einschränkungen" },
      { id: "light", label: "leichte Einschränkungen (Belastbarkeit)" },
      { id: "strong", label: "starke Einschränkungen (barrierefrei)" },
    ],
  },
  {
    id: "physical_barriers",
    title: "Physische Barrieren vermeiden",
    type: "multi",
    options: [
      { id: "wheelchair", label: "Rollstuhlgerecht" },
      { id: "stairs", label: "Keine Treppen" },
      { id: "distances", label: "Kurze Wege (kein langes Laufen)" },
    ],
  },
  {
    id: "psychological_barriers",
    title: "Psychische & Umgebungs-Barrieren",
    type: "multi",
    options: [
      { id: "noise", label: "Geringe Lautstärke" },
      { id: "social_anxiety", label: "Wenig soziale Interaktion / Rückzug" },
      { id: "uncluttered", label: "Übersichtliche Umgebung" },
    ],
  },
  {
    id: "triggers",
    title: "Trigger & Sensibilitäten",
    type: "multi",
    options: [
      { id: "shouting", label: "Kein Schreien / Hektik" },
      { id: "changing_rooms", label: "Private Umkleiden / Duschen" },
      { id: "toilets", label: "Inklusive Toiletten" },
    ],
  },
  {
    id: "transit",
    title: "Anbindung mit Öffis?",
    type: "single",
    options: [
      { id: "required", label: "Zwingend erforderlich" },
      { id: "preferred", label: "Wäre gut" },
      { id: "unimportant", label: "Egal" },
    ],
  },
];
