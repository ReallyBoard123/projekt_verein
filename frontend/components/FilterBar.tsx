"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FILTERS = ["Alle", "Sport", "Kultur", "Kinder", "Technik", "Soziales"];

interface FilterBarProps {
  active: string;
  onChange: (filter: string) => void;
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div
      role="group"
      aria-label="Vereinsfilter"
      className="flex items-center gap-2 flex-wrap"
    >
      {FILTERS.map((filter) => {
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
  );
}
