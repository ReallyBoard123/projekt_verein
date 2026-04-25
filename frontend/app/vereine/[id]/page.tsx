"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Heart,
  Share2,
  Phone,
  Mail,
  Globe,
  Star,
  Clock,
  Check,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getClub } from "@/lib/api";
import type { Club } from "@/types";
import { categoryLabel, formatEventDate } from "@/lib/club-utils";
import { cn } from "@/lib/utils";

const MATCH_DIMENSIONS = [
  { label: "Interessen", value: 98 },
  { label: "Standort", value: 92 },
  { label: "Altersgruppe", value: 95 },
  { label: "Beitragsrahmen", value: 90 },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ClubDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [club, setClub] = useState<Club | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("überblick");

  useEffect(() => {
    getClub(id).then(setClub).catch(console.error);
  }, [id]);

  if (!club) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <p className="text-text-muted text-[15px]">Wird geladen …</p>
      </main>
    );
  }

  return (
    <main>
      {/* Breadcrumb */}
      <div
        className="px-12 py-4 bg-background"
        style={{ borderBottom: "0.5px solid #E8F0F0" }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-[14px]">
          <Link href="/vereine" className="text-primary flex items-center gap-1 hover:underline">
            <ArrowLeft size={14} aria-hidden="true" />
            Zurück zur Übersicht
          </Link>
          <span className="text-text-muted">·</span>
          <span className="text-text-muted">Vereine</span>
          <span className="text-text-muted">·</span>
          <span className="text-text-body">{club.name}</span>
        </div>
      </div>

      {/* Hero header */}
      <div
        className="px-12 pt-10"
        style={{ background: "var(--bg-panel)", borderBottom: "0.5px solid var(--border)" }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-start gap-6 mb-6">
            {/* Logo placeholder */}
            <div
              className="w-24 h-24 bg-card border border-border flex items-center justify-center text-primary shrink-0"
              style={{ borderRadius: "16px" }}
              aria-hidden="true"
            >
              <Users size={40} />
            </div>

            {/* Title block */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[12px] font-semibold uppercase tracking-[0.8px] text-primary px-2 py-1 rounded bg-primary/10">
                  {categoryLabel(club.category)}
                </span>
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
              </div>

              <h1
                className="text-[38px] leading-[1.1] text-foreground"
                style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.3px" }}
              >
                {club.name}
              </h1>

              <div className="flex items-center gap-5 mt-2 text-[14px] text-text-body">
                <span className="flex items-center gap-1">
                  <MapPin size={14} aria-hidden="true" />
                  {club.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} aria-hidden="true" />
                  {club.memberCount} Mitglieder
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} aria-hidden="true" />
                  Gegründet {club.foundingYear}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
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
              <Button>Kontakt aufnehmen →</Button>
            </div>
          </div>

          {/* Tab bar */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-0 gap-0 h-auto p-0">
              {["überblick", "abteilungen", "events", "kontakt"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={cn(
                    "capitalize rounded-none px-5 py-3 text-[15px] font-medium border-b-2 data-[state=active]:shadow-none",
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-text-nav hover:text-foreground"
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main content */}
      <div className="px-12 py-10 bg-background">
        <div
          className="max-w-[1200px] mx-auto grid gap-10"
          style={{ gridTemplateColumns: "1fr 340px" }}
        >
          {/* Left column */}
          <div className="flex flex-col gap-8" id="überblick">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-5">
              {[
                { icon: <Users size={20} />, value: club.memberCount, label: "Mitglieder" },
                { icon: <Calendar size={20} />, value: club.foundingYear, label: "Gegründet" },
                {
                  icon: <Star size={20} />,
                  value: `${club.matchScore} %`,
                  label: "Match-Score",
                },
              ].map(({ icon, value, label }) => (
                <div
                  key={label}
                  className="bg-card border border-border rounded-[10px] p-5 flex items-center gap-4"
                  style={{ borderWidth: "0.5px" }}
                >
                  <div
                    className="w-11 h-11 rounded-[10px] flex items-center justify-center text-primary shrink-0"
                    style={{ background: "rgb(13 92 99 / 0.07)" }}
                    aria-hidden="true"
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-[22px] font-bold text-foreground leading-tight">{value}</p>
                    <p className="text-[13px] text-text-muted">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* About */}
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-[18px] font-bold text-foreground mb-3">
                Über den Verein
              </h2>
              <p className="text-[15px] text-text-body leading-[1.7]">{club.description}</p>
              <p className="text-[15px] text-text-body leading-[1.7] mt-3">
                Wir sind offen für alle – egal ob Anfänger oder Erfahrene. Komm einfach zu einem
                unserer Trainings und schnupper rein. Anmeldung vorab nicht notwendig.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {club.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-[13px] font-medium text-chip-text"
                    style={{ background: "var(--chip-bg)", borderRadius: "6px" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Departments */}
            {club.departments.length > 0 && (
              <section aria-labelledby="depts-heading" id="abteilungen">
                <h2 id="depts-heading" className="text-[18px] font-bold text-foreground mb-4">
                  Abteilungen
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {club.departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="bg-card border border-border rounded-[10px] p-5"
                      style={{ borderWidth: "0.5px" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-primary"
                          style={{ background: "rgb(13 92 99 / 0.08)" }}
                          aria-hidden="true"
                        >
                          <Users size={16} />
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-foreground">{dept.name}</p>
                          <p className="text-[12px] text-text-muted">
                            {dept.memberCount} Mitglieder · {dept.ageRange}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 mb-4">
                        {dept.trainingTimes.map((t) => (
                          <div key={t} className="flex items-center gap-1.5 text-[13px] text-text-body">
                            <Clock size={12} aria-hidden="true" className="text-text-muted" />
                            {t}
                          </div>
                        ))}
                      </div>
                      <button
                        className="w-full py-2 rounded-lg text-[13px] font-medium text-primary border border-primary transition-colors hover:bg-primary/5"
                        style={{ background: "rgb(13 92 99 / 0.03)" }}
                      >
                        Anfragen
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Events */}
            {club.events.length > 0 && (
              <section aria-labelledby="events-heading" id="events">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="events-heading" className="text-[18px] font-bold text-foreground">
                    Kommende Termine
                  </h2>
                  <Link href="#" className="text-[14px] font-medium text-primary hover:underline">
                    Alle Termine →
                  </Link>
                </div>
                <div className="flex flex-col">
                  {club.events.map((event, i) => {
                    const { dayAbbr, day, month, time } = formatEventDate(event.date);
                    return (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 py-4"
                        style={
                          i < club.events.length - 1
                            ? { borderBottom: "0.5px solid var(--border-light)" }
                            : {}
                        }
                      >
                        {/* Date column */}
                        <div className="w-[52px] shrink-0 text-center">
                          <p className="text-[11px] font-semibold text-primary uppercase">{dayAbbr}</p>
                          <p className="text-[22px] font-bold text-foreground leading-tight">{day}</p>
                          <p className="text-[11px] text-text-muted">{month}</p>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <p className="text-[15px] font-semibold text-foreground">{event.name}</p>
                          <div className="flex items-center gap-1 text-text-muted mt-0.5">
                            <MapPin size={12} aria-hidden="true" />
                            <span className="text-[13px]">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-text-muted">
                            <Clock size={12} aria-hidden="true" />
                            <span className="text-[13px]">{time} Uhr</span>
                          </div>
                        </div>

                        {/* Open badge */}
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
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6" id="kontakt">
            {/* Match breakdown */}
            <div
              className="rounded-[12px] p-5"
              style={{
                background: "rgb(13 92 99 / 0.05)",
                border: "1px solid rgb(13 92 99 / 0.18)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Star size={16} className="text-primary" fill="currentColor" aria-hidden="true" />
                <span className="text-[16px] font-bold text-primary">{club.matchScore} % Match</span>
              </div>
              <p className="text-[13px] text-text-body mb-4">
                Basierend auf deinen Interessen, Standort und Präferenzen.
              </p>
              <div className="flex flex-col gap-3">
                {MATCH_DIMENSIONS.map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[13px] mb-1">
                      <span className="text-text-body">{label}</span>
                      <span className="font-semibold text-primary">{value} %</span>
                    </div>
                    <Progress
                      value={value}
                      className="h-1.5"
                      aria-label={`${label}: ${value}%`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Fees */}
            <div
              className="bg-card border border-border rounded-[10px] p-5"
              style={{ borderWidth: "0.5px" }}
            >
              <h3 className="text-[15px] font-bold text-foreground mb-4">Mitgliedsbeitrag</h3>
              <div className="flex flex-col">
                {club.fees.map((fee, i) => (
                  <div
                    key={fee.group}
                    className="flex justify-between py-2.5 text-[14px]"
                    style={
                      i < club.fees.length - 1
                        ? { borderBottom: "0.5px solid var(--border-light)" }
                        : {}
                    }
                  >
                    <span className="text-text-body">{fee.group}</span>
                    <span className="font-bold text-foreground">
                      {fee.price === 0 ? "Kostenlos" : `${fee.price.toFixed(2).replace(".", ",")} €/Monat`}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="mt-4 flex gap-2 p-3 rounded-lg text-[12px] text-text-body"
                style={{ background: "var(--chip-bg)" }}
              >
                <Info size={14} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>Ermäßigungen auf Anfrage möglich. Schnuppermitgliedschaft verfügbar.</span>
              </div>
            </div>

            {/* Contact */}
            <div
              className="bg-card border border-border rounded-[10px] overflow-hidden"
              style={{ borderWidth: "0.5px" }}
              id="kontakt"
            >
              <div className="p-5">
                <h3 className="text-[15px] font-bold text-foreground mb-4">Kontakt</h3>
                <div className="flex flex-col">
                  {[
                    club.contact.phone && {
                      icon: <Phone size={14} />,
                      label: "Telefon",
                      value: club.contact.phone,
                    },
                    club.contact.email && {
                      icon: <Mail size={14} />,
                      label: "E-Mail",
                      value: club.contact.email,
                    },
                    club.contact.website && {
                      icon: <Globe size={14} />,
                      label: "Website",
                      value: club.contact.website,
                    },
                    club.contact.address && {
                      icon: <MapPin size={14} />,
                      label: "Adresse",
                      value: club.contact.address,
                    },
                  ]
                    .filter(Boolean)
                    .map((row, i, arr) => {
                      if (!row) return null;
                      const { icon, label, value } = row as {
                        icon: React.ReactNode;
                        label: string;
                        value: string;
                      };
                      return (
                        <div
                          key={label}
                          className="flex items-start gap-3 py-3"
                          style={
                            i < arr.length - 1
                              ? { borderBottom: "0.5px solid var(--border-light)" }
                              : {}
                          }
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-primary shrink-0"
                            style={{ background: "rgb(13 92 99 / 0.08)" }}
                            aria-hidden="true"
                          >
                            {icon}
                          </div>
                          <div>
                            <p className="text-[12px] text-text-muted">{label}</p>
                            <p className="text-[14px] font-semibold text-foreground">{value}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Mini map placeholder */}
              <div
                className="h-[180px] relative"
                style={{ background: "#E8F2F0", borderTop: "0.5px solid var(--border)" }}
                role="img"
                aria-label="Kartenvorschau Vereinsstandort"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={24} className="text-primary mx-auto mb-1" />
                    <p className="text-[12px] text-text-muted">Kassel</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <Button className="w-full">Kontaktanfrage senden →</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
