"use client";

import { type ReactNode, useRef, useEffect } from "react";
import { ArrowRight, CaretLeft, Rocket, Spinner } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useSellFormContext } from "../sell-form-provider";

// ============================================================================
// STEPPER WRAPPER - Mobile-first wizard with proper touch targets & spacing
// Best practices: min 44px touch targets, clear visual hierarchy, safe areas
// ============================================================================

interface StepConfig {
  id: number;
  title: { en: string; bg: string };
  fields: string[];
}

interface StepperWrapperProps {
  children: ReactNode;
  steps: StepConfig[];
  onSubmit: () => void;
  onNext?: () => void | Promise<void>;
  isSubmitting?: boolean;
}

export function StepperWrapper({
  children,
  steps,
  onSubmit,
  onNext,
  isSubmitting = false,
}: StepperWrapperProps) {
  const { currentStep, setCurrentStep, isBg } = useSellFormContext();
  const contentRef = useRef<HTMLDivElement>(null);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const progressPercent = (currentStep / totalSteps) * 100;

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleNext = async () => {
    if (onNext) {
      await onNext();
      return;
    }
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header - larger text, better visual hierarchy */}
      <header className="sticky top-0 z-40 border-b border-border bg-background pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Step indicator badge */}
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {currentStep}
            </span>
            <p className="text-sm font-bold text-foreground uppercase tracking-tight">
              {isBg ? steps[currentStep - 1]?.title.bg : steps[currentStep - 1]?.title.en}
            </p>
          </div>
          <span className="text-xs font-bold text-muted-foreground tabular-nums">
            {isBg ? `${currentStep} / ${totalSteps}` : `${currentStep} / ${totalSteps}`}
          </span>
        </div>
        {/* Progress bar - thicker for better visibility */}
        <div className="h-0.5 w-full bg-muted">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Content - more generous padding for readability */}
      <main ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-5">
          {children}
        </div>
      </main>

      {/* Footer - larger buttons, proper safe areas */}
      <footer className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          {!isFirstStep && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="h-11 w-11 shrink-0 rounded-xl p-0 border-border/50"
              aria-label={isBg ? "Назад" : "Back"}
            >
              <CaretLeft className="size-4.5" weight="bold" />
            </Button>
          )}

          {isLastStep ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="h-11 flex-1 gap-2 rounded-xl text-sm font-bold uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-4 animate-spin" />
                  {isBg ? "Публикуване..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Rocket className="size-4" weight="fill" />
                  {isBg ? "Публикувай" : "Publish Listing"}
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="h-11 flex-1 gap-2 rounded-xl text-sm font-bold uppercase tracking-wider"
            >
              {isBg ? "Продължи" : "Continue"}
              <ArrowRight className="size-4" weight="bold" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
