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
  isSubmitting?: boolean;
}

export function StepperWrapper({
  children,
  steps,
  onSubmit,
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

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header - larger text, better visual hierarchy */}
      <header className="sticky top-0 z-40 border-b border-border bg-background pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between px-section py-form">
          <div className="flex items-center gap-form-sm">
            {/* Step indicator badge */}
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {currentStep}
            </span>
            <p className="text-base font-semibold text-foreground">
              {isBg ? steps[currentStep - 1]?.title.bg : steps[currentStep - 1]?.title.en}
            </p>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {currentStep} of {totalSteps}
          </span>
        </div>
        {/* Progress bar - thicker for better visibility */}
        <div className="h-1.5 w-full bg-muted">
          <div 
            className="h-full bg-primary transition-[width] duration-300 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Content - more generous padding for readability */}
      <main ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-section py-section">
          {children}
        </div>
      </main>

      {/* Footer - larger buttons, proper safe areas */}
      <footer className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur-sm px-section py-form pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-lg items-center gap-form-sm">
          {!isFirstStep && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="h-touch-lg w-touch-lg shrink-0 rounded-2xl p-0"
              aria-label={isBg ? "Назад" : "Back"}
            >
              <CaretLeft className="size-5" weight="bold" />
            </Button>
          )}

          {isLastStep ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="h-touch-lg flex-1 gap-form-sm rounded-2xl text-base font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-5 animate-spin" />
                  {isBg ? "Публикуване..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Rocket className="size-5" weight="fill" />
                  {isBg ? "Публикувай" : "Publish Listing"}
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="h-touch-lg flex-1 gap-form-sm rounded-2xl text-base font-semibold"
            >
              {isBg ? "Продължи" : "Continue"}
              <ArrowRight className="size-5" weight="bold" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
