"use client";

import { X, House } from "@phosphor-icons/react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

interface StepperHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: { en: string; bg: string }[];
  locale?: string;
  onClose?: () => void;
}

export function StepperHeader({
  currentStep,
  totalSteps,
  stepTitles,
  locale = "en",
  onClose,
}: StepperHeaderProps) {
  const isBg = locale === "bg";
  const progressPercent = Math.round((currentStep / totalSteps) * 100);
  const currentTitle = stepTitles[currentStep - 1];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border safe-top">
      {/* Top bar */}
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Back to home */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <House className="size-5" weight="fill" />
        </Link>

        {/* Center: Step info */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground">
            {isBg ? `Стъпка ${currentStep} от ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {isBg ? currentTitle?.bg : currentTitle?.en}
          </span>
        </div>

        {/* Right: Close */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="size-5" weight="bold" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <Progress value={progressPercent} className="h-1.5 flex-1" />
          <span className={cn(
            "text-xs font-semibold tabular-nums min-w-[2.5rem] text-right",
            progressPercent === 100 ? "text-green-600" : "text-muted-foreground"
          )}>
            {progressPercent}%
          </span>
        </div>
      </div>
    </header>
  );
}
