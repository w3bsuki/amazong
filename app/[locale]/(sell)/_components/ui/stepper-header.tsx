"use client";

import { X, House, Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

interface StepperHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: { en: string; bg: string }[];
  locale?: string;
  onClose?: () => void;
  onStepClick?: (step: number) => void;
  completedSteps?: number[];
}

export function StepperHeader({
  currentStep,
  totalSteps,
  stepTitles,
  locale = "en",
  onClose,
  onStepClick,
  completedSteps = [],
}: StepperHeaderProps) {
  const isBg = locale === "bg";
  const currentTitle = stepTitles[currentStep - 1];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Safe area padding for notch */}
      <div className="pt-[env(safe-area-inset-top)]" />
      
      {/* Top bar with actions */}
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Back to home */}
        <Link
          href="/"
          className="flex items-center justify-center size-11 -ml-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent active:bg-accent/80 transition-colors"
          aria-label={isBg ? "Начало" : "Home"}
        >
          <House className="size-5" weight="fill" />
        </Link>

        {/* Center: Current step title */}
        <div className="flex flex-col items-center flex-1 min-w-0 px-2">
          <span className="text-base font-semibold text-foreground truncate">
            {isBg ? currentTitle?.bg : currentTitle?.en}
          </span>
        </div>

        {/* Right: Close */}
        <Button
          variant="ghost"
          size="icon"
          className="size-11 -mr-1.5 rounded-full text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label={isBg ? "Затвори" : "Close"}
        >
          <X className="size-5" weight="bold" />
        </Button>
      </div>

      {/* Step dots / progress indicator */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNum = index + 1;
            const isCompleted = completedSteps.includes(stepNum) || stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            const isClickable = onStepClick && (isCompleted || stepNum <= currentStep);

            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => isClickable && onStepClick?.(stepNum)}
                disabled={!isClickable}
                className={cn(
                  "relative flex items-center justify-center transition-all duration-200",
                  // Current step: larger pill with number
                  isCurrent && "min-w-[2.5rem] h-7 px-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold",
                  // Completed step: checkmark dot
                  !isCurrent && isCompleted && "size-7 rounded-full bg-primary/15 text-primary hover:bg-primary/25",
                  // Future step: small dot
                  !isCurrent && !isCompleted && "size-2 rounded-full bg-muted-foreground/30",
                  // Clickable states
                  isClickable && !isCurrent && "cursor-pointer active:scale-95",
                  !isClickable && "cursor-default"
                )}
                aria-label={isBg 
                  ? `Стъпка ${stepNum}: ${stepTitles[index]?.bg}` 
                  : `Step ${stepNum}: ${stepTitles[index]?.en}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCurrent && stepNum}
                {!isCurrent && isCompleted && <Check className="size-3.5" weight="bold" />}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
