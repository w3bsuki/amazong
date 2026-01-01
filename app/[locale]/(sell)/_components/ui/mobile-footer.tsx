"use client";

import { Rocket, Spinner, ArrowRight, CaretLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileFooterProps {
  progressPercent: number;
  isSubmitting: boolean;
  onSubmit: () => void;
  locale: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
}

/**
 * MobileFooter - Sticky footer for mobile form navigation
 * 
 * Displays:
 * - Back button (when not on first step)
 * - Next/Submit button depending on current step
 * 
 * Phase 3: Updated to use shadcn Button variants with custom sizing
 */
export function MobileFooter({
  progressPercent,
  isSubmitting,
  onSubmit,
  locale,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  canGoNext,
}: MobileFooterProps) {
  const isBg = locale === "bg";
  const isLastStep = currentStep === totalSteps;
  const isComplete = progressPercent === 100;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-background border-t border-border pb-safe">
      <div className="px-4 py-3.5 flex items-center gap-3">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={onBack}
            className="rounded-md shrink-0"
            aria-label={isBg ? "Назад" : "Back"}
          >
            <CaretLeft className="size-5" weight="bold" />
          </Button>
        )}

        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || progressPercent < 50}
            size="lg"
            className={cn(
              "flex-1 h-12 rounded-md gap-2 text-sm font-semibold",
              !isComplete && "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-5 animate-spin" />
                {isBg ? "Публикуване..." : "Publishing..."}
              </>
            ) : (
              <>
                <Rocket className="size-5" weight="bold" />
                {isBg ? "Публикувай" : "Publish"}
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            size="lg"
            className="flex-1 h-12 rounded-md gap-2 text-sm font-semibold"
          >
            {isBg ? "Напред" : "Next"}
            <ArrowRight className="size-5" weight="bold" />
          </Button>
        )}
      </div>
    </div>
  );
}
