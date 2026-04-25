"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Heart,
  Globe,
  Star,
  Clock,
  Check,
  Info,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { fetchClubById } from "@/lib/actions";
import type { Club } from "@/types";
import { categoryLabel, formatEventDate } from "@/lib/club-utils";
import { cn } from "@/lib/utils";

const MATCH_DIMENSIONS = [
  { label: "Interessen", value: 92 },
  { label: "Standort", value: 85 },
  { label: "Engagement", value: 78 },
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
    fetchClubById(id).then(setClub).catch(console.error);
  }, [id]);

  if (!club) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10" />
          <p className="text-text-muted font-medium">Club Details laden...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Breadcrumb */}
      <div className="px-6 md:px-12 py-4 bg-background border-b-[0.5px] border-[#E8F0F0]">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-[14px]">
          <Link
            href="/vereine"
            className="text-primary flex items-center gap-1 hover:underline"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Zurück zur Übersicht</span>
            <span className="sm:hidden">Zurück</span>
          </Link>
          <span className="text-text-muted">·</span>
          <span className="text-text-muted hidden sm:inline">Vereine</span>
          <span className="text-text-muted hidden sm:inline">·</span>
          <span className="text-text-body truncate">{club.name}</span>
        </div>
      </div>

      {/* Hero header */}
      <div className="px-6 md:px-12 pt-8 md:pt-10 border-b-[0.5px] border-[var(--border)] bg-[var(--bg-panel)]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
            {/* Logo placeholder */}
            <div
              className="w-20 h-20 md:w-24 md:h-24 bg-card border border-border flex items-center justify-center text-primary shrink-0 rounded-[16px]"
              aria-hidden="true"
            >
              <Users size={32} className="md:size-10" />
            </div>

            {/* Title block */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/10 border-0"
                >
                  {categoryLabel(club.category)}
                </Badge>
                {club.matchScore > 0 && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-primary text-[12px] font-semibold bg-primary/7 border-primary/25 hover:bg-primary/7"
                  >
                    <Star size={11} fill="currentColor" aria-hidden="true" />
                    {club.matchScore} % Match
                  </Badge>
                )}
              </div>

              <h1 className="text-[28px] md:text-[38px] leading-[1.1] text-foreground font-serif tracking-[-0.3px]">
                {club.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-[14px] text-text-body">
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
            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setSaved((s) => !s)}
                aria-pressed={saved}
                className={cn(
                  "flex-1 sm:flex-none flex items-center justify-center gap-1.5",
                  saved
                    ? "text-primary border-primary/40 bg-primary/5 hover:bg-primary/10"
                    : "text-text-body border-border",
                )}
              >
                <Heart
                  size={15}
                  aria-hidden="true"
                  className={saved ? "text-primary fill-primary" : ""}
                />
                <span>{saved ? "Gespeichert" : "Speichern"}</span>
              </Button>
              <Button className="flex-1 sm:flex-none">
                Kontakt aufnehmen →
              </Button>
            </div>
          </div>

          {/* Tab bar - scrollable on mobile */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-0 gap-0 h-auto p-0 flex-nowrap overflow-x-auto no-scrollbar">
              {["überblick", "abteilungen", "events", "kontakt"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={cn(
                    "capitalize rounded-none px-4 md:px-5 py-3 text-[14px] md:text-[15px] font-medium border-b-2 data-[state=active]:shadow-none whitespace-nowrap",
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-text-nav hover:text-foreground",
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
      <div className="px-6 md:px-12 py-8 md:py-10 bg-background">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-8 md:gap-10">
          {/* Left column */}
          <div className="flex flex-col gap-8" id="überblick">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
              {[
                {
                  icon: <Users size={20} />,
                  value: club.memberCount,
                  label: "Mitglieder",
                },
                {
                  icon: <Calendar size={20} />,
                  value: club.foundingYear,
                  label: "Gegründet",
                },
                {
                  icon: <Star size={20} />,
                  value: `${club.matchScore} %`,
                  label: "Match-Score",
                },
              ].map(({ icon, value, label }) => (
                <div
                  key={label}
                  className="bg-card border border-border rounded-[10px] p-5 flex items-center gap-4 border-[0.5px]"
                >
                  <div
                    className="w-11 h-11 rounded-[10px] flex items-center justify-center text-primary shrink-0 bg-primary/7"
                    aria-hidden="true"
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-[22px] font-bold text-foreground leading-tight">
                      {value}
                    </p>
                    <p className="text-[13px] text-text-muted">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* About */}
            <section aria-labelledby="about-heading">
              <h2
                id="about-heading"
                className="text-[18px] font-bold text-foreground mb-3"
              >
                Über den Verein
              </h2>
              <p className="text-[15px] text-text-body leading-[1.7]">
                {club.description}
              </p>
              <p className="text-[15px] text-text-body leading-[1.7] mt-3">
                Wir sind offen für alle – egal ob Anfänger oder Erfahrene. Komm
                einfach zu einem unserer Trainings und schnupper rein.
                Anmeldung vorab nicht notwendig.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {club.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 text-[13px] font-medium text-chip-text bg-[var(--chip-bg)] hover:bg-[var(--chip-bg)] rounded-[6px] shadow-none"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Departments */}
            {club.departments.length > 0 && (
              <section aria-labelledby="depts-heading" id="abteilungen">
                <h2
                  id="depts-heading"
                  className="text-[18px] font-bold text-foreground mb-4"
                >
                  Abteilungen
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {club.departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="bg-card border border-border rounded-[10px] p-5 border-[0.5px]"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-primary bg-primary/8"
                          aria-hidden="true"
                        >
                          <Users size={16} />
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-foreground">
                            {dept.name}
                          </p>
                          <p className="text-[12px] text-text-muted">
                            {dept.memberCount} Mitglieder · {dept.ageRange}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 mb-4">
                        {dept.trainingTimes.map((t) => (
                          <div
                            key={t}
                            className="flex items-center gap-1.5 text-[13px] text-text-body"
                          >
                            <Clock
                              size={12}
                              aria-hidden="true"
                              className="text-text-muted"
                            />
                            {t}
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full text-primary border-primary transition-colors hover:bg-primary/5 bg-primary/3"
                      >
                        Anfragen
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Events */}
            {club.events.length > 0 && (
              <section aria-labelledby="events-heading" id="events">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    id="events-heading"
                    className="text-[18px] font-bold text-foreground"
                  >
                    Kommende Termine
                  </h2>
                  <Link
                    href="#"
                    className="text-[14px] font-medium text-primary hover:underline"
                  >
                    Alle Termine →
                  </Link>
                </div>
                <div className="flex flex-col">
                  {club.events.map((event, i) => {
                    const { dayAbbr, day, month, time } = formatEventDate(
                      event.date,
                    );
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "flex items-center gap-4 py-4",
                          i < club.events.length - 1 &&
                            "border-b border-[var(--border-light)]",
                        )}
                      >
                        {/* Date column */}
                        <div className="w-[52px] shrink-0 text-center">
                          <p className="text-[11px] font-semibold text-primary uppercase">
                            {dayAbbr}
                          </p>
                          <p className="text-[22px] font-bold text-foreground leading-tight">
                            {day}
                          </p>
                          <p className="text-[11px] text-text-muted">{month}</p>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <p className="text-[15px] font-semibold text-foreground">
                            {event.name}
                          </p>
                          <div className="flex items-center gap-1 text-text-muted mt-0.5">
                            <MapPin size={12} aria-hidden="true" />
                            <span className="text-[13px]">
                              {event.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-text-muted">
                            <Clock size={12} aria-hidden="true" />
                            <span className="text-[13px]">{time} Uhr</span>
                          </div>
                        </div>

                        {/* Open badge */}
                        {event.isOpenForAll && (
                          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold text-success-text shrink-0 bg-[var(--success-bg)] border border-[var(--success-border)]">
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
            <Card className="rounded-[12px] p-5 border-[0.5px] shadow-none bg-primary/5 border-primary/18">
              <div className="flex items-center gap-2 mb-1">
                <Star
                  size={16}
                  className="text-primary"
                  fill="currentColor"
                  aria-hidden="true"
                />
                <span className="text-[16px] font-bold text-primary">
                  {club.matchScore} % Match
                </span>
              </div>
              <p className="text-[13px] text-text-body mb-4">
                Basierend auf deinen Interessen, Standort und Präferenzen.
              </p>
              <div className="flex flex-col gap-3">
                {MATCH_DIMENSIONS.map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[13px] mb-1">
                      <span className="text-text-body">{label}</span>
                      <span className="font-semibold text-primary">
                        {value} %
                      </span>
                    </div>
                    <Progress
                      value={value}
                      className="h-1.5"
                      aria-label={`${label}: ${value}%`}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Fees */}
            <div className="bg-card border border-border rounded-[10px] p-5 border-[0.5px]">
              <h3 className="text-[15px] font-bold text-foreground mb-4">
                Mitgliedsbeitrag
              </h3>
              <div className="flex flex-col">
                {club.fees.map((fee, i) => (
                  <div
                    key={fee.group}
                    className={cn(
                      "flex justify-between py-2.5 text-[14px]",
                      i < club.fees.length - 1 &&
                        "border-b border-[var(--border-light)]",
                    )}
                  >
                    <span className="text-text-body">{fee.group}</span>
                    <span className="font-bold text-foreground">
                      {fee.price === 0
                        ? "Kostenlos"
                        : `${fee.price.toFixed(2).replace(".", ",")} €/Monat`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2 p-3 rounded-lg text-[12px] text-text-body bg-[var(--chip-bg)]">
                <Info
                  size={14}
                  className="text-primary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  Ermäßigungen auf Anfrage möglich. Schnuppermitgliedschaft
                  verfügbar.
                </span>
              </div>
            </div>

            {/* Contact */}
            <div
              className="bg-card border border-border rounded-[10px] overflow-hidden border-[0.5px]"
              id="kontakt"
            >
              <div className="p-5">
                <h3 className="text-[15px] font-bold text-foreground mb-4">
                  Kontakt
                </h3>
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
                          className={cn(
                            "flex items-start gap-3 py-3",
                            i < arr.length - 1 &&
                              "border-b border-[var(--border-light)]",
                          )}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-primary shrink-0 bg-primary/8"
                            aria-hidden="true"
                          >
                            {icon}
                          </div>
                          <div>
                            <p className="text-[12px] text-text-muted">
                              {label}
                            </p>
                            <p className="text-[14px] font-semibold text-foreground">
                              {value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Mini map placeholder */}
              <div
                className="h-[180px] relative bg-[#E8F2F0] border-t border-[var(--border)]"
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
