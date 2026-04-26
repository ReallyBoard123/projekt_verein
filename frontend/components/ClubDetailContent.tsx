"use client";

import { useState } from "react";
import {
  MapPin,
  Users,
  Calendar,
  Heart,
  Globe,
  Clock,
  Phone,
  Mail,
  Edit3,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Club } from "@/types";
import { categoryIcon, categoryLabel } from "@/lib/club-utils";
import { cn } from "@/lib/utils";

const DB_CATEGORIES = [
  "Sport", "Kultur", "Musik", "Kunst", "Soziales", "Jugend",
  "Bildung", "Umwelt", "Technik", "Gesundheit", "Religion",
  "Politik", "Stadtteil", "Interessenvertretung", "Förderverein", "Tierschutz",
];

export default function ClubDetailContent({ club }: { club: Club }) {
  const [saved, setSaved] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [suggestionSent, setSuggestionSent] = useState(false);
  const [form, setForm] = useState({
    name:        club.name,
    description: club.description ?? "",
    website:     club.contact.website ?? "",
    email:       club.contact.email ?? "",
    phone:       club.contact.phone ?? "",
    address:     club.contact.address ?? "",
    category:    club.category,
    tags:        club.tags.join(", "),
  });

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSendSuggestion = async () => {
    setSubmitting(true);
    try {
      await fetch(`/api/clubs/${club.slug}/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      setSuggestionSent(true);
      setTimeout(() => {
        setIsSuggesting(false);
        setSuggestionSent(false);
      }, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
        <div 
          className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-primary shrink-0 rounded-[20px] shadow-sm border-[0.5px] border-border-light"
          style={{ background: "rgb(13 92 99 / 0.08)" }}
        >
          <div className="scale-[2.0] md:scale-[2.5]">
            {categoryIcon(club.category)}
          </div>
        </div>

        <div className="flex-1">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/10 border-0 mb-3 px-3 py-1"
          >
            {categoryLabel(club.category)}
          </Badge>

          <h1 className="text-[32px] md:text-[42px] font-bold leading-[1.1] text-foreground font-serif tracking-[-0.5px] mb-4">
            {club.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-text-body">
            {club.location && (
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin size={16} className="text-primary/70" />
                {club.location}
              </span>
            )}
            {(club.memberCount ?? 0) > 0 && (
              <span className="flex items-center gap-1.5">
                <Users size={16} className="text-primary/70" />
                {club.memberCount} Mitglieder
              </span>
            )}
            {(club.foundingYear ?? 0) > 0 && (
              <span className="flex items-center gap-1.5">
                <Calendar size={16} className="text-primary/70" />
                Seit {club.foundingYear}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => setSaved((s) => !s)}
            className={cn(
              "flex-1 sm:flex-none h-11 px-6 rounded-full transition-all",
              saved ? "bg-primary/10 border-primary/30 text-primary" : "border-border"
            )}
          >
            <Heart size={18} className={cn("mr-2", saved && "fill-primary")} />
            {saved ? "Gespeichert" : "Merken"}
          </Button>
          {club.contact.website ? (
            <a
              href={club.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none h-11 px-8 rounded-full shadow-lg shadow-primary/20 inline-flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Mitmachen →
            </a>
          ) : (
            <Button className="flex-1 sm:flex-none h-11 px-8 rounded-full shadow-lg shadow-primary/20" disabled>
              Mitmachen →
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-12">
        {/* Left Column: Content */}
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="text-[20px] font-bold text-foreground mb-4 font-serif">
              Über uns
            </h2>
            <div className="prose prose-slate max-w-none text-[16px] text-body leading-[1.8] space-y-4">
              <p>{club.description || "Für diesen Verein liegt noch keine ausführliche Beschreibung vor."}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-8">
              {club.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="px-3 py-1 text-[13px] font-medium border-border/60 text-text-muted rounded-md bg-muted/5"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </section>

          {club.departments.length > 0 && (
            <section>
              <h2 className="text-[20px] font-bold text-foreground mb-6 font-serif border-b pb-4">
                Angebote & Gruppen
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {club.departments.map((dept) => (
                  <Card key={dept.id} className="p-5 border-[0.5px] bg-muted/5 hover:bg-background transition-colors">
                    <h3 className="font-bold text-[16px] mb-2">{dept.name}</h3>
                    <div className="space-y-1.5 mb-4">
                      {/* Added check for trainingTimes */}
                      {dept.trainingTimes && dept.trainingTimes.length > 0 && dept.trainingTimes.map((t) => (
                        <div key={t} className="flex items-center gap-2 text-[13px] text-text-muted">
                          <Clock size={14} className="shrink-0" />
                          {t}
                        </div>
                      ))}
                    </div>
                    <Button variant="link" className="p-0 h-auto text-primary text-[13px] font-bold">
                      Details anfragen →
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <aside className="flex flex-col gap-6">
          <Card className="p-6 border-[0.5px] shadow-sm">
            <h3 className="font-bold text-[17px] mb-6 border-b pb-3">Kontakt & Infos</h3>
            
            <div className="space-y-5">
              {club.contact.address && (
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[12px] text-text-muted font-medium mb-0.5">Adresse</p>
                    <p className="text-[14px] leading-snug">{club.contact.address}</p>
                  </div>
                </div>
              )}

              {club.contact.phone && club.contact.phone && (
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[12px] text-text-muted font-medium mb-0.5">Telefon</p>
                    <p className="text-[14px]">{club.contact.phone}</p>
                  </div>
                </div>
              )}

              {club.contact.website && club.contact.website && (
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <Globe size={16} className="text-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[12px] text-text-muted font-medium mb-0.5">Website</p>
                    <a 
                      href={club.contact.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[14px] text-primary hover:underline block truncate"
                    >
                      {club.contact.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Map Section */}
            {club.latitude && club.longitude ? (
              <div className="h-[200px] mt-8 relative rounded-xl border border-border overflow-hidden shadow-inner">
                <iframe
                  title={`Karte: ${club.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${club.longitude - 0.008}%2C${club.latitude - 0.005}%2C${club.longitude + 0.008}%2C${club.latitude + 0.005}&layer=mapnik&marker=${club.latitude}%2C${club.longitude}`}
                />
                <a
                  href={`https://www.openstreetmap.org/?mlat=${club.latitude}&mlon=${club.longitude}#map=17/${club.latitude}/${club.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 bg-white/90 px-2 py-0.5 rounded text-[10px] text-text-muted border shadow-sm hover:text-primary hover:bg-white"
                >
                  Größere Karte ↗
                </a>
              </div>
            ) : club.contact.address ? (
              <a
                href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(club.contact.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[180px] mt-8 relative bg-primary/5 rounded-xl border border-dashed border-primary/20 overflow-hidden flex flex-col items-center justify-center gap-2 hover:bg-primary/10 transition-colors group"
              >
                <MapPin size={24} className="text-primary/60 group-hover:text-primary" />
                <span className="text-[12px] text-text-muted group-hover:text-primary font-medium">
                  Auf OpenStreetMap öffnen ↗
                </span>
              </a>
            ) : (
              <div className="h-[180px] mt-8 relative bg-primary/5 rounded-xl border border-dashed border-primary/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <MapPin size={24} className="text-primary" />
                </div>
              </div>
            )}
          </Card>

          {/* Suggest Edits Card */}
          <Card className="p-6 border-primary/20 bg-primary/5 border-dashed border-2">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={20} className="text-primary" />
              <h4 className="font-bold text-[15px] text-primary">Profil verwalten?</h4>
            </div>
            <p className="text-[13px] text-text-body mb-5 leading-relaxed">
              Die Daten sind unvollständig oder veraltet? Hilf uns, den VereinsFinder aktuell zu halten.
            </p>
            
            <Dialog open={isSuggesting} onOpenChange={setIsSuggesting}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-background border-primary/30 text-primary hover:bg-primary/5">
                  <Edit3 size={15} className="mr-2" />
                  Daten korrigieren
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Daten korrigieren</DialogTitle>
                  <DialogDescription>
                    Ändere die Felder die falsch oder veraltet sind. Leere Felder werden nicht überschrieben.
                  </DialogDescription>
                </DialogHeader>

                {suggestionSent ? (
                  <div className="py-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
                    <CheckCircle2 size={48} className="text-green-500 mb-4" />
                    <p className="font-bold text-lg">Gespeichert!</p>
                    <p className="text-muted-foreground text-[14px]">Die Änderungen wurden übernommen.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 py-2">
                    <div className="grid gap-1.5">
                      <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">Name</label>
                      <Input value={form.name} onChange={set("name")} />
                    </div>

                    <div className="grid gap-1.5">
                      <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">Kategorie</label>
                      <select
                        value={form.category}
                        onChange={set("category")}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {DB_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-1.5">
                      <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">Tags <span className="font-normal normal-case">(kommagetrennt)</span></label>
                      <Input value={form.tags} onChange={set("tags")} placeholder="Sport, Kinder, Outdoor" />
                    </div>

                    <div className="grid gap-1.5">
                      <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">Beschreibung</label>
                      <Textarea value={form.description} onChange={set("description")} className="min-h-[100px] resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">Website</label>
                        <Input value={form.website} onChange={set("website")} type="url" placeholder="https://" />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">E-Mail</label>
                        <Input value={form.email} onChange={set("email")} type="email" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">Telefon</label>
                        <Input value={form.phone} onChange={set("phone")} type="tel" />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">Adresse</label>
                        <Input value={form.address} onChange={set("address")} />
                      </div>
                    </div>

                    <DialogFooter className="pt-2">
                      <Button
                        onClick={handleSendSuggestion}
                        disabled={submitting}
                        className="w-full"
                      >
                        {submitting ? "Wird gespeichert…" : "Änderungen speichern"}
                      </Button>
                    </DialogFooter>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </Card>
        </aside>
      </div>
    </div>
  );
}
