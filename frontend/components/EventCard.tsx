import { MapPin, Clock } from "lucide-react";
import type { ClubEvent } from "@/types";
import { formatEventDate } from "@/lib/club-utils";

interface EventCardProps {
  event: ClubEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const { dayAbbr, day, month, time } = formatEventDate(event.date);

  return (
    <article
      className="bg-card border border-border flex overflow-hidden"
      style={{
        borderRadius: "10px",
        borderWidth: "0.5px",
        boxShadow: "0 1px 6px rgba(13,92,99,0.05)",
      }}
    >
      {/* Date block */}
      <div className="flex flex-col items-center justify-center px-4 py-4 bg-primary text-primary-foreground min-w-[60px] shrink-0">
        <span className="text-[11px] font-semibold opacity-80">{dayAbbr}</span>
        <span className="text-[22px] font-bold leading-tight">{day}</span>
        <span className="text-[11px] opacity-70">{month}</span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.8px] text-brand-accent">
          {event.category}
        </span>
        <p className="text-[15px] font-bold text-foreground leading-tight">{event.name}</p>
        <div className="flex items-center gap-1 text-text-muted">
          <MapPin size={12} aria-hidden="true" />
          <span className="text-[13px]">{event.location}</span>
        </div>
        <div className="flex items-center gap-1 text-text-muted">
          <Clock size={12} aria-hidden="true" />
          <span className="text-[13px]">{time} Uhr</span>
        </div>
      </div>
    </article>
  );
}
