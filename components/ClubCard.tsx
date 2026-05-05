import Link from "next/link";
import { Wand2 } from "lucide-react";
import type { Club } from "@/types";
import { categoryIcon, categoryLabel } from "@/lib/club-utils";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ClubCardProps {
  club: Club;
  onTagClick?: (tag: string) => void;
}

export default function ClubCard({ club, onTagClick }: ClubCardProps) {
  const visibleTags = club.tags.slice(0, 3);
  const isWizardMatch = (club.matchScore ?? 0) > 0;

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden border-[0.5px] transition-all duration-300",
        isWizardMatch
          ? "shadow-[0_2px_12px_rgba(13,92,99,0.13)] border-primary/30"
          : "shadow-[0_1px_6px_rgba(13,92,99,0.05)]"
      )}
    >
      {/* Wizard match accent bar */}
      {isWizardMatch && (
        <div className="h-[3px] w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      )}

      {/* Header strip */}
      <CardHeader className="flex flex-row items-center justify-between px-5 py-3.5 space-y-0 border-b-[0.5px] border-border-light">
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

        {isWizardMatch && (
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Wand2 size={12} aria-hidden="true" />
          </div>
        )}
      </CardHeader>

      {/* Body */}
      <CardContent className="p-5 flex flex-col flex-1 gap-2">
        <h3 className="text-[17px] font-bold text-foreground">{club.name}</h3>

        {club.description ? (
          <p className="text-[14px] text-text-body leading-[1.55] mt-1 flex-1 line-clamp-4">
            {club.description.length > 280
              ? club.description.slice(0, 280).trimEnd() + "…"
              : club.description}
          </p>
        ) : (
          <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10 flex-1">
            <p className="text-[13px] text-primary font-medium italic">
              Dies ist ein Basis-Eintrag. Hilf der Community und vervollständige das Profil!
            </p>
          </div>
        )}

        {/* Tag badges */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {visibleTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-primary/5 text-primary/80 border border-primary/10 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                #{tag}
              </button>
            ))}
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
