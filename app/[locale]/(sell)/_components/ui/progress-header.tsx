"use client";

import { Spinner, CloudCheck, FloppyDisk, CaretLeft, House } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/shared/page-container";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

interface ProgressHeaderProps {
  progressPercent: number;
  autoSaved: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSaveDraft: () => void;
  locale: string;
  currentStep: number;
  totalSteps: number;
}

/**
 * ProgressHeader - Sticky header showing form progress and save status
 * 
 * Displays:
 * - Back/Home link
 * - Progress bar (desktop) or step dots (mobile)
 * - Save status indicator
 * - Manual save button
 */
export function ProgressHeader({
  progressPercent,
  autoSaved,
  isSaving,
  hasUnsavedChanges,
  onSaveDraft,
  locale,
  currentStep,
  totalSteps,
}: ProgressHeaderProps) {
  const isBg = locale === "bg";
  const isComplete = progressPercent === 100;

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border/60">
      <PageContainer size="wide">
        {/* Top bar with logo and actions */}
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Left: Back/Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <CaretLeft className="size-4" weight="bold" />
            <House className="size-5" />
            <span className="hidden sm:inline text-sm font-medium">
              {isBg ? "Начало" : "Home"}
            </span>
          </Link>

          {/* Center: Progress indicator (Desktop) */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="flex items-center gap-4">
              <Progress
                value={progressPercent}
                className="h-1.5 flex-1"
                aria-label={`${isBg ? "Прогрес на формуляра" : "Form progress"}: ${progressPercent}%`}
              />
              <span className={cn(
                "text-sm font-semibold tabular-nums min-w-10 text-right",
                isComplete ? "text-primary" : "text-muted-foreground"
              )}>
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Center: Step indicator (Mobile) */}
          <div className="sm:hidden flex-1 flex justify-center">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i + 1 === currentStep ? "w-6 bg-primary" : "w-2 bg-muted-foreground/20"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Right: Save status + Actions */}
          <div className="flex items-center gap-2">
            {/* Save status indicator */}
            <div className={cn(
              "flex items-center gap-1.5 text-xs transition-opacity",
              (autoSaved || isSaving) ? "opacity-100" : "opacity-0"
            )}>
              {isSaving ? (
                <>
                  <Spinner className="size-3.5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground hidden sm:inline">
                    {isBg ? "Запазване..." : "Saving..."}
                  </span>
                </>
              ) : autoSaved ? (
                <>
                  <CloudCheck className="size-3.5 text-primary" />
                  <span className="text-primary hidden sm:inline">
                    {isBg ? "Запазено" : "Saved"}
                  </span>
                </>
              ) : null}
            </div>

            {/* Manual save button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSaveDraft}
              className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground"
              disabled={!hasUnsavedChanges}
            >
              <FloppyDisk className="size-4" />
              <span className="hidden sm:inline">
                {isBg ? "Запази" : "Save"}
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile progress bar (Bottom of header) */}
        <div className="sm:hidden pb-2">
          <div className="flex items-center gap-3">
            <Progress value={progressPercent} className="h-1 flex-1" />
            <span className={cn(
              "text-sm font-semibold tabular-nums",
              isComplete ? "text-primary" : "text-muted-foreground/60"
            )}>
              {progressPercent}%
            </span>
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
