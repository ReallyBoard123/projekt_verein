"use client";

import { cn } from "@/lib/utils";

const FILTERS = ["Alle", "Sport", "Kinder", "Kultur", "≤ 5 km"];

interface FilterBarProps {
  active: string;
  onChange: (filter: string) => void;
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div role="group" aria-label="Vereinsfilter" className="flex items-center gap-2 flex-wrap">
      {FILTERS.map((filter) => {
        const isActive = active === filter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            aria-pressed={isActive}
            className={cn(
              "px-4 py-1.5 rounded-full text-[13px] border transition-all",
              isActive
                ? "bg-primary text-primary-foreground border-primary font-semibold"
                : "bg-card text-text-body border-border hover:border-primary/50"
            )}
            style={{ borderWidth: isActive ? "1.5px" : "0.5px" }}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
