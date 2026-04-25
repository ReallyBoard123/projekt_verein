"use client";

import { Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WizardStep, WizardOption } from "@/lib/wizardConfig";

interface WizardStepRendererProps {
  step: WizardStep;
  answers: Record<string, any>;
  onSelect: (value: any) => void;
  onBack?: () => void;
  onSkip?: () => void;
}

export default function WizardStepRenderer({
  step,
  answers,
  onSelect,
  onBack,
  onSkip,
}: WizardStepRendererProps) {
  const currentAnswer = answers[step.id];
  const selectedCount = Array.isArray(currentAnswer) ? currentAnswer.length : 0;
  const minRequired = step.minSelect || 0;
  const hasMetMin = step.type === "multi" ? selectedCount >= minRequired : true;

  const handleToggle = (optionId: string) => {
    if (step.type === "multi") {
      const prev = (currentAnswer as string[]) || [];
      const next = prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId];
      onSelect(next);
    } else {
      onSelect(optionId);
    }
  };

  const isSelected = (optionId: string) => {
    if (step.type === "multi") {
      return (currentAnswer as string[])?.includes(optionId);
    }
    return currentAnswer === optionId;
  };

  return (
    <div className="flex flex-col gap-4 md:gap-5 animate-in fade-in slide-in-from-right-4 duration-300 h-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] md:text-[18px] font-bold text-foreground leading-tight">
            {step.title}
          </h2>
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8 -mr-2"
              aria-label="Zurück"
            >
              <ArrowLeft size={16} />
            </Button>
          )}
        </div>
        {step.subtitle && (
          <p className="text-[12px] md:text-[13px] text-text-muted">{step.subtitle}</p>
        )}
      </div>

      {/* Options */}
      <div 
        className={cn(
          "grid gap-2",
          step.columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        )}
      >
        {step.options?.map((option) => {
          const selected = isSelected(option.id);
          return (
            <Button
              key={option.id}
              variant="outline"
              onClick={() => handleToggle(option.id)}
              className={cn(
                "relative flex items-center justify-start gap-3 h-auto py-2.5 md:py-3 px-3 md:px-4 text-left transition-all",
                selected
                  ? "border-2 border-primary bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary shadow-sm"
                  : "border-border text-text-body hover:border-primary/50"
              )}
            >
              {option.emoji && (
                <span className="text-lg md:text-xl shrink-0" aria-hidden="true">
                  {option.emoji}
                </span>
              )}
              <span className="text-[13px] md:text-[14px] font-medium leading-tight">
                {option.label}
              </span>
              {selected && (
                <div className="ml-auto shrink-0">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check size={12} className="text-primary-foreground" strokeWidth={3} />
                  </div>
                </div>
              )}
            </Button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col gap-3 mt-auto pt-2 border-t border-border/50">
        {step.type === "multi" && minRequired > 0 && (
          <p className={cn(
            "text-[11px] font-medium",
            hasMetMin ? "text-primary/70" : "text-brand-accent animate-pulse"
          )}>
            {hasMetMin 
              ? "✓ Mindestanforderung erfüllt" 
              : `Bitte wähle mindestens ${minRequired} Optionen aus (${selectedCount}/${minRequired})`}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-text-muted hover:text-foreground text-[12px] md:text-[13px]"
          >
            Überspringen
          </Button>
          {step.type === "multi" && (
            <Button 
              size="sm" 
              onClick={() => onSelect(currentAnswer)}
              disabled={!hasMetMin}
            >
              Weiter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
