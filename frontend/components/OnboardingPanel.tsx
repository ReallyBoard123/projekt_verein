"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INTERESTS = [
  { id: "sport", label: "Sport", emoji: "⚽" },
  { id: "musik", label: "Musik", emoji: "🎵" },
  { id: "kinder", label: "Kinder", emoji: "👶" },
  { id: "kultur", label: "Kultur", emoji: "🎨" },
  { id: "natur", label: "Natur", emoji: "🌿" },
  { id: "ehrenamt", label: "Ehrenamt", emoji: "🤝" },
];

const TOTAL_STEPS = 4;

interface OnboardingPanelProps {
  onComplete?: (interests: string[]) => void;
}

export default function OnboardingPanel({ onComplete }: OnboardingPanelProps) {
  const [selected, setSelected] = useState<string[]>(["musik"]);
  const [step, setStep] = useState(2);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      onComplete?.(selected);
    }
  };

  return (
    <div
      className="bg-card border border-border flex flex-col gap-5 p-8"
      style={{
        borderRadius: "14px",
        borderWidth: "0.5px",
        boxShadow: "0 2px 16px rgba(13,92,99,0.07)",
      }}
    >
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <h2 className="text-[18px] font-bold text-foreground">Dein Vereins-Match</h2>
        <span className="text-[12px] text-text-muted">KI-gestützt</span>
      </div>

      {/* Interest chips */}
      <div>
        <p className="text-[14px] text-text-body mb-3">Was interessiert dich?</p>
        <div className="grid grid-cols-3 gap-2">
          {INTERESTS.map(({ id, label, emoji }) => {
            const isSelected = selected.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                aria-pressed={isSelected}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 p-3 rounded-[10px] transition-all text-[13px] font-medium",
                  isSelected
                    ? "border-2 border-primary text-primary"
                    : "border border-border text-text-body hover:border-primary/50"
                )}
                style={isSelected ? { background: "rgb(13 92 99 / 0.06)" } : { background: "#fff" }}
              >
                {isSelected && (
                  <span
                    className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Check size={10} className="text-primary-foreground" strokeWidth={3} />
                  </span>
                )}
                <span className="text-xl" aria-hidden="true">{emoji}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i < step ? "bg-primary w-5" : "bg-border w-2"
              )}
              aria-hidden="true"
            />
          ))}
          <span className="text-[12px] font-medium text-text-muted ml-1">
            Frage {step} von {TOTAL_STEPS}
          </span>
        </div>
        <p className="text-[12px] text-text-muted">
          Noch {TOTAL_STEPS - step} Fragen, dann zeigen wir dir deine Treffer
        </p>
      </div>

      <Button onClick={handleNext} className="w-full">
        Weiter →
      </Button>
    </div>
  );
}
