"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WIZARD_STEPS } from "@/lib/wizardConfig";
import WizardStepRenderer from "./wizard/WizardStepRenderer";

interface OnboardingPanelProps {
  onComplete?: (answers: Record<string, any>) => void;
}

export default function OnboardingPanel({ onComplete }: OnboardingPanelProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = WIZARD_STEPS[stepIndex];
  const progress = ((stepIndex + 1) / WIZARD_STEPS.length) * 100;

  const handleSelect = (value: any) => {
    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers);

    // Auto-advance for single-choice and transition steps
    if (currentStep.type === "single" || currentStep.type === "transition") {
      advance(newAnswers, value);
    }
  };

  const advance = (currentAnswers: Record<string, any>, lastValue: any) => {
    // Special logic for transition step
    if (currentStep.id === "transition_accessibility" && lastValue === "no") {
      finish(currentAnswers);
      return;
    }

    if (stepIndex < WIZARD_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      finish(currentAnswers);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    advance(answers, null);
  };

  const finish = (finalAnswers: Record<string, any>) => {
    setIsFinished(true);
    onComplete?.(finalAnswers);
  };

  if (isFinished) {
    return (
      <Card className="flex flex-col items-center justify-center gap-6 p-6 md:p-8 border-[0.5px] shadow-[0_2px_16px_rgba(13,92,99,0.07)] text-center h-[600px] animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Sparkles size={32} />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-[20px] md:text-[22px] font-bold text-foreground">Matches gefunden!</h2>
          <p className="text-[14px] text-text-body px-2 md:px-4">
            Wir haben deine Präferenzen analysiert und die besten Vereine in deiner Nähe markiert.
          </p>
        </div>
        <Button 
          className="w-full mt-4" 
          onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
        >
          Zu den Ergebnissen
        </Button>
        <button 
          onClick={() => {
            setStepIndex(0);
            setAnswers({});
            setIsFinished(false);
          }}
          className="text-[12px] text-text-muted hover:underline"
        >
          Suche verfeinern
        </button>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-5 p-6 md:p-8 border-[0.5px] shadow-[0_2px_16px_rgba(13,92,99,0.07)] h-[600px] relative overflow-hidden transition-all duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />

      {/* Top Meta */}
      <div className="flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[12px] font-medium text-primary">Dein Vereins-Match</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-2 z-10 shrink-0">
        <div className="flex items-center justify-between text-[11px] font-bold text-text-muted/80">
          <span>SCHRITT {stepIndex + 1} VON {WIZARD_STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-primary/10" />
      </div>

      {/* Step Content */}
      <div className="flex-1 z-10 flex flex-col">
        <WizardStepRenderer
          step={currentStep}
          answers={answers}
          onSelect={handleSelect}
          onBack={stepIndex > 0 ? handleBack : undefined}
          onSkip={handleSkip}
        />
      </div>

      {/* Hint */}
      <div className="text-[11px] text-text-muted/70 text-center italic mt-2 shrink-0">
        Tipp: Du kannst Fragen jederzeit überspringen.
      </div>
    </Card>
  );
}
