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
    <footer className="fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border pb-safe">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Back button */}
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isFirstStep || isSubmitting}
          className={cn(
            "h-12 px-4 gap-2 font-medium",
            isFirstStep && "opacity-0 pointer-events-none"
          )}
        >
          <CaretLeft className="size-5" weight="bold" />
          {isBg ? "Назад" : "Back"}
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Next / Submit button */}
        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!isStepValid || isSubmitting}
            className="h-12 px-6 gap-2 font-semibold bg-green-600 hover:bg-green-700 text-white"
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
            onClick={onNext}
            disabled={!isStepValid || isSubmitting}
            className="h-12 px-6 gap-2 font-semibold"
          >
            {isBg ? "Напред" : "Next"}
            <CaretRight className="size-5" weight="bold" />
          </Button>
        )}
      </div>
    </footer>
  );
}
