"use client";

import { CaretLeft, CaretRight, Rocket, Spinner } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StepperNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  locale?: string;
}

export function StepperNavigation({
  currentStep,
  totalSteps,
  isStepValid,
  isSubmitting = false,
  onBack,
  onNext,
  onSubmit,
  locale = "en",
}: StepperNavigationProps) {
  const isBg = locale === "bg";
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border">
      {/* Safe area padding for home indicator */}
      <div className="flex items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* Back button - larger touch target */}
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isFirstStep || isSubmitting}
          className={cn(
            "h-12 min-w-22 gap-2 text-sm font-medium rounded-md transition-all",
            "active:scale-[0.98]",
            isFirstStep && "opacity-0 pointer-events-none"
          )}
        >
          <CaretLeft className="size-4" weight="bold" />
          {isBg ? "Назад" : "Back"}
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Next / Submit button - prominent CTA */}
        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!isStepValid || isSubmitting}
            className={cn(
              "h-12 min-w-32 gap-2 text-sm font-semibold rounded-md transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-4 animate-spin" />
                {isBg ? "Публикуване..." : "Publishing..."}
              </>
            ) : (
              <>
                <Rocket className="size-4" weight="fill" />
                {isBg ? "Публикувай" : "Publish"}
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!isStepValid || isSubmitting}
            className={cn(
              "h-12 min-w-26 gap-2 text-sm font-semibold rounded-md transition-all",
              "active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isBg ? "Напред" : "Continue"}
            <CaretRight className="size-4" weight="bold" />
          </Button>
        )}
      </div>
    </footer>
  );
}
