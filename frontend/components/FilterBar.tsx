"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["Alle", "Sport", "Kultur", "Kinder", "Technik", "Soziales"];

interface FilterBarProps {
  active: string;
  onChange: (filter: string) => void;
  activeTag?: string | null;
  onTagChange?: (tag: string | null) => void;
  availableTags?: string[];
}

export default function FilterBar({
  active,
  onChange,
  activeTag,
  onTagChange,
  availableTags = [],
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Category row */}
      <div role="group" aria-label="Kategoriefilter" className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((filter) => {
          const isActive = active === filter;
          return (
            <Button
              key={filter}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(filter)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full text-[13px] transition-all h-8",
                isActive
                  ? "font-semibold"
                  : "bg-card text-text-body border-border hover:border-primary/50",
              )}
              style={{ borderWidth: isActive ? "1.5px" : "0.5px" }}
            >
              {filter}
            </Button>
          );
        })}
      </div>

      {/* Tag row */}
      <div role="group" aria-label="Themenfilter" className="flex items-center gap-2 flex-wrap">
        {activeTag && (
          <button
            onClick={() => onTagChange?.(null)}
            className="inline-flex items-center gap-1 px-3 h-7 rounded-full text-[12px] font-semibold bg-primary text-primary-foreground transition-all"
          >
            #{activeTag}
            <X size={11} strokeWidth={2.5} />
          </button>
        )}
        {availableTags.filter((t) => t !== activeTag).map((tag) => (
          <button
            key={tag}
            onClick={() => onTagChange?.(tag)}
            className={cn(
              "inline-flex items-center px-3 h-7 rounded-full text-[12px] font-medium border transition-all",
              "border-border/60 text-text-muted bg-card hover:border-primary/50 hover:text-primary",
            )}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}
