import { MapPin, Clock } from "lucide-react";
import type { ClubEvent } from "@/types";
import { formatEventDate } from "@/lib/club-utils";
import { Card, CardContent } from "@/components/ui/card";

interface EventCardProps {
  event: ClubEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const { dayAbbr, day, month, time } = formatEventDate(event.date);

  return (
    <Card className="flex overflow-hidden border-[0.5px] shadow-[0_1px_6px_rgba(13,92,99,0.05)]">
      {/* Date block */}
      <div className="flex flex-col items-center justify-center px-4 py-4 bg-primary text-primary-foreground min-w-[70px] shrink-0">
        <span className="text-[11px] font-semibold opacity-80 uppercase tracking-wider">
          {dayAbbr}
        </span>
        <span className="text-[24px] font-bold leading-tight">{day}</span>
        <span className="text-[11px] opacity-70">{month}</span>
      </div>

      {/* Content */}
      <CardContent className="p-4 flex flex-col gap-1.5 justify-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.8px] text-brand-accent">
          {event.category}
        </span>
        <p className="text-[15px] font-bold text-foreground leading-tight">
          {event.name}
        </p>
        <div className="flex flex-col gap-1 mt-0.5">
          <div className="flex items-center gap-1.5 text-text-muted">
            <MapPin size={12} className="shrink-0" aria-hidden="true" />
            <span className="text-[13px] line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            <Clock size={12} className="shrink-0" aria-hidden="true" />
            <span className="text-[13px]">{time} Uhr</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
