import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Club } from "@/types";
import { categoryIcon, categoryLabel } from "@/lib/club-utils";

interface ClubCardProps {
  club: Club;
}

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
      {/* Header strip */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "0.5px solid #E8F0F0" }}
      >
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
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-2">
        <h3 className="text-[17px] font-bold text-foreground">{club.name}</h3>

        <div className="flex items-center gap-1 text-text-muted">
          <MapPin size={12} aria-hidden="true" />
          <span className="text-[13px]">{club.location}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-1">
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
        </div>

        <p className="text-[14px] text-text-body leading-[1.55] mt-1 flex-1">
          {club.description}
        </p>

        <Link
          href={`/vereine/${club.id}`}
          className="text-[14px] font-semibold text-primary hover:underline mt-1 self-start"
        >
          Details →
        </Link>
      </div>
    </article>
  );
}
