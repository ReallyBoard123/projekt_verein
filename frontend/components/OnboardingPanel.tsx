"use client";

import { useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WIZARD_BATCHES } from "@/lib/wizardConfig";
import WizardStepRenderer from "./wizard/WizardStepRenderer";

interface OnboardingPanelProps {
  onComplete?: (answers: Record<string, unknown>) => void;
}

const BATCH_HINTS = [
  "Erste Treffer sind bereit — oder noch präziser?",
  "Noch besser! Für maximale Präzision: 5 letzte Fragen.",
];

export default function OnboardingPanel({ onComplete }: OnboardingPanelProps) {
  const [batchIndex, setBatchIndex] = useState(0);
  const [stepInBatch, setStepInBatch] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentBatch = WIZARD_BATCHES[batchIndex];
  const currentStep = currentBatch[stepInBatch];
  const isLastBatch = batchIndex === WIZARD_BATCHES.length - 1;

  // Progress within current batch only (resets each batch — feels fresh)
  const progress = ((stepInBatch + 1) / currentBatch.length) * 100;

  const finish = (finalAnswers: Record<string, unknown>) => {
    setIsFinished(true);
    onComplete?.(finalAnswers);
  };

  const handleSelect = (value: unknown) => {
    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers);

    if (currentStep.type === "single") {
      advance(newAnswers);
    }
  };

  const advance = (currentAnswers: Record<string, unknown>) => {
    const isLastStepInBatch = stepInBatch === currentBatch.length - 1;

    if (isLastStepInBatch) {
      if (isLastBatch) {
        finish(currentAnswers);
      } else {
        setShowCheckpoint(true);
      }
    } else {
      setStepInBatch((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (stepInBatch > 0) setStepInBatch((s) => s - 1);
  };

  const handleSkip = () => advance(answers);

  const handleContinueBatch = () => {
    setShowCheckpoint(false);
    setBatchIndex((b) => b + 1);
    setStepInBatch(0);
  };

  // ── Finished screen ──────────────────────────────────────────────────────
  if (isFinished) {
    return (
      <Card className="flex flex-col items-center justify-center gap-6 p-6 md:p-8 border-[0.5px] shadow-[0_2px_16px_rgba(13,92,99,0.07)] text-center h-[560px] animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Sparkles size={32} />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-[20px] md:text-[22px] font-bold text-foreground">
            Matches gefunden!
          </h2>
          <p className="text-[14px] text-text-body px-2 md:px-4">
            Wir haben deine Präferenzen analysiert und die besten Vereine
            markiert.
          </p>
        </div>
        <Button
          className="w-full mt-2"
          onClick={() =>
            document
              .getElementById("results")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Zu den Ergebnissen
        </Button>
        <button
          onClick={() => {
            setBatchIndex(0);
            setStepInBatch(0);
            setAnswers({});
            setIsFinished(false);
            setShowCheckpoint(false);
          }}
          className="text-[12px] text-text-muted hover:underline"
        >
          Suche neu starten
        </button>
      </Card>
    );
  }

  // ── Batch checkpoint screen ──────────────────────────────────────────────
  if (showCheckpoint) {
    return (
      <Card className="flex flex-col items-center justify-center gap-6 p-6 md:p-8 border-[0.5px] shadow-[0_2px_16px_rgba(13,92,99,0.07)] text-center h-[560px] animate-in zoom-in-95 duration-300">
        {/* Batch dots — decorative, progress announced in text below */}
        <div className="flex gap-2" aria-hidden="true">
          {WIZARD_BATCHES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= batchIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-primary/20"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[20px] md:text-[22px] font-bold text-foreground">
            Gut gemacht! ✓
          </h2>
          <p className="text-[14px] text-text-body px-2 md:px-4 max-w-[280px]">
            {BATCH_HINTS[batchIndex]}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button
            className="w-full h-11"
            onClick={() => finish(answers)}
          >
            Ergebnisse ansehen
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 border-primary/30 text-primary hover:bg-primary/5"
            onClick={handleContinueBatch}
          >
            Noch 5 Fragen
            <ChevronRight size={15} className="ml-1" />
          </Button>
        </div>

        <p className="text-[11px] text-text-muted/60">
          Runde {batchIndex + 1} von {WIZARD_BATCHES.length} abgeschlossen
        </p>
      </Card>
    );
  }

  // ── Question screen ──────────────────────────────────────────────────────
  return (
    <Card className="flex flex-col p-6 md:p-8 border-[0.5px] shadow-[0_2px_16px_rgba(13,92,99,0.07)] h-[560px] relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />

      {/* Progress bar — resets per batch */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/10 z-20">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={stepInBatch + 1}
          aria-valuemin={1}
          aria-valuemax={currentBatch.length}
          aria-label={`Frage ${stepInBatch + 1} von ${currentBatch.length}`}
        />
      </div>

      {/* Top meta */}
      <div className="flex items-center justify-between z-10 shrink-0 mb-4 mt-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <span className="text-[12px] font-medium text-primary">
            Dein Vereins-Match
          </span>
        </div>
        <span
          className="text-[11px] font-bold text-text-muted/80 tracking-widest"
          aria-live="polite"
          aria-label={`Frage ${stepInBatch + 1} von ${currentBatch.length}`}
        >
          {stepInBatch + 1} / {currentBatch.length}
        </span>
      </div>

      {/* Step content */}
      <div className="flex-1 z-10 flex flex-col justify-center">
        <WizardStepRenderer
          step={currentStep}
          answers={answers}
          onSelect={handleSelect}
          onNext={() => advance(answers)}
          onBack={stepInBatch > 0 ? handleBack : undefined}
          onSkip={handleSkip}
        />
        <div className="text-[11px] text-text-muted/70 text-center italic mt-5 shrink-0">
          Tipp: Du kannst Fragen jederzeit überspringen.
        </div>
      </div>

      {/* Batch indicator dots at bottom */}
      <div className="flex justify-center gap-1.5 mt-4 z-10">
        {WIZARD_BATCHES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < batchIndex
                ? "w-4 bg-primary"
                : i === batchIndex
                ? "w-4 bg-primary/60"
                : "w-1.5 bg-primary/20"
            }`}
          />
        ))}
      </div>
    </Card>
  );
}
