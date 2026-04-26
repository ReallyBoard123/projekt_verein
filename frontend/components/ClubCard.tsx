import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Club } from "@/types";
import { categoryIcon, categoryLabel } from "@/lib/club-utils";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClubCardProps {
  club: Club;
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden border-[0.5px] shadow-[0_1px_6px_rgba(13,92,99,0.05)]">
      {/* Header strip */}
      <CardHeader className="flex flex-row items-center justify-between px-5 py-3.5 space-y-0 border-b-[0.5px] border-[#E8F0F0]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-primary"
            style={{ background: "rgb(13 92 99 / 0.08)" }}
          >
            {categoryIcon(club.category)}
          </div>
          <span className="text-[12px] font-semibold uppercase tracking-[0.8px] text-primary">
            {categoryLabel(club.category)}
          </span>
        </div>

        {club.matchScore > 0 && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 rounded-full text-primary bg-primary/7 border-primary/25 hover:bg-primary/7"
          >
            <Star size={11} fill="currentColor" aria-hidden="true" />
            <span className="text-[12px] font-semibold">
              {club.matchScore} % Match
            </span>
          </Badge>
        )}
      </CardHeader>

      {/* Body */}
      <CardContent className="p-5 flex flex-col flex-1 gap-2">
        <h3 className="text-[17px] font-bold text-foreground">{club.name}</h3>

        <div className="flex items-center gap-1 text-text-muted">
          <MapPin size={12} aria-hidden="true" />
          <span className="text-[13px]">{club.location}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-1">
          {club.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="px-2 py-0.5 rounded text-[12px] font-medium text-chip-text bg-[var(--chip-bg)] hover:bg-[var(--chip-bg)] shadow-none"
              style={{ borderRadius: "4px" }}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {club.description ? (
          <p className="text-[14px] text-text-body leading-[1.55] mt-1 flex-1 line-clamp-3">
            {club.description}
          </p>
        ) : (
          <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10 flex-1">
            <p className="text-[13px] text-primary font-medium italic">
              Dies ist ein Basis-Eintrag. Hilf der Community und vervollständige das Profil!
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0">
        <Link
          href={`/vereine/${club.slug}`}
          prefetch={true}
          className="text-[14px] font-semibold text-primary hover:underline self-start"
        >
          Details →
        </Link>
      </CardFooter>
    </Card>
  );
}
